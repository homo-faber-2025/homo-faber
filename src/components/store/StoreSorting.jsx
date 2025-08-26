'use client';

import * as S from '@/styles/store/storeFillters.style';

const StoreSorting = ({ sortBy, onSortChange }) => {
  return (
    <S.TagsSortingContainer>
      <S.Tag
        active={sortBy === 'nameAsc'}
        onClick={() => onSortChange('nameAsc')}
      >
        <S.TagTxt>오름차순</S.TagTxt>
      </S.Tag>
      <S.Tag
        active={sortBy === 'nameDesc'}
        onClick={() => onSortChange('nameDesc')}
      >
        <S.TagTxt>내림차순</S.TagTxt>
      </S.Tag>
      <S.Tag
        active={sortBy === 'recommended'}
        onClick={() => onSortChange('recommended')}
      >
        <S.TagTxt>추천순</S.TagTxt>
      </S.Tag>
    </S.TagsSortingContainer>
  );
};

export default StoreSorting;
