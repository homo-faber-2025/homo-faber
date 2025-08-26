'use client';

import StoreSorting from '@/components/store/StoreSorting';
import { convertCapacityNameToKorean, convertMaterialNameToKorean } from '@/utils/converters';
import * as S from '@/styles/store/storeFillters.style';

const StoreFilters = ({ allTags, selectedTags, onTagClick, sortBy, onSortChange }) => {
  if (!allTags) return null;

  return (
    <S.FilterWrapper>

      <StoreSorting sortBy={sortBy} onSortChange={onSortChange} />

      {/* 업종 필터 */}
      {allTags.industry.length > 0 && (
        <>
          <S.TagsIndustryContainer>
            {allTags.industry.map((tag) => (
              <S.Tag
                key={`industry-${tag}`}
                active={selectedTags.industry.includes(tag)}
                onClick={() => onTagClick('industry', tag)}
              >
                <S.TagTxt>
                  {tag}
                </S.TagTxt>
              </S.Tag>
            ))}
          </S.TagsIndustryContainer>
        </>
      )}

      {/* 재료 필터 */}
      {allTags.material.length > 0 && (
        <>
          <S.TagsMaterialContainer>
            {allTags.material.map((tag) => (
              <S.Tag
                key={`material-${tag}`}
                active={selectedTags.material.includes(tag)}
                onClick={() => onTagClick('material', tag)}
              >
                <S.TagTxt>
                  {convertMaterialNameToKorean(tag)}
                </S.TagTxt>
              </S.Tag>
            ))}
          </S.TagsMaterialContainer>
        </>
      )}

      {/* 수용 인원 필터 */}
      <>
        <S.TagsContainer>
          <S.Tag
            key="capacity-소량 생산"
            active={selectedTags.capacity.includes('소량 생산')}
            onClick={() => onTagClick('capacity', '소량 생산')}
          >
            <S.TagTxt>
              {convertCapacityNameToKorean('소량 생산')}
            </S.TagTxt>
          </S.Tag>
        </S.TagsContainer>
      </>
    </S.FilterWrapper>
  );
};

export default StoreFilters;
