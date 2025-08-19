'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from '@emotion/styled';
import { getStoreById } from '@/utils/supabase/stores';
import { convertIndustryNameToKorean, convertCapacityNameToKorean } from '@/utils/converters';
import { useCustomScrollbar } from '@/hooks/useCustomScrollbar';
import CustomScrollbar from '@/components/common/CustomScrollbar';

const DetailWrapper = styled.main`
  width: calc(80vw - 60px);
  height: 100dvh;
  padding: 0px 10px 20px 50px;
  background-color: #F7F7F7;
  position: absolute;
  right: 0px;
  top: 0px;
  z-index: 3;
  box-shadow: -2px 0 4px 0 rgba(79,75,31,0.57);
  display: flex;
`;

const DetailPageName = styled.h1`
  font-family: var(--font-gothic);
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.3rem;
  position: absolute;
  transform: rotate(90deg);
  transform-origin: top left;
  top: 17px;
  left: 29px;
`

const StoreDetailCard = styled.article`
  font-family: var(--font-gothic);
  letter-spacing: 0.2rem;
  color: black;
  display: flex;
  flex-grow: 1;
  gap: 2%;
  // box-shadow: inset 0 0 10px 10px yellow;
`;

const StoreDetailSection = styled.section`
  // box-shadow: inset 0 0 10px 10px pink;
  width: 46%;
  text-align: center;
  overflow-y: auto;
  padding-top: 20px;
`

const StoreImgSection = styled(StoreDetailSection)`
  margin-bottom: -20px;
  overflow-x: hidden;
  width: 52%;
  margin-top: -20px;
  margin-right: 30px;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`

const StoreName = styled.h2`
  font-size: 5rem;
  letter-spacing: 0.3rem;
  font-weight: 700;
  margin-bottom: 10px;
  color: #A0A0A0;
  background-color:rgb(146, 146, 146);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  text-shadow: 3px 4px 5px rgba(245, 245, 245, 0.3), -0.1px -0.1px 6px rgba(100,92,92,0.2), 2px 2px 2px rgba(255,255,255,0.5);
  transition: text-shadow .4s ;
  padding-top: 3px;
  margin-top:-2px;

  &:hover{
      text-shadow: 0px 2px 3px rgba(221, 221, 221, 0.8), -0.1px -0.1px 5px rgba(100,92,92,0.6), 2px 2px 10px rgba(255,255,255,0.5);
  }
`;

const StoreAdress = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 50px;
  font-weight: 400;
  cursor: pointer;
  
  a {
    color: inherit;
    text-decoration: none;
    
    &:hover {
      font-weight: 600;
    }
  }
`
const StoreTagList = styled.div`
  font-size: 1.24rem;
  font-weight: 700;
  width: 60%;
  line-height: 1.5;
  margin: 0 auto 10px;
`

const StoreTag = styled.span`
  word-break: keep-all;
  overflow-wrap: break-word;
  white-space: normal;
  display: inline;
  background: linear-gradient(
    to bottom,
    transparent 10%,
    var(--yellow) 60%,
    var(--yellow) 90%,
    transparent 100%
  );
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
`
const StoreCapacity = styled.div`
  font-weight: 700;
  margin-top: 25px;
`

const StoreContactList = styled.div`
  display: inline-grid;
  grid-template-columns: max-content 1fr;
  gap: 8px 2px;
  width: fit-content;
  margin: 56px auto 0;
  align-items: center;
  letter-spacing: 0.1rem;
`
const StoreContact = styled.div`
  display: contents;
  font-size: 1.1rem;
`

const StoreContactTxt = styled.div`
  font-weight: 700;
  white-space: nowrap;
  text-align: right;
  padding-right: 5px;
  margin-left: 20px;
`

const StoreContactContent = styled.div`
  font-family: var(--font-abeezee);
  text-align: left;
  font-size: 1.17rem;
  margin-bottom: 1px;
  white-space: nowrap;
  letter-spacing: 0.06rem;
  
  a {
    color: inherit;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
      cursor: pointer;
    }
  }
`
const StoreDescription = styled.div`
`

const StoreCardImg = styled.img`
  width: 100%;
  transform: rotate(-5deg);
  margin-top: -20px;
  transition: .3s all;
  &:hover{
    transform: rotate(5deg);
  }
`
const StoreImgList = styled.div`
  width: 100%;
  margin-top: -56px;
  padding: 0 40px 10px 40px;
  margin-bottom: 40px;
