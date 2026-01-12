'use client';

import { useState, useEffect, useCallback } from 'react';
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

  const fetchDepartments = useCallback(async (isRefresh = false) => {
    if (!enabled) return;

    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    
    setError(null);

    try {
      const result = await departmentService.getDepartments(filters);
      
      setData(result);
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      console.log(`✅ ${result.departments.length} départements chargés`);
      
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
      fetchDepartments();
    }
  }, [fetchDepartments, refetchOnMount, enabled]);

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