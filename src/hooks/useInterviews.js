import { useState, useEffect, useCallback } from 'react';
import { getInterviews, getInterviewById } from '@/utils/supabase/interview';

// 전역 캐시 객체
let interviewsCache = null;
let interviewsCacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5분

// 전역 캐시 객체 (인터뷰 ID별로 캐시)
const interviewDetailCache = new Map();
const INTERVIEW_DETAIL_CACHE_DURATION = 10 * 60 * 1000; // 10분

/**
 * 인터뷰 목록을 가져오는 훅 (캐시 포함)
 * @returns {Object} interviews, isLoading, error, refetch, invalidateCache
 */
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

/**
 * 인터뷰 상세 정보를 가져오는 훅
 * @param {string} interviewId - 인터뷰 ID
 * @returns {Object} interview, isLoading, error, refetch, invalidateCache
 */
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
      (Date.now() - cached.timestamp) < INTERVIEW_DETAIL_CACHE_DURATION) {
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
