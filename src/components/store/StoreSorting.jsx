'use client';

import styled from '@emotion/styled';

const SortingWrapper = styled.div`
  display: flex;
  align-items: left;
  justify-contents: left;
  flex-direction: column;
  gap: 7px;
`;

const SortButton = styled.button`
  border: none;
  background: none;
  color: ${(props) => (props.active ? 'rgba(0,0,0,1)' : 'rgba(0,0,0,0.3)')};
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
  font-size: 1.1rem;

  &:hover {
    color: black;
`;

const SortTxt = styled.div`
  font-family: var(--font-gothic);
  font-weight: 800;
  transform: scaleX(0.8);
`

const StoreSorting = ({ sortBy, onSortChange }) => {
  return (
    <SortingWrapper>
      <SortButton
        active={sortBy === 'nameAsc'}
        onClick={() => onSortChange('nameAsc')}
      >
        <SortTxt>오름차순</SortTxt>
      </SortButton>
      <SortButton
        active={sortBy === 'nameDesc'}
        onClick={() => onSortChange('nameDesc')}
      >
        <SortTxt>내림차순</SortTxt>
      </SortButton>
      <SortButton
        active={sortBy === 'recommended'}
        onClick={() => onSortChange('recommended')}
      >
        <SortTxt>추천순</SortTxt>
      </SortButton>
    </SortingWrapper>
  );
};

export default StoreSorting;
