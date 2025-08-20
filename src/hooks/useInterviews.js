import { useState, useEffect, useCallback } from 'react';
import { getInterviews } from '@/utils/supabase/interview';

// 전역 캐시 객체
let interviewsCache = null;
let interviewsCacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5분

export function useInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInterviews = useCallback(async (forceRefresh = false) => {
    // 캐시가 유효하고 강제 새로고침이 아닌 경우 캐시 사용
    if (!forceRefresh && interviewsCache && interviewsCacheTimestamp &&
      (Date.now() - interviewsCacheTimestamp) < CACHE_DURATION) {
      setInterviews(interviewsCache);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await getInterviews();
      const interviewsArray = Array.isArray(data) ? data : [];

      // 캐시 업데이트
      interviewsCache = interviewsArray;
      interviewsCacheTimestamp = Date.now();

      setInterviews(interviewsArray);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  // 캐시 무효화 함수
  const invalidateCache = useCallback(() => {
    interviewsCache = null;
    interviewsCacheTimestamp = null;
  }, []);

  return {
    interviews,
    isLoading,
    error,
    refetch: () => fetchInterviews(true),
    invalidateCache
  };
}
