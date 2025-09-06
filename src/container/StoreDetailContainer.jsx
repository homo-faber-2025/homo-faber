'use client';

import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { useStoreDetail } from '@/hooks/useStores';
import { convertIndustryNameToKorean } from '@/utils/converters';
import { getCapacityTypes } from '@/utils/supabase/stores';
import { getInterviewsByStore } from '@/utils/supabase/interview';
import { useCustomScrollbar } from '@/hooks/useCustomScrollbar';
import CustomScrollbar from '@/components/common/CustomScrollbar';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useAuth } from '@/contexts/AuthContext';
import * as S from '@/styles/store/storeDetailContainer.style';
import useWindowSize from '@/hooks/useWindowSize';

function StoreDetailContainer({ }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isMobile, isReady } = useWindowSize();
  const [right, setRight] = useState('-100dvw');
  const [bottom, setBottom] = useState('-100dvh');
  const [capacityTypes, setCapacityTypes] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const storeId = pathname.startsWith('/store/') && pathname !== '/store' ? pathname.split('/')[2] : null;

  const { user } = useAuth();
  const { toggleBookmark, isStoreBookmarked, loading } = useBookmarks();
  const { store, isLoading, error } = useStoreDetail(storeId);
  const { containerRef, scrollState, scrollToRatio } = useCustomScrollbar();

  // capacity 타입들을 가져오는 useEffect
  useEffect(() => {
    const fetchCapacityTypes = async () => {
      try {
        const types = await getCapacityTypes();
        setCapacityTypes(types);
      } catch (error) {
        console.error('Capacity types 가져오기 실패:', error);
      }
    };
    fetchCapacityTypes();
  }, []);

  // store와 연결된 interview들을 가져오는 useEffect
  useEffect(() => {
    const fetchInterviews = async () => {
      if (!storeId) return;
      try {
        const interviewData = await getInterviewsByStore(storeId);
        setInterviews(interviewData);
      } catch (error) {
        console.error('Interviews 가져오기 실패:', error);
      }
    };
    fetchInterviews();
  }, [storeId]);

  // pathname 변경 시 위치 업데이트
  useLayoutEffect(() => {
    // isReady가 false면 아직 초기값이 설정되지 않았으므로 실행하지 않음
    if (!isReady) return;

    if (isMobile) {
      const newBottom = getMobileBottomPosition(pathname);
      setBottom(newBottom);
    } else {
      const newRight = getDesktopRightPosition(pathname);
      setRight(newRight);
    }
  }, [pathname, isMobile, isReady]);

  // 모바일에서 사용할 bottom 위치를 계산하는 함수
  const getMobileBottomPosition = (pathname) => {
    if (pathname.startsWith('/store/') && pathname !== '/store') {
      return '0px';
    } else {
      return '-100dvh';
    }
  };

  // 데스크톱에서 사용할 right 위치를 계산하는 함수
  const getDesktopRightPosition = (pathname) => {
    if (pathname.startsWith('/store/') && pathname !== '/store') {
      return '0px';
    } else {
      return '-100dvw';
    }
  };

  const handleBookmarkClick = () => {
    if (user && storeId) {
      toggleBookmark(storeId);
    }
  };

  // isReady가 false면 로딩 상태 표시
  if (!isReady) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      {storeId && (
        <S.DetailWrapper
          key={storeId}
          right={right}
          bottom={bottom}
          isMobile={isMobile}
          initial={isMobile ? { bottom: '-100dvh' } : { right: '-100dvw' }}
          animate={isMobile ? { bottom: bottom } : { right: right }}
          exit={isMobile ? { bottom: '-100dvh' } : { right: '-100dvw' }}
          transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
        >
          {error ? (
            <S.ErrorContainer>
              <div>에러가 발생했습니다: {error.message}</div>
            </S.ErrorContainer>
          ) : isLoading ? (
            <S.LoadingContainer>
              <div>로딩 중...</div>
            </S.LoadingContainer>
          ) : !store ? (
            <S.ErrorContainer>
              <div>스토어를 찾을 수 없습니다.</div>
            </S.ErrorContainer>
          ) : (
            <>
              <S.DetailPageName>업체 상세</S.DetailPageName>

              <S.StoreDetailCard>
                <S.StoreDetailSection>
                  <S.StoreName>
                    {store.name}
                    {/* 북마크 버튼 */}
                    {user && (
                      <S.BookmarkButton
                        onClick={handleBookmarkClick}
                        disabled={loading}
                        title={isStoreBookmarked(storeId) ? '북마크 제거' : '북마크 추가'}
                      >
                        <S.BookmarkIcon isBookmarked={isStoreBookmarked(storeId)}>
                          {isStoreBookmarked(storeId) ? '★' : '☆'}
                        </S.BookmarkIcon>
                      </S.BookmarkButton>
                    )}
                  </S.StoreName>
                  {store.address && (
                    <S.StoreAdress>
                      <a
                        href={`https://map.naver.com/v5/search/${encodeURIComponent(store.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          textDecoration: (store.move || store.close) ? 'line-through' : 'none',
                          color: (store.move || store.close) ? '#9999' : 'inherit',
                        }}
                      >
                        {store.address}
                      </a>
                    </S.StoreAdress>
                  )}
                  {store.move && store.move_address && (
                    <S.StoreAdress>
                      <a
                        href={`https://map.naver.com/v5/search/${encodeURIComponent(store.move_address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {store.move_address}
                      </a>
                    </S.StoreAdress>
                  )}

                  {interviews.length > 0 && (
                    <S.InterviewButton
                      onClick={() => router.push(`/interview/${interviews[0].id}`)}
                    >
                      {store.person} 기술자 인터뷰 보러가기 →
                    </S.InterviewButton>
                  )}

                  <S.StoreTagList>
                    {store.keyword?.length > 0 && (
                      <S.StoreTag>
                        {store.keyword.join(', ')}
                      </S.StoreTag>
                    )}
                  </S.StoreTagList>

                  {store.store_capacity?.some(capacity => capacity.capacity_types?.name) && (
                    <S.StoreCapacity>
                      {store.store_capacity
                        .map(capacity => {
                          const capacityTypeId = capacity.capacity_types?.id;
                          if (capacityTypeId === '7346574b-f036-4be2-803b-7614a908b53c') {
                            return '개인 • 학생 작업 가능';
                          }
                        })
                      }
                    </S.StoreCapacity>
                  )}

                  {store.description && (
                    <S.StoreDescription>{store.description}</S.StoreDescription>
                  )}


                  <S.StoreContactList>
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
                            <S.StoreContact key={contact.key}>
                              <S.StoreContactTxt>{contact.label}</S.StoreContactTxt>
                              <S.StoreContactContent>{content}</S.StoreContactContent>
                            </S.StoreContact>
                          );
                        })
                    }
                  </S.StoreContactList>


                </S.StoreDetailSection>

                <S.StoreImgSection ref={containerRef}>
                  {store.card_img && (
                    <S.StoreCardImg src={`${store.card_img}`} />
                  )}

                  {store.store_gallery?.length > 0 && (
                    <S.StoreImgList>
                      {store.store_gallery
                        .map(tag => tag?.image_url)
                        .map((imgURL, index) => (
                          <S.StoreImg key={index} src={`${imgURL}`} />
                        ))}
                    </S.StoreImgList>
                  )}
                </S.StoreImgSection>
              </S.StoreDetailCard>

              {!isMobile && (
                <>
                  {/* 커스텀 스크롤바 */}
                  <CustomScrollbar
                    scrollState={scrollState}
                    onScrollToRatio={scrollToRatio}
                    height={300}
                  />
                </>
              )}
            </>
          )}
        </S.DetailWrapper>
      )}
    </AnimatePresence>
  );
}

export default StoreDetailContainer; 