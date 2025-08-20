import { useState, useEffect, useCallback } from 'react';
import { getInterviewById } from '@/utils/supabase/interview';

// 전역 캐시 객체 (인터뷰 ID별로 캐시)
const interviewDetailCache = new Map();
const CACHE_DURATION = 10 * 60 * 1000; // 10분

export function useInterviewDetail(interviewId) {
  const [interview, setInterview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInterview = useCallback(async (forceRefresh = false) => {
    if (!interviewId) {
      setInterview(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    // 캐시 확인
    const cached = interviewDetailCache.get(interviewId);
    if (!forceRefresh && cached &&
      (Date.now() - cached.timestamp) < CACHE_DURATION) {
      setInterview(cached.data);
      setIsLoading(false);
      setError(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await getInterviewById(interviewId);

      if (!data) {
        throw new Error('인터뷰를 찾을 수 없습니다.');
      }

      // 캐시 업데이트
      interviewDetailCache.set(interviewId, {
        data,
        timestamp: Date.now()
      });

      setInterview(data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [interviewId]);

  useEffect(() => {
    fetchInterview();
  }, [fetchInterview]);

  // 캐시 무효화 함수
  const invalidateCache = useCallback(() => {
    if (interviewId) {
      interviewDetailCache.delete(interviewId);
    }
  }, [interviewId]);

  return {
    interview,
    isLoading,
    error,
    refetch: () => fetchInterview(true),
    invalidateCache
  };
}
