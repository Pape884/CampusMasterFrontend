'use client';

import { useState, useEffect, useCallback } from 'react';
import { userService, User, UserFilters, UsersResponse } from '@/lib/api/services/user.service';
import { cacheManager } from '@/lib/api/axios/cache';

interface UseUsersQueryOptions extends UserFilters {
  enabled?: boolean;
  refetchOnMount?: boolean;
  onSuccess?: (data: UsersResponse) => void;
  onError?: (error: Error) => void;
}

export function useUsersQuery(options: UseUsersQueryOptions = {}) {
  const {
    enabled = true,
    refetchOnMount = true,
    onSuccess,
    onError,
    ...filters
  } = options;

  const [data, setData] = useState<UsersResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchUsers = useCallback(async (isRefresh = false) => {
    if (!enabled) return;

    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    
    setError(null);

    try {
      const result = await userService.getUsers(filters);
      
      setData(result);
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      console.log(`✅ ${result.users.length} utilisateurs chargés`);
      
      return result;
    } catch (err: any) {
      const error = err instanceof Error ? err : new Error('Erreur de chargement');
      setError(error);
      
      if (onError) {
        onError(error);
      }
      
      throw error;
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [enabled, filters, onSuccess, onError]);

  // Chargement initial
  useEffect(() => {
    if (refetchOnMount && enabled) {
      fetchUsers();
    }
  }, [fetchUsers, refetchOnMount, enabled]);

  // Rafraîchir avec les mêmes filtres
  const refetch = useCallback(() => {
    return fetchUsers(true);
  }, [fetchUsers]);

  // Vider le cache et recharger
  const invalidateAndRefetch = useCallback(() => {
    cacheManager.deleteByPrefix('users:');
    return fetchUsers(true);
  }, [fetchUsers]);

  return {
    data,
    isLoading,
    isRefreshing,
    error,
    refetch,
    invalidateAndRefetch,
    filters,
  };
}