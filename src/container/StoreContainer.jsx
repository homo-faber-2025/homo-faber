'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Search from '@/components/store/Search';
import StoreFilters from '@/components/store/StoreFilters';
import StoreSorting from '@/components/store/StoreSorting';
import StoreList from '@/components/store/StoreList';
import { getStores } from '@/utils/supabase/stores';
import { useStores, extractAllTags } from '@/hooks/useStores';
import styled from '@emotion/styled';

const StoreWrapper = styled.main`
  width: ${(props) => (props.pathname === '/store' ? '80vw' : '10vw')};
  height: 100dvh;
  padding-left: 50px;
  position: absolute;
  right: 0px;
  top: 0px;
  z-index: 1;
  background-color: var(--yellow);
  cursor: ${(props) => (props.pathname === '/' ? 'pointer' : 'default')};
  transition: 3s ease-in-out;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 15px;
    height: 100%;
    background: linear-gradient(270deg, rgba(69, 67, 43, 1) 0%, rgba(239, 232, 168, 1) 12%, rgba(239, 232, 168, 1) 35%, rgba(69, 67, 43, 1) 41%, rgba(217, 212, 166, 1) 47%, rgba(217, 212, 166, 1) 73%, rgba(69, 67, 43, 1) 78%, rgba(192, 189, 158, 1) 86%, rgba(192, 189, 158, 1) 99%, rgba(69, 67, 43, 1) 100%);
  }
`;


function StoreContainer() {
  const pathname = usePathname();
  const router = useRouter();
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
  const [sortBy, setSortBy] = useState('recommended');

  // 모든 가능한 태그 목록
  const [allTags, setAllTags] = useState({
    industry: [],
    capacity: [],
    material: [],
  });

  // 확장된 useStores 훅 사용 (정렬 포함)
  const filteredStores = useStores(stores, searchKeyword, selectedTags, sortBy);

  // 홈 페이지에서 StoreWrapper 클릭 시 /store로 이동
  const handleStoreWrapperClick = () => {
    if (pathname === '/') {
      router.push('/store');
    }
  };

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
      <StoreWrapper
        pathname={pathname}
        onClick={handleStoreWrapperClick}
      >
        <Search onSearch={handleSearch} />

        <StoreFilters
          allTags={allTags}
          selectedTags={selectedTags}
          onTagClick={handleTagClick}
          sortBy={sortBy}
          onSortChange={handleSortChange}
        />

        {isLoading ? (
          <div>로딩 중...</div>
        ) : (
          <StoreList stores={filteredStores} />
        )}
      </StoreWrapper>
    </>
  );
}

export default StoreContainer; 
