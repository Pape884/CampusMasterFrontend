'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { userService, UserFilters } from '@/lib/api/services/user.service';
import { cacheManager } from '@/lib/api/axios/cache';
import { UsersResponse } from '../api/services';

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

  //memoriser le filtre
  const memoizedFilters = useMemo(() => ({
    search: filters.search,
    status: filters.status,
    page: filters.page,
    limit: filters.limit,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
  }), [
    filters.search,
    filters.status,
    filters.page,
    filters.limit,
    filters.sortBy,
    filters.sortOrder,
  ]);

  const fetchUsers = useCallback(async (isRefresh = false) => {

    if (!enabled) return;

    isRefresh ? setIsRefreshing(true) : setIsLoading(true);
    setError(null);

    try {
      const result = await userService.getUsers(memoizedFilters);
      setData(result);
      onSuccess?.(result);
      return result;
    } catch (err: any) {
      const error = err instanceof Error ? err : new Error("Erreur de chargement");
      setError(error);
      onError?.(error);
      throw error;
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [enabled, memoizedFilters, onSuccess, onError]);


  // Chargement initial

  useEffect(() => {
    if (!enabled || data) return;
    fetchUsers();
  }, [enabled]);

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