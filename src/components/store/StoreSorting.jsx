'use client';

import styled from '@emotion/styled';

const SortingWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

const SortingLabel = styled.span`
  margin-right: 12px;
  font-size: ${(props) => props.theme.fontSize.sm};
  color: ${(props) => props.theme.color.text};
`;

const SortButton = styled.button`
  padding: 6px 12px;
  margin-right: 8px;
  border: 1px solid
    ${(props) =>
      props.active ? props.theme.color.primary : props.theme.color.border};
  border-radius: 4px;
  background-color: ${(props) =>
    props.active ? props.theme.color.primary : 'transparent'};
  color: ${(props) => (props.active ? 'white' : props.theme.color.text)};
  font-size: ${(props) => props.theme.fontSize.sm};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${(props) =>
      props.active ? props.theme.color.primary : props.theme.color.background};
  }
`;

const StoreSorting = ({ sortBy, onSortChange }) => {
  return (
    <SortingWrapper>
      <SortingLabel>정렬:</SortingLabel>
      <SortButton
        active={sortBy === 'nameAsc'}
        onClick={() => onSortChange('nameAsc')}
      >
        오름차순
      </SortButton>
      <SortButton
        active={sortBy === 'nameDesc'}
        onClick={() => onSortChange('nameDesc')}
      >
        내림차순
      </SortButton>
      <SortButton
        active={sortBy === 'recommended'}
        onClick={() => onSortChange('recommended')}
      >
        추천순
      </SortButton>
    </SortingWrapper>
  );
};

export default StoreSorting;
