'use client';

import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import styled from '@emotion/styled';

const SearchWrapper = styled.div`
  width: 100%;
  padding: 12px 0;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  width: 50%;
  border: 1px solid rgb(201, 202, 204);
  border-radius: 30px;
  background-color: white;
  &:focus-within {
    outline: 2px solid ${(props) => props.theme.color.primary};
  }
`;

const SearchIcon = styled.div`
  margin: 0 16px;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const TextBox = styled.input`
  width: 100%;
  margin: 12px 0;
  border: none;
  outline: none;
  font-size: ${(props) => props.theme.fontSize.lg};
  &::placeholder {
    color: gray;
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
          <Image src="/search-icon.svg" alt="검색" width={20} height={20} />
        </SearchIcon>
      </SearchBox>
    </SearchWrapper>
  );
};

export default Search;
