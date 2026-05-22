/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { AppData } from '@/types';
import { defaultData } from '@/data/defaultData';

interface DataContextType {
  data: AppData;
  updateProfile: (profile: AppData['profile']) => void;
  updateExperiences: (experiences: AppData['experiences']) => void;
  updateEducations: (educations: AppData['educations']) => void;
  updateActivities: (activities: AppData['activities']) => void;
  updateProjects: (projects: AppData['projects']) => void;
  updateBlogPosts: (blogPosts: AppData['blogPosts']) => void;
  updateContacts: (contacts: AppData['contacts']) => void;
  updateRecommendations: (recommendations: AppData['recommendations']) => void;
  updateChatMessages: (chatMessages: AppData['chatMessages']) => void;
  updatePinnedMessage: (pinnedMessage: AppData['pinnedMessage']) => void;
  updateSettings: (settings: AppData['settings']) => void;
  updateTechStacks: (techStacks: AppData['techStacks']) => void;
  resetToDefaults: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEY = 'portfolio_data';

function loadData(): AppData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...defaultData, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.error('Error loading data from localStorage:', e);
  }
  return { ...defaultData };
}

function saveData(data: AppData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving data to localStorage:', e);
  }
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(loadData);

  useEffect(() => {
    saveData(data);
  }, [data]);

  const updateProfile = useCallback((profile: AppData['profile']) => {
    setData((prev) => ({ ...prev, profile }));
  }, []);

  const updateExperiences = useCallback((experiences: AppData['experiences']) => {
    setData((prev) => ({ ...prev, experiences }));
  }, []);

  const updateEducations = useCallback((educations: AppData['educations']) => {
    setData((prev) => ({ ...prev, educations }));
  }, []);

  const updateActivities = useCallback((activities: AppData['activities']) => {
    setData((prev) => ({ ...prev, activities }));
  }, []);

  const updateProjects = useCallback((projects: AppData['projects']) => {
    setData((prev) => ({ ...prev, projects }));
  }, []);

  const updateBlogPosts = useCallback((blogPosts: AppData['blogPosts']) => {
    setData((prev) => ({ ...prev, blogPosts }));
  }, []);

  const updateContacts = useCallback((contacts: AppData['contacts']) => {
    setData((prev) => ({ ...prev, contacts }));
  }, []);

  const updateRecommendations = useCallback((recommendations: AppData['recommendations']) => {
    setData((prev) => ({ ...prev, recommendations }));
  }, []);

  const updateChatMessages = useCallback((chatMessages: AppData['chatMessages']) => {
    setData((prev) => ({ ...prev, chatMessages }));
  }, []);

  const updatePinnedMessage = useCallback((pinnedMessage: AppData['pinnedMessage']) => {
    setData((prev) => ({ ...prev, pinnedMessage }));
  }, []);

  const updateSettings = useCallback((settings: AppData['settings']) => {
    setData((prev) => ({ ...prev, settings }));
  }, []);

  const updateTechStacks = useCallback((techStacks: AppData['techStacks']) => {
    setData((prev) => ({ ...prev, techStacks }));
  }, []);

  const resetToDefaults = useCallback(() => {
    setData({ ...defaultData });
  }, []);

  return (
    <DataContext.Provider
      value={{
        data,
        updateProfile,
        updateExperiences,
        updateEducations,
        updateActivities,
        updateProjects,
        updateBlogPosts,
        updateContacts,
        updateRecommendations,
        updateChatMessages,
        updatePinnedMessage,
        updateSettings,
        updateTechStacks,
        resetToDefaults,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
