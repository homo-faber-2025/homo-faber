'use client';

import { useEffect, useState } from 'react';
import Search from '@/components/Search';
import StoreFilters from '@/components/StoreFilters';
import StoreSorting from '@/components/StoreSorting';
import StoreList from '@/components/StoreList';
import { getStores } from '@/utils/supabase/stores';
import { useStores, extractAllTags } from '@/hooks/useStores';

function StorePage() {
  const [stores, setStores] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 태그 필터링을 위한 상태
  const [selectedTags, setSelectedTags] = useState({
    industry: [],
    capacity: [],
    material: [],
  });

  // 정렬 방식을 위한 상태
  const [sortBy, setSortBy] = useState('nameAsc');

  // 모든 가능한 태그 목록
  const [allTags, setAllTags] = useState({
    industry: [],
    capacity: [],
    material: [],
  });

  // 확장된 useStores 훅 사용 (정렬 포함)
  const filteredStores = useStores(stores, searchKeyword, selectedTags, sortBy);

  useEffect(() => {
    async function fetchStores() {
      try {
        const data = await getStores();
        setStores(data);

        // 모든 가능한 태그 추출
        const tags = extractAllTags(data);
        setAllTags(tags);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStores();
  }, []);

  // 검색 키워드 처리
  const handleSearch = (keyword) => {
    setSearchKeyword(keyword);
  };

  // 태그 클릭 처리
  const handleTagClick = (tagType, tagName) => {
    setSelectedTags((prev) => {
      const newTags = { ...prev };

      // 이미 선택된 태그인 경우 제거, 아니면 추가
      if (newTags[tagType].includes(tagName)) {
        newTags[tagType] = newTags[tagType].filter((tag) => tag !== tagName);
      } else {
        newTags[tagType] = [...newTags[tagType], tagName];
      }

      return newTags;
    });
  };

  // 정렬 방식 변경 처리
  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  if (error) {
    return <div>에러가 발생했습니다: {error.message}</div>;
  }

  return (
    <>
      <Search onSearch={handleSearch} />

      <StoreFilters
        allTags={allTags}
        selectedTags={selectedTags}
        onTagClick={handleTagClick}
      />

      <StoreSorting sortBy={sortBy} onSortChange={handleSortChange} />

      {isLoading ? (
        <div>로딩 중...</div>
      ) : (
        <StoreList stores={filteredStores} />
      )}
    </>
  );
}

export default StorePage;
