'use client';

import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import * as S from '@/styles/common/search.style';

// 리스트업 항목(이름, 태그-industry, 핸드폰 번호, 주소) - 모든 데이터베이스(두글자 이상)
const Search = ({ onSearch }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchKeyword, setSearchKeyword] = useState(
    searchParams.get('keyword') || '',
  );

  const handleSearch = (value) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (value) {
      newParams.set('keyword', value);
    } else {
      newParams.delete('keyword');
    }
    window.history.replaceState({}, '', `${pathname}?${newParams.toString()}`);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(searchKeyword);
    }
  };

  const handleIconClick = () => {
    handleSearch(searchKeyword);
  };

  const handleInputChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  return (
    <S.SearchWrapper>
      <S.SearchBox>
        <S.TextBox
          type="text"
          value={searchKeyword}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="'키워드' 검색"
        />
        <S.SearchIcon onClick={handleIconClick}>
          <Image src="/search-icon.svg" alt="검색" width={15} height={15} />
        </S.SearchIcon>
      </S.SearchBox>
    </S.SearchWrapper>
  );
};

export default Search;
