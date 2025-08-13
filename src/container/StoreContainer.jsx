'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Search from '@/components/store/Search';
import StoreFilters from '@/components/store/StoreFilters';
import StoreList from '@/components/store/StoreList';
import { getStores } from '@/utils/supabase/stores';
import { useStores, extractAllTags } from '@/hooks/useStores';
import styled from '@emotion/styled';

const StoreWrapper = styled.main`
  width: ${(props) => (props.pathname.startsWith('/store') ? '80vw' : '10vw')};
  height: 100dvh;
  padding-left: 70px;
  padding-top: 27px;
  position: absolute;
  right: 0px;
  top: 0px;
  z-index: 1;
  background-color: var(--yellow);
  cursor: ${(props) => (props.pathname === '/' || props.pathname.startsWith('/store/') ? 'pointer' : 'default')};
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

const StorePageName = styled.h1`
  font-family: var(--font-gothic);
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.3rem;
  position: absolute;
  transform: rotate(90deg);
  transform-origin: top left;
  top: 17px;
  left: 46px;
`

const StoreFilterWrapper = styled.div`
  margin-bottom: 7px;
  margin-top: ${(props) => (props.isFilterOpen ? '60px' : '154.5px')};
`

const StoreFilterBtn = styled.button`
  border : none;
  background: none;
  text-align: left;
  font-size: 1.12rem; 
  font-family: var(--font-gothic);
  font-weight: 800;
  transform: scaleX(0.8);
  transform-origin: left center;
  cursor: pointer;
`

const ResetFilterBtn = styled(StoreFilterBtn)`
  margin-left: -27px;
`


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

  // 필터 표시/숨김을 위한 상태
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // 모든 가능한 태그 목록
  const [allTags, setAllTags] = useState({
    industry: [],
    capacity: [],
    material: [],
  });

  // 확장된 useStores 훅 사용 (정렬 포함)
  const filteredStores = useStores(stores, searchKeyword, selectedTags, sortBy);

  // 홈 페이지에서 StoreWrapper 클릭 시 /store로 이동
  // 개별 스토어 페이지에서 StoreWrapper 클릭 시 /store로 이동  
  const handleStoreWrapperClick = () => {
    if (pathname === '/') {
      router.push('/store');
    } else if (pathname.startsWith('/store/')) {
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

  // 필터 토글 처리
  const handleFilterToggle = () => {
    setIsFilterOpen((prev) => !prev);
  };

  // 활성화된 필터가 있는지 확인
  const hasActiveFilters = () => {
    return (
      selectedTags.industry.length > 0 ||
      selectedTags.capacity.length > 0 ||
      selectedTags.material.length > 0
    );
  };

  // 모든 필터 초기화
  const handleResetFilters = () => {
    setSelectedTags({
      industry: [],
      capacity: [],
      material: [],
    });
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
        <StorePageName>업체 목록</StorePageName>
        <Search onSearch={handleSearch} />

        <StoreFilterWrapper isFilterOpen={isFilterOpen}>
          <StoreFilterBtn onClick={handleFilterToggle}>
            {isFilterOpen ? '필터링 닫기' : '필터링 열기'}
            {hasActiveFilters() && ' [사용중]'}
          </StoreFilterBtn>
          {hasActiveFilters() && (
            <ResetFilterBtn onClick={handleResetFilters}>
              / 초기화 하기
            </ResetFilterBtn>
          )}
        </StoreFilterWrapper>

        {isFilterOpen && (
          <StoreFilters
            allTags={allTags}
            selectedTags={selectedTags}
            onTagClick={handleTagClick}
            sortBy={sortBy}
            onSortChange={handleSortChange}
          />
        )}


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
