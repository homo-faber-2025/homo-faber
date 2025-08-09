'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from '@emotion/styled';
import { getStoreById } from '@/utils/supabase/stores';
import { convertIndustryNameToKorean } from '@/utils/converters';

const DetailWrapper = styled.main`
  width: calc(80vw - 60px);
  height: 100dvh;
  padding: 70px;
  background-color: #F7F7F7;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  position: absolute;
  right: 0px;
  top: 0px;
  z-index: 5;
`;

const StoreDetailCard = styled.div`
  background-color: #322F18;
  color: #FFF8B8;
  border-radius: 8px;
  padding: 30px;
  margin-bottom: 20px;
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
`;

const StoreName = styled.h1`
  font-family: var(--font-gothic);
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 20px;
  color: #FFF8B8;
`;

const InfoSection = styled.div`
  margin-bottom: 25px;
`;

const InfoLabel = styled.h3`
  font-family: var(--font-gothic);
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 10px;
  color: #FFF8B8;
`;

const InfoContent = styled.div`
  font-family: var(--font-gothic);
  font-size: 1.1rem;
  line-height: 1.6;
  margin-left: 10px;
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-left: 10px;
`;

const Tag = styled.span`
  background-color: rgba(255, 248, 184, 0.2);
  color: #FFF8B8;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
`;

const KeywordList = styled.div`
  margin-left: 10px;
  font-size: 1.1rem;
  line-height: 1.8;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-family: var(--font-gothic);
  font-size: 1.5rem;
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-family: var(--font-gothic);
  font-size: 1.5rem;
  color: red;
`;

function StoreDetailContainer({ storeId }) {
  const router = useRouter();
  const [store, setStore] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStore() {
      try {
        const data = await getStoreById(storeId);
        if (!data) {
          setError(new Error('스토어를 찾을 수 없습니다.'));
          return;
        }
        setStore(data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }

    if (storeId) {
      fetchStore();
    }
  }, [storeId]);

  const handleBackClick = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <LoadingContainer>
        <div>로딩 중...</div>
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <ErrorContainer>
        <div>에러가 발생했습니다: {error.message}</div>
      </ErrorContainer>
    );
  }

  if (!store) {
    return (
      <ErrorContainer>
        <div>스토어를 찾을 수 없습니다.</div>
      </ErrorContainer>
    );
  }

  return (
    <DetailWrapper>

      <StoreDetailCard>
        <StoreName>{store.name}</StoreName>

        {store.store_tags?.length > 0 && (
          <InfoSection>
            <InfoLabel>업종</InfoLabel>
            <TagList>
              {store.store_tags
                .map(tag => tag.industry_types?.name)
                .filter(Boolean)
                .map((industryName, index) => (
                  <Tag key={index}>
                    {convertIndustryNameToKorean(industryName)}
                  </Tag>
                ))}
            </TagList>
          </InfoSection>
        )}

        {store.address && (
          <InfoSection>
            <InfoLabel>주소</InfoLabel>
            <InfoContent>{store.address}</InfoContent>
          </InfoSection>
        )}

        {store.store_contacts?.length > 0 && store.store_contacts[0]?.phone && (
          <InfoSection>
            <InfoLabel>연락처</InfoLabel>
            <InfoContent style={{ fontFamily: 'var(--font-abeezee)' }}>
              {store.store_contacts[0].phone}
            </InfoContent>
          </InfoSection>
        )}

        {store.keyword?.length > 0 && (
          <InfoSection>
            <InfoLabel>취급 품목</InfoLabel>
            <KeywordList>
              {store.keyword.join(', ')}
            </KeywordList>
          </InfoSection>
        )}

        {store.store_contacts?.length > 0 && store.store_contacts[0]?.email && (
          <InfoSection>
            <InfoLabel>이메일</InfoLabel>
            <InfoContent style={{ fontFamily: 'var(--font-abeezee)' }}>
              {store.store_contacts[0].email}
            </InfoContent>
          </InfoSection>
        )}

        {store.description && (
          <InfoSection>
            <InfoLabel>설명</InfoLabel>
            <InfoContent>{store.description}</InfoContent>
          </InfoSection>
        )}
      </StoreDetailCard>
    </DetailWrapper>
  );
}

export default StoreDetailContainer; 