`
const StoreImg = styled.img`
  width: 100%;
  border-radius: 50%;
  border: 0.6px solid black;
  vertical-align: top;
  position: relative;
  box-shadow: -1px 1px 3px 6px rgba(255,255,255,1), -2px -1px 20px 0.3px rgba(116, 116, 116, 0.63), 3px 15px 30px 10px rgba(177, 177, 177, 0.36);
  margin-bottom: -10px;
  position: relative;
  transition: all .4s ;

  &:hover{
    z-index: 2;
    transform: scale(1.06);
    box-shadow: -1px 1px 3px 6px rgba(255,255,255,1), -2px -1px 30px 0.5px rgba(116, 116, 116, 0), 3px 15px 30px 0px rgba(177, 177, 177, 0.36);

  }
`

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
  font-size: 1.5rem;
`;

function StoreDetailContainer({ storeId }) {
  const router = useRouter();
  const [store, setStore] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { containerRef, scrollState, scrollToRatio } = useCustomScrollbar();

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
    <>
      <DetailWrapper>
        <DetailPageName>업체 상세</DetailPageName>
        <StoreDetailCard>
          <StoreDetailSection>
            <StoreName>{store.name}</StoreName>
            {store.address && (
              <StoreAdress>
                <a
                  href={`https://map.naver.com/v5/search/${encodeURIComponent(store.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {store.address}
                </a>
              </StoreAdress>
            )}

            {store.store_tags?.length > 0 && (
              <StoreTagList>
                {store.store_tags
                  .map(tag => tag.industry_types?.name)
                  .filter(Boolean)
                  .map((industryName, index) => (
                    <StoreTag key={index}>
                      {convertIndustryNameToKorean(industryName)}
                    </StoreTag>
                  ))}
              </StoreTagList>
            )}

            <StoreTagList>
              {store.keyword?.length > 0 && (
                <StoreTag>
                  {store.keyword.join(', ')}
                </StoreTag>
              )}
            </StoreTagList>

            {store.store_tags?.some(tag => tag.capacity_types?.name) && (
              <StoreCapacity>
                {store.store_tags
                  .map(tag => tag.capacity_types?.name)
                  .filter(Boolean)
                  .map(convertCapacityNameToKorean)
                  .join(', ')}
              </StoreCapacity>
            )}

            <StoreContactList>
              {store.store_contacts?.length > 0 &&
                [
                  { key: 'phone', label: 'Phone.', value: store.store_contacts[0]?.phone },
                  { key: 'fax', label: 'Fax.', value: store.store_contacts[0]?.fax },
                  { key: 'email', label: 'Mail.', value: store.store_contacts[0]?.email },
                  { key: 'website', label: 'Website.', value: store.store_contacts[0]?.website }
                ]
                  .filter(contact => contact.value)
                  .map(contact => {
                    let content = contact.value;

                    if (contact.key === 'phone' || 'fax') {
                      content = <a href={`tel:${contact.value}`}>{contact.value}</a>;
                    } else if (contact.key === 'email') {
                      content = <a href={`mailto:${contact.value}`}>{contact.value}</a>;
                    } else if (contact.key === 'website') {
                      const url = contact.value.startsWith('http') ? contact.value : `https://${contact.value}`;
                      content = <a href={url} target="_blank" rel="noopener noreferrer">{contact.value}</a>;
                    }

                    return (
                      <StoreContact key={contact.key}>
                        <StoreContactTxt>{contact.label}</StoreContactTxt>
                        <StoreContactContent>{content}</StoreContactContent>
                      </StoreContact>
                    );
                  })
              }
            </StoreContactList>

            {store.description && (
              <StoreDescription>{store.description}</StoreDescription>
            )}
          </StoreDetailSection>

          <StoreImgSection ref={containerRef}>
            {store.card_img && (
              <StoreCardImg src={`${store.card_img}`} />
            )}

            {store.store_gallery?.length > 0 && (
              <StoreImgList>
                {store.store_gallery
                  .map(tag => tag?.image_url)
                  .map((imgURL, index) => (
                    <StoreImg key={index} src={`${imgURL}`} />
                  ))}
              </StoreImgList>
            )}
          </StoreImgSection>
        </StoreDetailCard>
      </DetailWrapper>

      {/* 커스텀 스크롤바 */}
      <CustomScrollbar
        scrollState={scrollState}
        onScrollToRatio={scrollToRatio}
        height={300}
      />
    </>
  );
}

export default StoreDetailContainer; 