'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useFnq } from '@/hooks/useFnq';
import { useCustomScrollbar } from '@/hooks/useCustomScrollbar';
import { AnimatePresence } from 'motion/react';
import useWindowSize from '@/hooks/useWindowSize';
import Loader from '@/components/common/Loader';
import Error from '@/components/common/Error';
import * as S from '@/styles/fnq/fnqDeatilContainer.style';
import FnqStatus from '@/components/fnq/FnqStatus';
import EditorFnqRenderer from '@/components/fnq/EditorFnqRenderer';
import { deleteFnq } from '@/utils/api/fnq-api';
import Popup from '@/components/common/Popup';

function MypageFnqDeatilContainer() {
  const pathname = usePathname();
  const router = useRouter();
  const { isMobile, isReady } = useWindowSize();
  // 패널 상태: 'hidden' | 'expanded' | 'collapsed'
  const [panelState, setPanelState] = useState('hidden');
  const prevFnqIdRef = useRef(null); // 이전 fnqId 추적
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showProcessingPopup, setShowProcessingPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fnqId = pathname.startsWith('/mypage/fnq/') && pathname !== '/mypage/fnq' && !pathname.includes('/edit')
    ? pathname.split('/')[3]
    : null;
  const { fnq, isLoading, error, loading } = useFnq(fnqId);
  const { containerRef, scrollState, scrollToRatio } = useCustomScrollbar();

  // 상태 확인 (확인중이 아닌 경우 수정/삭제 비활성화)
  const isProcessing = fnq?.fnq_status?.status !== 'pending';
  const canEdit = !isProcessing;

  // 분기점 1: fnqId 변경 시 - expanded 상태로 변경
  useEffect(() => {
    if (fnqId && isReady) {
      // 새로운 fnqId로 변경되었을 때만 expanded로 설정
      if (prevFnqIdRef.current !== fnqId) {
        setPanelState('expanded');
        prevFnqIdRef.current = fnqId;
        // MypageContainer도 expanded 되도록 이벤트 발생
        window.dispatchEvent(new CustomEvent('expandPanel', { detail: { route: 'mypage' } }));
      }
    } else if (!fnqId) {
      setPanelState('hidden');
      prevFnqIdRef.current = null;
    }
  }, [fnqId, isReady]);

  // 분기점 2: 지도 클릭 시 - collapsed 상태로 변경
  useEffect(() => {
    if (!fnqId) return;

    const handleCollapsePanel = () => {
      if (panelState === 'expanded') {
        setPanelState('collapsed');
      }
    };

    window.addEventListener('collapsePanel', handleCollapsePanel);
    return () => {
      window.removeEventListener('collapsePanel', handleCollapsePanel);
    };
  }, [fnqId, panelState]);

  // 분기점 3: 패널 클릭 시 - expanded 상태로 변경
  const handlePanelClick = (e) => {
    const target = e.target;
    const isInteractive = target.closest('button, a, input, select, textarea, [role="button"], [onClick], img');

    if (!isInteractive) {
      e.stopPropagation();
      if (panelState === 'collapsed') {
        setPanelState('expanded');
        // MypageContainer도 expanded 되도록 이벤트 발생
        window.dispatchEvent(new CustomEvent('expandPanel', { detail: { route: 'mypage' } }));
      }
    }
  };

  // 패널 상태에 따른 initial 위치 계산 (transform 사용)
  const getInitialPosition = useMemo(() => {
    const isFirstMount = prevFnqIdRef.current !== fnqId && fnqId !== null;

    if (panelState === 'hidden') {
      return isMobile ? { y: '100dvh' } : { x: '100dvw' };
    }

    if (panelState === 'expanded') {
      // 처음 마운트될 때만 화면 밖에서 시작, 이후에는 initial 제거하여 motion이 자동 감지
      return isFirstMount ? (isMobile ? { y: '100dvh' } : { x: '100dvw' }) : undefined;
    }

    // collapsed - expanded에서 collapsed로 변경될 때는 현재 위치에서 시작
    return undefined;
  }, [panelState, fnqId, isMobile]);

  // motion이 panelState를 직접 추적하도록 animate 값 계산 (transform 사용)
  const animateValue = useMemo(() => {
    if (panelState === 'hidden') {
      return isMobile ? { y: '100dvh' } : { x: '100dvw' };
    }
    if (panelState === 'expanded') {
      return isMobile ? { y: 0 } : { x: 0 };
    }
    // collapsed
    return isMobile ? { y: 'calc(-26px + 80dvh)' } : { x: 'calc(80vw - 200px)' };
  }, [panelState, isMobile]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  // 숫자 포맷팅 함수 (천 단위 구분자)
  const formatNumber = (value) => {
    if (!value) return '-';
    const numericValue = typeof value === 'number' ? value : parseInt(value);
    if (isNaN(numericValue)) return '-';
    return numericValue.toLocaleString('ko-KR') + ' 원';
  };

  // 삭제 확인 핸들러
  const handleDeleteClick = () => {
    if (!fnqId) return;

    // 처리중인 경우 팝업 표시
    if (isProcessing) {
      setShowProcessingPopup(true);
      return;
    }

    setShowDeleteConfirm(true);
  };

  // 실제 삭제 실행 핸들러
  const handleDeleteConfirm = async () => {
    if (!fnqId) return;

    try {
      setIsDeleting(true);
      setShowDeleteConfirm(false);
      await deleteFnq(fnqId);
      setShowSuccessPopup(true);
    } catch (error) {
      console.error('삭제 오류:', error);
      setErrorMessage('삭제 중 오류가 발생했습니다');
      setShowErrorPopup(true);
    } finally {
      setIsDeleting(false);
    }
  };

  // 삭제 취소 핸들러
  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  // 성공 팝업 닫기 핸들러
  const handleSuccessClose = () => {
    setShowSuccessPopup(false);
    router.push('/mypage');
  };

  // 오류 팝업 닫기 핸들러
  const handleErrorClose = () => {
    setShowErrorPopup(false);
    setErrorMessage('');
  };

  // 처리중 팝업 닫기 핸들러
  const handleProcessingClose = () => {
    setShowProcessingPopup(false);
  };

  // 수정 핸들러
  const handleEdit = () => {
    if (!fnqId) return;

    console.log('수정 버튼 클릭됨');
    console.log('isProcessing:', isProcessing);
    console.log('canEdit:', canEdit);

    // 처리중인 경우 팝업 표시
    if (isProcessing) {
      console.log('처리중 팝업 표시');
      setShowProcessingPopup(true);
      return;
    }

    console.log('수정 페이지로 이동');
    router.push(`/mypage/fnq/${fnqId}/edit`);
  };

  return (
    <AnimatePresence>
      {fnqId && (
        <S.DetailWrapper
          key={fnqId}
          isMobile={isMobile}
          initial={getInitialPosition}
          animate={animateValue}
          exit={isMobile ? { y: '100dvh' } : { x: '100dvw' }}
          transition={{ duration: 1, ease: [0.2, 0, 0.4, 1] }}
          onClick={handlePanelClick}
        >
          <S.DetailPageName>문의 상세</S.DetailPageName>
          <S.ButtonWrapper>
            <S.Button onClick={handleEdit} disabled={isDeleting}>
              수정
            </S.Button>
            <S.Button onClick={handleDeleteClick} disabled={isDeleting}>
              {isDeleting ? '삭제 중...' : '삭제'}
            </S.Button>
          </S.ButtonWrapper>

          {loading && (
            <Loader
              key="loading-loader"
              baseColor="#F7F7F7"
              style={{ marginTop: isMobile ? '-22px' : '-10px', marginLeft: isMobile ? '-12px' : '-10px', transform: isMobile ? 'none' : 'rotate(90deg)', transformOrigin: isMobile ? 'none' : 'top left', position: "relative", zIndex: "-10" }}
            />
          )}
          {error ? (
            <Error
              key="error-component"
              style={{ marginTop: isMobile ? '20px' : '-4px' }}
            />
          ) : isLoading ? (
            <Loader
              key="isloading-loader"
              baseColor="#F7F7F7"
              style={{
                marginTop: isMobile ? '-22px' : '-10px',
                marginLeft: isMobile ? '-12px' : '-10px',
                transform: isMobile ? 'none' : 'rotate(90deg)',
                transformOrigin: isMobile ? 'none' : 'top left',
                position: "relative",
                zIndex: "-10"
              }}
            />
          ) : !fnq ? (
            <Error
              key="not-found-error"
              style={{ marginTop: isMobile ? '20px' : '-4px' }}
              message="프로젝트를 찾을 수 없습니다."
            />
          ) : (
            <S.DetailContextWrapper key="main-content" style={{ overflowY: 'auto' }}>
              <S.Header>
                <S.HeaderTitle>
                  <S.Title>{fnq?.title}</S.Title>
                  <S.CreatedAt>{fnq?.created_at && formatDate(fnq?.created_at)}</S.CreatedAt>
                  <S.StatusWrapper>
                    <FnqStatus
                      currentStatus={fnq.fnq_status}
                      allStatuses={[]}
                    />
                  </S.StatusWrapper>
                  <S.InfoWrapper>
                    <S.InfoTitle>수량</S.InfoTitle>
                    <S.InfoValue>{fnq?.count ? fnq?.count : '-'}</S.InfoValue>
                    <S.InfoTitle>예산</S.InfoTitle>
                    <S.InfoValue>{formatNumber(fnq?.budget)}</S.InfoValue>
                    <S.InfoTitle>희망 납기일</S.InfoTitle>
                    <S.InfoValue>{fnq?.due_date ? formatDate(fnq?.due_date) : '-'}</S.InfoValue>
                  </S.InfoWrapper>
                </S.HeaderTitle>
              </S.Header>

              {fnq?.img && fnq?.img.length > 0 && (
                <S.FileWrapper>
                  <S.FileList>
                    {fnq.img.map((file, idx) => {
                      let fileData;

                      try {
                        // JSON 문자열인 경우 파싱
                        if (typeof file === 'string' && file.startsWith('{')) {
                          fileData = JSON.parse(file);
                        } else if (typeof file === 'object') {
                          fileData = file;
                        } else {
                          fileData = { url: file, name: `첨부 파일 ${idx + 1}` };
                        }
                      } catch (error) {
                        console.error('파일 데이터 파싱 오류:', error);
                        fileData = { url: file, name: `첨부 파일 ${idx + 1}` };
                      }

                      return (
                        <S.File
                          key={`file-${fnqId}-${idx}-${fileData.name || idx}`}
                          href={fileData.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          📎 {fileData.name}
                        </S.File>
                      );
                    })}
                  </S.FileList>
                </S.FileWrapper>
              )}

              <EditorFnqRenderer item={fnq?.detail} />

            </S.DetailContextWrapper>
          )}
        </S.DetailWrapper>
      )}

      {/* 삭제 확인 팝업 */}
      {showDeleteConfirm && (
        <Popup
          key="delete-confirm-popup"
          isVisible={showDeleteConfirm}
          title="삭제하시겠습니까?"
          message="삭제된 문의는 복구할 수 없습니다."
          type="warning"
          buttons={[
            {
              text: '취소',
              onClick: handleDeleteCancel,
              variant: 'secondary'
            },
            {
              text: '삭제',
              onClick: handleDeleteConfirm,
              variant: 'danger'
            }
          ]}
          onOverlayClick={handleDeleteCancel}
        />
      )}

      {/* 삭제 성공 팝업 */}
      {showSuccessPopup && (
        <Popup
          key="delete-success-popup"
          isVisible={showSuccessPopup}
          title="삭제 완료"
          message="문의하신 프로젝트가 삭제되었습니다"
          type="success"
          buttons={[
            {
              text: '확인',
              onClick: handleSuccessClose,
              variant: 'primary'
            }
          ]}
          onOverlayClick={handleSuccessClose}
        />
      )}

      {/* 삭제 오류 팝업 */}
      {showErrorPopup && (
        <Popup
          key="delete-error-popup"
          isVisible={showErrorPopup}
          title="오류 발생"
          message={errorMessage}
          type="error"
          buttons={[
            {
              text: '확인',
              onClick: handleErrorClose,
              variant: 'primary'
            }
          ]}
          onOverlayClick={handleErrorClose}
        />
      )}

      {/* 처리중 팝업 */}
      {showProcessingPopup && (
        <Popup
          key="processing-popup"
          isVisible={showProcessingPopup}
          title="수정 불가"
          message="현재 중개중인 문의는 수정하거나 삭제할 수 없습니다. 관리자에게 문의해주세요."
          type="warning"
          buttons={[
            {
              text: '확인',
              onClick: handleProcessingClose,
              variant: 'primary'
            }
          ]}
          onOverlayClick={handleProcessingClose}
        />
      )}
    </AnimatePresence>
  );
}

export default MypageFnqDeatilContainer;
