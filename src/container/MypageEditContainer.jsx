'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { updateUserProfile, getUserInfo } from '@/utils/api/user-api';
import useWindowSize from '@/hooks/useWindowSize';
import { AnimatePresence } from 'motion/react';
import * as S from '@/styles/user/userContainer.style';
import DeleteAccountButton from '@/components/mypage/DeleteAccountButton';
import Popup from '@/components/common/Popup';

function MypageEditContainer({ }) {
  const { user, loading, refreshUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { isMobile, isReady } = useWindowSize();
  // 패널 상태: 'hidden' | 'expanded' | 'collapsed'
  const [panelState, setPanelState] = useState('hidden');
  const prevEditIdRef = useRef(null); // 이전 edit 경로 추적
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userInfo, setUserInfo] = useState(null);

  const isEditPage = pathname.startsWith('/mypage/edit');

  // 분기점 1: edit 페이지 진입 시 - expanded 상태로 변경
  useEffect(() => {
    if (isEditPage && isReady) {
      // 새로운 edit 페이지로 변경되었을 때만 expanded로 설정
      if (prevEditIdRef.current !== pathname) {
        setPanelState('expanded');
        prevEditIdRef.current = pathname;
        // MypageContainer도 expanded 되도록 이벤트 발생
        window.dispatchEvent(new CustomEvent('expandPanel', { detail: { route: 'mypage' } }));
      }
    } else if (!isEditPage) {
      setPanelState('hidden');
      prevEditIdRef.current = null;
    }
  }, [isEditPage, pathname, isReady]);

  // 분기점 2: 지도 클릭 시 - collapsed 상태로 변경
  useEffect(() => {
    if (!isEditPage) return;

    const handleCollapsePanel = () => {
      if (panelState === 'expanded') {
        setPanelState('collapsed');
      }
    };

    window.addEventListener('collapsePanel', handleCollapsePanel);
    return () => {
      window.removeEventListener('collapsePanel', handleCollapsePanel);
    };
  }, [isEditPage, panelState]);

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
    const isFirstMount = prevEditIdRef.current !== pathname && isEditPage;

    if (panelState === 'hidden') {
      return isMobile ? { y: '100dvh' } : { x: '100dvw' };
    }

    if (panelState === 'expanded') {
      // 처음 마운트될 때만 화면 밖에서 시작, 이후에는 initial 제거하여 motion이 자동 감지
      return isFirstMount ? (isMobile ? { y: '100dvh' } : { x: '100dvw' }) : undefined;
    }

    // collapsed - expanded에서 collapsed로 변경될 때는 현재 위치에서 시작
    return undefined;
  }, [panelState, pathname, isEditPage, isMobile]);

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

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // 사용자 데이터로 폼 초기화
  useEffect(() => {
    const fetchUserData = async () => {
      if (user && !loading) {
        try {
          const userData = await getUserInfo();
          setUserInfo(userData);
          setFormData({
            name: userData?.name || user.user_metadata?.name || '',
            password: '',
            confirmPassword: '',
          });
        } catch (error) {
          console.error('사용자 정보 조회 중 오류:', error);
          // 오류 발생 시 기본값 설정
          setFormData({
            name: user.user_metadata?.name || '',
            password: '',
            confirmPassword: '',
          });
        }
      }
    };

    fetchUserData();
  }, [user, loading]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // 에러 메시지 초기화
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;

    // 비밀번호를 입력했을 때만 검증
    if (formData.password || formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        setError('새 비밀번호가 일치하지 않습니다.');
        return;
      }

      if (formData.password.length < 6) {
        setError('비밀번호는 최소 6자 이상이어야 합니다.');
        return;
      }
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await updateUserProfile(formData);
      await refreshUser(); // 사용자 정보 새로고침
      setSuccess('프로필이 성공적으로 업데이트되었습니다!');

      // 2초 후 마이페이지로 이동
      setTimeout(() => {
        router.push('/mypage');
      }, 2000);
    } catch (err) {
      setError(err.message || '프로필 업데이트에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/mypage');
  };

  return (
    <AnimatePresence>
      {isEditPage && (
        <S.EditWrapper
          key="mypage-edit"
          isMobile={isMobile}
          initial={getInitialPosition}
          animate={animateValue}
          exit={isMobile ? { y: '100dvh' } : { x: '100dvw' }}
          transition={{ duration: 1, ease: [0.2, 0, 0.4, 1] }}
          onClick={handlePanelClick}
        >
          <S.PageName>프로필 수정</S.PageName>
          <S.UserForm
            onSubmit={handleSave}
            onClick={(e) => e.stopPropagation()}
          >
            <S.FormGroup>
              <S.Label htmlFor="name">이름</S.Label>
              <S.Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="이름을 입력해주세요"
                disabled={isLoading}
              />
            </S.FormGroup>
            <S.FormGroup>
              <S.Label htmlFor="password">새 비밀번호</S.Label>
              <S.Input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="변경할 비밀번호를 입력해주세요"
                disabled={isLoading}
              />
            </S.FormGroup>
            <S.FormGroup>
              <S.Label htmlFor="confirmPassword">새 비밀번호 확인</S.Label>
              <S.Input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="비밀번호를 다시 입력해주세요"
                disabled={isLoading}
              />
            </S.FormGroup>

            {error && (
              <Popup
                key="edit-error-popup"
                isVisible={!!error}
                message={error}
                onClose={() => setError('')}
                type="error"
              />
            )}
            {success && (
              <Popup
                key="edit-success-popup"
                isVisible={!!success}
                message={success}
                onClose={() => setSuccess('')}
                type="success"
              />
            )}

            <S.ButtonWrapper>
              <S.SubmitButton
                type="button"
                onClick={handleCancel}
                disabled={isLoading}
              >
                취소
              </S.SubmitButton>

              <S.SubmitButton type="submit" disabled={isLoading}>
                {isLoading ? '저장 중...' : '저장'}
              </S.SubmitButton>
            </S.ButtonWrapper>
          </S.UserForm>
          <DeleteAccountButton user={user} />
        </S.EditWrapper>
      )}
    </AnimatePresence>
  );
}

export default MypageEditContainer;
