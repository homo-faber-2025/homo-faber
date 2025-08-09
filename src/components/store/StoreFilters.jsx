'use client';

import styled from '@emotion/styled';
import StoreSorting from '@/components/store/StoreSorting';
import { convertCapacityNameToKorean } from '@/utils/converters';

const FilterWrapper = styled.aside`
  width: 100vw;
  background-color: #FAF8DB;
  padding: 13px 6px 12px;
  border-top: 1.6px solid #363315;
  display: flex;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: flex-start;
`;

const TagsIndustryContainer = styled(TagsContainer)`
  width: 123px;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 16px;
`
const TagsMaterialContainer = styled(TagsContainer)`
  width: 200px;
  margin-right: 200px;
  align-content: flex-start;
`

const Tag = styled.button`
  border:none;
  background: none;
  padding: 0px 5px 2px 5px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
  font-size: 1.1rem;
  font-family: var(--font-gothic);
  font-weight: 800;
  transform: scaleX(0.8);
  transition: all 0.2s;
  color: ${(props) => (props.active ? 'rgba(0,0,0,1)' : 'rgba(0,0,0,0.3)')};

  &:hover{
    color: black;
  }
`;

const StoreFilters = ({ allTags, selectedTags, onTagClick, sortBy, onSortChange }) => {
  if (!allTags) return null;

  return (
    <FilterWrapper>

      {/* 업종 필터 */}
      <StoreSorting sortBy={sortBy} onSortChange={onSortChange} />
      {allTags.industry.length > 0 && (
        <>
          <TagsIndustryContainer>
            {allTags.industry.map((tag) => (
              <Tag
                key={`industry-${tag}`}
                active={selectedTags.industry.includes(tag)}
                onClick={() => onTagClick('industry', tag)}
              >
                {tag}
              </Tag>
            ))}
          </TagsIndustryContainer>
        </>
      )}

      {/* 재료 필터 */}
      {allTags.material.length > 0 && (
        <>
          <TagsMaterialContainer>
            {allTags.material.map((tag) => (
              <Tag
                key={`material-${tag}`}
                active={selectedTags.material.includes(tag)}
                onClick={() => onTagClick('material', tag)}
              >
                {tag}
              </Tag>
            ))}
          </TagsMaterialContainer>
        </>
      )}

      {/* 수용 인원 필터 */}
      <>
        <TagsContainer>
          <Tag
            key="capacity-소량 생산"
            active={selectedTags.capacity.includes('소량 생산')}
            onClick={() => onTagClick('capacity', '소량 생산')}
          >
            {convertCapacityNameToKorean('소량 생산')}
          </Tag>
        </TagsContainer>
      </>
    </FilterWrapper>
  );
};

export default StoreFilters;
