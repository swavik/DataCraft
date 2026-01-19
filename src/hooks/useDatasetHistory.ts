import { useState, useEffect } from 'react';
import { DatasetHistory } from '@/types/dataset';

const STORAGE_KEY = 'dataCraft_history';

export const useDatasetHistory = () => {
  const [history, setHistory] = useState<DatasetHistory[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse history:', e);
      }
    }
  }, []);

  const saveHistory = (newHistory: DatasetHistory[]) => {
    setHistory(newHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
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
