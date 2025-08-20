import { useState, useEffect, useCallback } from 'react';
import { getStoreById } from '@/utils/supabase/stores';

// 전역 캐시 객체 (스토어 ID별로 캐시)
const storeDetailCache = new Map();
const CACHE_DURATION = 10 * 60 * 1000; // 10분

export function useStoreDetail(storeId) {
  const [store, setStore] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStore = useCallback(async (forceRefresh = false) => {
    if (!storeId) {
      setStore(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    // 캐시 확인
    const cached = storeDetailCache.get(storeId);
    if (!forceRefresh && cached &&
      (Date.now() - cached.timestamp) < CACHE_DURATION) {
      setStore(cached.data);
      setIsLoading(false);
      setError(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await getStoreById(storeId);

      if (!data) {
        throw new Error('스토어를 찾을 수 없습니다.');
      }

      // 캐시 업데이트
      storeDetailCache.set(storeId, {
        data,
        timestamp: Date.now()
      });

      setStore(data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [storeId]);

  useEffect(() => {
    fetchStore();
  }, [fetchStore]);

  // 캐시 무효화 함수
  const invalidateCache = useCallback(() => {
    if (storeId) {
      storeDetailCache.delete(storeId);
    }
  }, [storeId]);

  return {
    store,
    isLoading,
    error,
    refetch: () => fetchStore(true),
    invalidateCache
  };
}
