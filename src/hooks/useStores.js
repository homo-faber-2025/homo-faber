import { useState, useEffect, useCallback, useMemo } from 'react';
import { getStores } from '@/utils/supabase/stores';

// 전역 캐시 객체
let storesCache = null;
let storesCacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5분

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
 * 스토어 검색, 태그 필터링, 정렬 기능을 제공하는 hook
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
            store.store_tags?.some(
              (tag) =>
                tag.industry_types?.name &&
                industry.includes(tag.industry_types.name),
            );

          const matchesCapacity =
            !hasCapacityFilter ||
            store.store_tags?.some(
              (tag) =>
                tag.capacity_types?.name &&
                capacity.includes(tag.capacity_types.name),
            );

          const matchesMaterial =
            !hasMaterialFilter ||
            store.store_tags?.some(
              (tag) =>
                tag.material_types?.name &&
                material.includes(tag.material_types.name),
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

// 태그 추출 함수
export function extractAllTags(stores) {
  const allTags = {
    industry: new Set(),
    capacity: new Set(),
    material: new Set(),
  };

  stores.forEach(store => {
    if (store.store_tags) {
      store.store_tags.forEach(tag => {
        if (tag.industry_types?.name) {
          allTags.industry.add(tag.industry_types.name);
        }
        if (tag.capacity_types?.name) {
          allTags.capacity.add(tag.capacity_types.name);
        }
        if (tag.material_types?.name) {
          allTags.material.add(tag.material_types.name);
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
