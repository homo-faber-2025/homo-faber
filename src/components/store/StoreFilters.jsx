'use client';

import styled from '@emotion/styled';

const FilterWrapper = styled.div`
  width: 100%;
  margin-bottom: 24px;
`;

const FilterTitle = styled.h3`
  margin-bottom: 12px;
  font-size: ${(props) => props.theme.fontSize.md};
  font-weight: 600;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
`;

const Tag = styled.span`
  padding: 6px 12px;
  border-radius: 16px;
  font-size: ${(props) => props.theme.fontSize.sm};
  background-color: ${(props) =>
    props.active
      ? props.theme.color.primary
      : props.theme.color.background || '#f0f0f0'};
  color: ${(props) => (props.active ? 'white' : props.theme.color.text)};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;

const StoreFilters = ({ allTags, selectedTags, onTagClick }) => {
  if (!allTags) return null;

  return (
    <FilterWrapper>
      {/* 업종 필터 */}
      {allTags.industry.length > 0 && (
        <>
          <FilterTitle>업종</FilterTitle>
          <TagsContainer>
            {allTags.industry.map((tag) => (
              <Tag
                key={`industry-${tag}`}
                active={selectedTags.industry.includes(tag)}
                onClick={() => onTagClick('industry', tag)}
              >
                {tag}
              </Tag>
            ))}
          </TagsContainer>
        </>
      )}

      {/* 수용 인원 필터 */}
      {allTags.capacity.length > 0 && (
        <>
          <FilterTitle>수용 인원</FilterTitle>
          <TagsContainer>
            {allTags.capacity.map((tag) => (
              <Tag
                key={`capacity-${tag}`}
                active={selectedTags.capacity.includes(tag)}
                onClick={() => onTagClick('capacity', tag)}
              >
                {tag}
              </Tag>
            ))}
          </TagsContainer>
        </>
      )}

      {/* 재료 필터 */}
      {allTags.material.length > 0 && (
        <>
          <FilterTitle>재료</FilterTitle>
          <TagsContainer>
            {allTags.material.map((tag) => (
              <Tag
                key={`material-${tag}`}
                active={selectedTags.material.includes(tag)}
                onClick={() => onTagClick('material', tag)}
              >
                {tag}
              </Tag>
            ))}
          </TagsContainer>
        </>
      )}
    </FilterWrapper>
  );
};

export default StoreFilters;
