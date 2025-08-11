'use client';

import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import styled from '@emotion/styled';

const SearchWrapper = styled.div`
  width: 100%;
  padding-right: 20px;
`;

const SearchBox = styled.div`
  display: flex;
  margin-left: auto;
  padding: 1px 27px 0 27px;
  box-shadow: 0 4px 4px 0 rgba(0,0,0,0.25);
  align-items: center;
  width: 360px;
  border-radius: 28px;
  background-color: #322F18;
  &:focus-within, &:hover {
    outline: 2px solid #FFF8B8;
  }

`;

const SearchIcon = styled.div`
  display: flex;
  margin-right: -4px;
  padding-bottom: 3px;
  align-items: center;
  justify-content: flex-end;
  cursor: pointer;
`;

const TextBox = styled.input`
  width: 100%;
  margin: 12px 0;
  border: none;
  outline: none;
  background-color: #363315;
  font-size: 1.2rem; 
  font-family: var(--font-gothic);
  font-weight: 800;
  color: #FFF8B8;
  transform: scaleX(0.8);
  transform-origin: left center; 
  &::placeholder {
    color: #FFF8B8;
    opacity: 80%;
  }
`;

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
    <SearchWrapper>
      <SearchBox>
        <TextBox
          type="text"
          value={searchKeyword}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="'키워드' 검색"
        />
        <SearchIcon onClick={handleIconClick}>
          <Image src="/search-icon.svg" alt="검색" width={15} height={15} />
        </SearchIcon>
      </SearchBox>
    </SearchWrapper>
  );
};

export default Search;
