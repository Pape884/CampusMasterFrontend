'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { cacheManager } from '@/lib/api/axios/cache';
import { DepartmentFilters, DepartmentsResponse } from '../api/services';
import { departmentService } from '../api/services/department.service';

interface UseDepartmentsQueryOptions extends DepartmentFilters {
  enabled?: boolean;
  refetchOnMount?: boolean;
  onSuccess?: (data: DepartmentsResponse) => void;
  onError?: (error: Error) => void;
}

export function useDepartmentsQuery(options: UseDepartmentsQueryOptions = {}) {
  const {
    enabled = true,
    refetchOnMount = true,
    onSuccess,
    onError,
    ...filters
  } = options;

  const [data, setData] = useState<DepartmentsResponse | null>(null);
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


  const fetchDepartments = useCallback(async (isRefresh = false) => {
    if (!enabled) return;

    setIsLoading(!isRefresh);
    setIsRefreshing(isRefresh);

    try {
      const result = await departmentService.getDepartments(memoizedFilters);
      setData(result);
      onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Erreur");
      setError(error);
      onError?.(error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [enabled, memoizedFilters, onSuccess, onError]);


  // Chargement initial
  useEffect(() => {
    if (refetchOnMount && enabled) {
      fetchDepartments();
    }
  }, [fetchDepartments]);


  // Rafraîchir avec les mêmes filtres
  const refetch = useCallback(() => {
    return fetchDepartments(true);
  }, [fetchDepartments]);

  // Vider le cache et recharger
  const invalidateAndRefetch = useCallback(() => {
    cacheManager.deleteByPrefix('departments:');
    return fetchDepartments(true);
  }, [fetchDepartments]);


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