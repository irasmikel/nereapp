import { useState, useEffect } from 'react';
import { storage } from '../services/storage';

const STORAGE_KEY = 'settings';

const DEFAULT_SETTINGS = {
  userName: 'Mi Hogar',
  theme: 'light',
  accentColor: 'sage',
  showMotivation: true,
  dailyLimit: 8,
  weekStartsOn: 1, // 1 = Monday
  defaultDuration: 15,
  defaultCategory: 'general',
  defaultPriority: 'medium',
  notificationsEnabled: false,
  compactMode: false,
  language: 'es',
};

export function useSettings() {
  const [settings, setSettings] = useState(() => {
    const saved = storage.get(STORAGE_KEY);
    return saved ? { ...DEFAULT_SETTINGS, ...saved } : DEFAULT_SETTINGS;
  });

  useEffect(() => {
    storage.set(STORAGE_KEY, settings);
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const updateSettings = (updates) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return { settings, updateSetting, updateSettings, resetSettings };
}
