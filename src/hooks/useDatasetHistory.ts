import { useState, useEffect } from 'react';
import { DatasetHistory } from '@/types/dataset';

const STORAGE_KEY = 'dataCraft_history';

const USERS_STORAGE_KEY = 'dataCraft_users';

export const useDatasetHistory = () => {
  const [history, setHistory] = useState<DatasetHistory[]>([]);

  useEffect(() => {
    const loadHistory = () => {
      const currentEmail = localStorage.getItem('dataCraft_currentUserEmail');
      const usersData = localStorage.getItem(USERS_STORAGE_KEY);
      
      if (currentEmail && usersData) {
        try {
          const users = JSON.parse(usersData);
          if (users[currentEmail] && users[currentEmail].history) {
            setHistory(users[currentEmail].history);
            return;
          }
        } catch (e) {
          console.error('Failed to parse users data for history:', e);
        }
      }

      // Fallback to legacy single-user storage
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setHistory(JSON.parse(stored));
        } catch (e) {
          console.error('Failed to parse history:', e);
        }
      } else {
        setHistory([]);
      }
    };

    loadHistory();

    // Listen for storage changes (like login/logout)
    window.addEventListener('storage', loadHistory);
    // Custom event for same-window updates
    window.addEventListener('user-changed', loadHistory);
    
    return () => {
      window.removeEventListener('storage', loadHistory);
      window.removeEventListener('user-changed', loadHistory);
    };
  }, []);

  const saveHistory = (newHistory: DatasetHistory[]) => {
    setHistory(newHistory);
    
    // Save to legacy key for compatibility
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));

    // Save to multi-user storage
    const currentEmail = localStorage.getItem('dataCraft_currentUserEmail');
    if (currentEmail) {
      const usersData = localStorage.getItem(USERS_STORAGE_KEY);
      let users: Record<string, any> = {};
      try {
        users = usersData ? JSON.parse(usersData) : {};
      } catch (e) {
        users = {};
      }
      
      if (!users[currentEmail]) {
        users[currentEmail] = { profile: {}, actions: [], history: [] };
      }
      
      users[currentEmail].history = newHistory;
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    }
  };

  const addToHistory = (dataset: DatasetHistory) => {
    const newHistory = [dataset, ...history.filter(h => h.id !== dataset.id)].slice(0, 20);
    saveHistory(newHistory);
  };

  const updateDataset = (id: string, updates: Partial<DatasetHistory>) => {
    const newHistory = history.map(h => 
      h.id === id ? { ...h, ...updates } : h
    );
    saveHistory(newHistory);
  };

  const removeFromHistory = (id: string) => {
    const newHistory = history.filter(h => h.id !== id);
    saveHistory(newHistory);
  };

  const getDataset = (id: string) => {
    return history.find(h => h.id === id);
  };

  const clearHistory = () => {
    saveHistory([]);
  };

  return {
    history,
    addToHistory,
    updateDataset,
    removeFromHistory,
    getDataset,
    clearHistory
  };
};
