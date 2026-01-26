import { useState, useEffect } from 'react';
import { DatasetHistory } from '@/types/dataset';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export const useDatasetHistory = () => {
  const [history, setHistory] = useState<DatasetHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchHistory();
    } else {
      setHistory([]);
      setLoading(false);
    }
  }, [user]);

  const fetchHistory = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('dataset_history')
        .select('data')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to fetch history:', error);
        return;
      }

      const historyData = data?.map(item => item.data as DatasetHistory) || [];
      setHistory(historyData);
    } catch (e) {
      console.error('Failed to fetch history:', e);
    } finally {
      setLoading(false);
    }
  };

  const saveHistory = async (newHistory: DatasetHistory[]) => {
    if (!user) return;

    setHistory(newHistory);

    try {
      // First, delete all existing records for this user
      await supabase
        .from('dataset_history')
        .delete()
        .eq('user_id', user.id);

      // Then insert the new history
      if (newHistory.length > 0) {
        const records = newHistory.map(item => ({
          user_id: user.id,
          data: item
        }));

        const { error } = await supabase
          .from('dataset_history')
          .insert(records);

        if (error) {
          console.error('Failed to save history:', error);
        }
      }
    } catch (e) {
      console.error('Failed to save history:', e);
    }
  };

  const addToHistory = async (dataset: DatasetHistory) => {
    if (!user) return;

    const newHistory = [dataset, ...history.filter(h => h.id !== dataset.id)].slice(0, 20);
    await saveHistory(newHistory);
  };

  const updateDataset = async (id: string, updates: Partial<DatasetHistory>) => {
    if (!user) return;

    const newHistory = history.map(h => 
      h.id === id ? { ...h, ...updates } : h
    );
    await saveHistory(newHistory);
  };

  const removeFromHistory = async (id: string) => {
    if (!user) return;

    const newHistory = history.filter(h => h.id !== id);
    await saveHistory(newHistory);
  };

  const getDataset = (id: string) => {
    return history.find(h => h.id === id);
  };

  const clearHistory = async () => {
    if (!user) return;

    await saveHistory([]);
  };

  return {
    history,
    loading,
    addToHistory,
    updateDataset,
    removeFromHistory,
    getDataset,
    clearHistory
  };
};
