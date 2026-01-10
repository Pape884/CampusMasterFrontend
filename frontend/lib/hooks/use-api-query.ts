'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseApiQueryOptions<T> {
    queryFn: () => Promise<T>;
    queryKey: string | string[];
    enabled?: boolean;
    staleTime?: number;
    suspense?: boolean; // Support Suspense
}

export function useApiQuery<T>({
    queryFn,
    queryKey,
    enabled = true,
    staleTime = 30000,
    suspense = false,
}: UseApiQueryOptions<T>) {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [isFetching, setIsFetching] = useState(false);

    const cacheKey = Array.isArray(queryKey) ? queryKey.join(':') : queryKey;
    const lastFetchRef = useRef<number>(0);

    const fetchData = useCallback(async (forceRefresh = false) => {
        if (!enabled) return;

        const now = Date.now();
        const isStale = now - lastFetchRef.current > staleTime;

        // Skip if not stale and not forced
        if (!forceRefresh && !isStale && data) {
            return data;
        }

        setIsLoading(true);
        setIsFetching(true);
        setError(null);

        try {
            const result = await queryFn();
            setData(result);
            lastFetchRef.current = Date.now();
            return result;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Request failed');
            setError(error);
            throw error; // Pour Suspense
        } finally {
            setIsLoading(false);
            setIsFetching(false);
        }
    }, [queryFn, enabled, staleTime, data]);

    // Initial fetch
    useEffect(() => {
        if (enabled && !suspense) {
            fetchData();
        }
    }, [enabled, suspense]);

    // Pour Suspense
    if (suspense && !data && !error && enabled) {
        throw fetchData();
    }

    return {
        data,
        isLoading,
        isFetching,
        error,
        refetch: () => fetchData(true),
    };
}