'use client';

import { useEffect, useState, useLayoutEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Search from '@/components/common/Search';
import StoreFilters from '@/components/store/StoreFilters';
import StoreList from '@/components/store/StoreList';
import { useStores, useStoreFilters, extractAllTags } from '@/hooks/useStores';
import useWindowSize from '@/hooks/useWindowSize';
import * as S from '@/styles/store/storeContainer.style';

function StoreContainer() {
  const pathname = usePathname();
  const router = useRouter();
  const { stores, isLoading, error } = useStores();
  const { isMobile, isReady } = useWindowSize();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [right, setRight] = useState('calc(-80dvw + 120px)');
  const [bottom, setBottom] = useState('calc(-80dvh + 20px)');

  // 초기 상태 설정 및 pathname/isMobile 변경 시 업데이트
  useLayoutEffect(() => {
    // isReady가 false면 아직 초기값이 설정되지 않았으므로 실행하지 않음
    if (!isReady) return;

    if (isMobile) {
      const newBottom = getMobileBottomPosition(pathname);
      setBottom(newBottom);
    } else {
      const newRight = getDesktopRightPosition(pathname);
      setRight(newRight);
    }
  }, [pathname, isMobile, isReady]);

  // 모바일에서 사용할 bottom 위치를 계산하는 함수
  const getMobileBottomPosition = (pathname) => {
    if (pathname === '/') {
      return 'calc(-80dvh + 20px)';
    } else if (pathname.startsWith('/store')) {
      return '0px';
    } else {
      return 'calc(-80dvh + 20px)';
    }
  };

  // 데스크톱에서 사용할 right 위치를 계산하는 함수
  const getDesktopRightPosition = (pathname) => {
    if (pathname === '/') {
      return 'calc(-80dvw + 120px)';
    } else if (pathname.startsWith('/store')) {
      return '0px';
    } else {
      return 'calc(-80dvw + 120px)';
    }
  };


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

  // 필터링된 스토어 목록
  const filteredStores = useStoreFilters(stores, searchKeyword, selectedTags, sortBy);

  // 모든 가능한 태그 목록 업데이트
  useEffect(() => {
    if (stores.length > 0) {
      const tags = extractAllTags(stores);
      setAllTags(tags);
    }
  }, [stores]);

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

  const handleStoreWrapperClick = () => {
    if (pathname === '/') {
      router.push('/store');
    } else if (pathname.startsWith('/store/')) {
      router.push('/store');
    }
  };

  // isReady가 false면 로딩 상태 표시
  if (!isReady) {
    return null; // 또는 로딩 스피너를 표시할 수 있습니다
  }

  if (error) {
    return <div>에러가 발생했습니다: {error.message}</div>;
  }

  return (
    <S.StoreWrapper
      pathname={pathname}
      right={right}
      bottom={bottom}
      isMobile={isMobile}
      onClick={handleStoreWrapperClick}
    >
      <S.StorePageName>업체 목록</S.StorePageName>
      <Search onSearch={handleSearch} />

      <S.StoreFilterWrapper isFilterOpen={isFilterOpen}>
        <S.StoreFilterBtn onClick={handleFilterToggle}>
          {isFilterOpen ? '필터링 닫기' : '필터링 열기'}
          {hasActiveFilters() && ' [사용중]'}
        </S.StoreFilterBtn>
        {hasActiveFilters() && (
          <S.ResetFilterBtn onClick={handleResetFilters}>
            / 초기화 하기
          </S.ResetFilterBtn>
        )}

        {isFilterOpen && (
          <StoreFilters
            allTags={allTags}
            selectedTags={selectedTags}
            onTagClick={handleTagClick}
            sortBy={sortBy}
            onSortChange={handleSortChange}
          />
        )}
      </S.StoreFilterWrapper>



      {isLoading ? (
        <div>로딩 중...</div>
      ) : (
        <StoreList stores={filteredStores} />
      )}
    </S.StoreWrapper>
  );
}

export default StoreContainer; 
