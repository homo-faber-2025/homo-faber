'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { getStores } from '@/utils/supabase/stores';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);

  useEffect(() => {
    async function fetchStores() {
      try {
        const data = await getStores();
        setStores(data);
      } catch (err) {
        setError(err);
        console.error('스토어 데이터 로딩 실패:', err);
      } finally {
        setIsLoading(false);
      }
    }

    // 데이터가 없을 때만 로딩
    if (stores.length === 0 && !error) {
      fetchStores();
    }
  }, []);

  const value = {
    stores,
    setStores,
    isLoading,
    error,
    mapInstance,
    setMapInstance,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
