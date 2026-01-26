import { useState, useEffect } from 'react';

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  joinedDate: string;
}

export interface UserAction {
  id: string;
  type: 'upload' | 'generate' | 'view' | 'download' | 'delete';
  description: string;
  timestamp: string;
}

const STORAGE_KEY = 'dataCraft_userProfile';
const ACTIONS_STORAGE_KEY = 'dataCraft_userActions';
const USERS_STORAGE_KEY = 'dataCraft_users';

interface UserData {
  profile: UserProfile;
  actions: UserAction[];
}

const defaultProfile: UserProfile = {
  name: 'Guest User',
  email: 'guest@example.com',
  phone: 'Not provided',
  joinedDate: new Date().toISOString(),
};

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [actions, setActions] = useState<UserAction[]>([]);

  useEffect(() => {
    const loadProfile = () => {
      // Try to get current user's specific data first
      const currentEmail = localStorage.getItem('dataCraft_currentUserEmail');
      const usersData = localStorage.getItem(USERS_STORAGE_KEY);
      
      if (currentEmail && usersData) {
        try {
          const users = JSON.parse(usersData);
          if (users[currentEmail]) {
            setProfile(users[currentEmail].profile);
            setActions(users[currentEmail].actions || []);
            return;
          }
        } catch (e) {
          console.error('Failed to parse users data:', e);
        }
      }

      // Fallback to legacy single-user storage or defaults
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setProfile(JSON.parse(stored));
        } catch (e) {
          console.error('Failed to parse profile:', e);
        }
      } else {
        setProfile(defaultProfile);
      }

      const storedActions = localStorage.getItem(ACTIONS_STORAGE_KEY);
      if (storedActions) {
        try {
          setActions(JSON.parse(storedActions));
        } catch (e) {
          console.error('Failed to parse actions:', e);
        }
      } else {
        setActions([]);
      }
    };

    loadProfile();

    window.addEventListener('storage', loadProfile);
    window.addEventListener('user-changed', loadProfile);
    
    return () => {
      window.removeEventListener('storage', loadProfile);
      window.removeEventListener('user-changed', loadProfile);
    };
  }, []);

  const saveUserData = (newProfile: UserProfile, newActions: UserAction[]) => {
    // Save to legacy keys for compatibility
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
    localStorage.setItem(ACTIONS_STORAGE_KEY, JSON.stringify(newActions));

    // Save to multi-user storage
    const currentEmail = newProfile.email;
    if (currentEmail) {
      const usersData = localStorage.getItem(USERS_STORAGE_KEY);
      let users: Record<string, UserData> = {};
      try {
        users = usersData ? JSON.parse(usersData) : {};
      } catch (e) {
        users = {};
      }
      users[currentEmail] = { profile: newProfile, actions: newActions };
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      localStorage.setItem('dataCraft_currentUserEmail', currentEmail);
    }
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    const newProfile = { ...profile, ...updates };
    setProfile(newProfile);
    saveUserData(newProfile, actions);
  };

  const addAction = (action: Omit<UserAction, 'id' | 'timestamp'>) => {
    const newAction: UserAction = {
      ...action,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    const newActions = [newAction, ...actions].slice(0, 50);
    setActions(newActions);
    saveUserData(profile, newActions);
  };

  const clearActions = () => {
    setActions([]);
    saveUserData(profile, []);
  };

  return {
    profile,
    actions,
    updateProfile,
    addAction,
    clearActions,
  };
};
