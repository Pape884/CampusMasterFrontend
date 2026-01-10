'use client';

import React, { createContext, useContext, useRef } from 'react';
import { cacheManager } from '../api/axios/cache';

interface ApiContextType {
  cache: typeof cacheManager;
  clearCache: () => void;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export function ApiProvider({ children }: { children: React.ReactNode }) {
  const cacheRef = useRef(cacheManager);

  const clearCache = () => {
    cacheRef.current.clear();
  };

  return (
    <ApiContext.Provider
      value={{
        cache: cacheRef.current,
        clearCache,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
}

export function useApi() {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within ApiProvider');
  }
  return context;
}