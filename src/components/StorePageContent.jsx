'use client';

import { useState } from 'react';
import Search from '@/components/Search';
import StoreFilters from '@/components/StoreFilters';
import StoreSorting from '@/components/StoreSorting';
import StoreList from '@/components/StoreList';
import { useStores, extractAllTags } from '@/hooks/useStores';
import { useApp } from '@/contexts/AppContext';

function StorePageContent({ onStoreSelect, isPanel = false }) {
  const { stores } = useApp(); // 전역 상태에서 stores 가져오기
  const [searchKeyword, setSearchKeyword] = useState('');

  // 태그 필터링을 위한 상태
  const [selectedTags, setSelectedTags] = useState({
    industry: [],
    capacity: [],
    material: [],
  });

  // 정렬 방식을 위한 상태
  const [sortBy, setSortBy] = useState('nameAsc');

  // 모든 가능한 태그 목록 - 실시간 계산
  const allTags = extractAllTags(stores);

  // 확장된 useStores 훅 사용 (정렬 포함)
  const filteredStores = useStores(stores, searchKeyword, selectedTags, sortBy);

  // 검색 키워드 처리
  const handleSearch = (keyword) => {
    setSearchKeyword(keyword);
  };

  // 태그 클릭 처리
  const handleTagClick = (tagType, tagName) => {
    setSelectedTags((prev) => {
      const newTags = { ...prev };

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

  return (
    <div className={isPanel ? 'store-content-panel' : 'store-content-page'}>
      <Search onSearch={handleSearch} />

      <StoreFilters
        allTags={allTags}
        selectedTags={selectedTags}
        onTagClick={handleTagClick}
      />

      <StoreSorting sortBy={sortBy} onSortChange={handleSortChange} />

      <StoreList stores={filteredStores} onStoreSelect={onStoreSelect} />

      <style jsx>{`
        .store-content-panel {
          padding: 16px;
          height: 100%;
          overflow-y: auto;
        }

        .store-content-page {
          padding: 20px;
          min-height: 100vh;
        }
      `}</style>
    </div>
  );
}

export default StorePageContent;
