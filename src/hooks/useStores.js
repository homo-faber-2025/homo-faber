import { useState, useEffect, useCallback, useMemo } from 'react';
import { getStores, getStoreById } from '@/utils/supabase/stores';

// 전역 캐시 객체
let storesCache = null;
let storesCacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5분

// 전역 캐시 객체 (스토어 ID별로 캐시)
const storeDetailCache = new Map();
const STORE_DETAIL_CACHE_DURATION = 10 * 60 * 1000; // 10분

/**
 * 스토어 목록을 가져오는 훅 (캐시 포함)
 * @returns {Object} stores, isLoading, error, refetch, invalidateCache
 */
export function useStores() {
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStores = useCallback(async (forceRefresh = false) => {
    // 캐시가 유효하고 강제 새로고침이 아닌 경우 캐시 사용
    if (!forceRefresh && storesCache && storesCacheTimestamp &&
      (Date.now() - storesCacheTimestamp) < CACHE_DURATION) {
      setStores(storesCache);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await getStores();
      const storesArray = Array.isArray(data) ? data : [];

      // 캐시 업데이트
      storesCache = storesArray;
      storesCacheTimestamp = Date.now();

      setStores(storesArray);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  // 캐시 무효화 함수
  const invalidateCache = useCallback(() => {
    storesCache = null;
    storesCacheTimestamp = null;
  }, []);

  return {
    stores,
    isLoading,
    error,
    refetch: () => fetchStores(true),
    invalidateCache
  };
}

/**
 * 스토어 상세 정보를 가져오는 훅
 * @param {string} storeId - 스토어 ID
 * @returns {Object} store, isLoading, error, refetch, invalidateCache
 */
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
      (Date.now() - cached.timestamp) < STORE_DETAIL_CACHE_DURATION) {
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

/**
 * 스토어 목록을 가져오는 간단한 훅 (캐시 없음)
 * @returns {Object} stores, loading, error
 */
export function useStoreList() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getStores();
        setStores(data || []);
      } catch (err) {
        console.error('Store 목록 가져오기 오류:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  return { stores, loading, error };
}

/**
 * 스토어 검색, 태그 필터링, 정렬 기능을 제공하는 훅
 * @param {Array} stores - 필터링할 스토어 목록
 * @param {string} searchKeyword - 검색 키워드
 * @param {Object} selectedTags - 선택된 태그들 {industry: [], capacity: [], material: []}
 * @param {string} sortBy - 정렬 방식 ('recommended', 'nameAsc', 'nameDesc')
 * @returns {Array} - 필터링 및 정렬된 스토어 목록
 */
export function useStoreFilters(
  stores,
  searchKeyword,
  selectedTags = null,
  sortBy = 'nameAsc',
) {
  return useMemo(() => {
    // 1. 검색어 필터링
    let filteredStores = stores;

    if (searchKeyword && searchKeyword.length >= 2) {
      const keyword = searchKeyword.toLowerCase();
      filteredStores = filteredStores.filter(
        (store) =>
          store.name?.toLowerCase().includes(keyword) ||
          (Array.isArray(store.keyword) &&
            store.keyword.some((k) => k.toLowerCase().includes(keyword))),
      );
    }

    // 2. 태그 필터링 (selectedTags가 제공된 경우에만)
    if (selectedTags) {
      const { industry, capacity, material } = selectedTags;

      // 선택된 태그가 있는 경우에만 필터링
      const hasIndustryFilter = industry?.length > 0;
      const hasCapacityFilter = capacity?.length > 0;
      const hasMaterialFilter = material?.length > 0;

      if (hasIndustryFilter || hasCapacityFilter || hasMaterialFilter) {
        filteredStores = filteredStores.filter((store) => {
          // 각 카테고리 내에서는 OR 조건, 카테고리 간에는 AND 조건
          const matchesIndustry =
            !hasIndustryFilter ||
            store.store_industry?.some(
              (item) =>
                item.industry_types?.name &&
                industry.includes(item.industry_types.name),
            );

          const matchesCapacity =
            !hasCapacityFilter ||
            store.store_capacity?.some(
              (item) =>
                item.capacity_types?.name &&
                capacity.includes(item.capacity_types.name),
            );

          const matchesMaterial =
            !hasMaterialFilter ||
            store.store_material?.some(
              (item) =>
                item.material_types?.name &&
                material.includes(item.material_types.name),
            );

          return matchesIndustry && matchesCapacity && matchesMaterial;
        });
      }
    }

    // 3. 정렬
    const sortedStores = [...filteredStores];

    switch (sortBy) {
      case 'recommended':
        // 추천순 정렬 - keyword가 있는 스토어를 위로
        sortedStores.sort((a, b) => {
          const aHasKeyword = Array.isArray(a.keyword) && a.keyword.length > 0;
          const bHasKeyword = Array.isArray(b.keyword) && b.keyword.length > 0;

          // keyword가 있는 스토어를 위로
          if (aHasKeyword && !bHasKeyword) return -1;
          if (!aHasKeyword && bHasKeyword) return 1;

          // 둘 다 keyword가 있거나 둘 다 없는 경우 이름순으로 정렬
          return (a.name || '').localeCompare(b.name || '');
        });
        break;

      case 'nameDesc':
        // 이름 내림차순 정렬
        sortedStores.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
        break;

      case 'nameAsc':
      default:
        // 이름 오름차순 정렬 (기본값)
        sortedStores.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
    }

    return sortedStores;
  }, [stores, searchKeyword, selectedTags, sortBy]);
}

/**
 * 모든 스토어에서 태그를 추출하는 함수
 * @param {Array} stores - 스토어 목록
 * @returns {Object} - 추출된 태그들 {industry: [], capacity: [], material: []}
 */
export function extractAllTags(stores) {
  const allTags = {
    industry: new Set(),
    capacity: new Set(),
    material: new Set(),
  };

  stores.forEach(store => {
    // store_industry에서 industry 태그 추출
    if (store.store_industry) {
      store.store_industry.forEach(item => {
        if (item.industry_types?.name) {
          allTags.industry.add(item.industry_types.name);
        }
      });
    }

    // store_capacity에서 capacity 태그 추출
    if (store.store_capacity) {
      store.store_capacity.forEach(item => {
        if (item.capacity_types?.name) {
          allTags.capacity.add(item.capacity_types.name);
        }
      });
    }

    // store_material에서 material 태그 추출
    if (store.store_material) {
      store.store_material.forEach(item => {
        if (item.material_types?.name) {
          allTags.material.add(item.material_types.name);
        }
      });
    }
  });

  return {
    industry: Array.from(allTags.industry).sort(),
    capacity: Array.from(allTags.capacity).sort(),
    material: Array.from(allTags.material).sort(),
  };
}
