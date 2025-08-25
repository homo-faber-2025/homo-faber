'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import styled from '@emotion/styled';
import { motion } from 'motion/react';
import { usePathname } from 'next/navigation';

const MyPageWrapper = styled(motion.main)`
  width: 100%;
  height: 100%;
  padding-left: 70px;
  padding-top: 27px;
  z-index: 3;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-left: solid 3px #DADADA;
  box-shadow: -8px 4px 10px 0 rgba(0,0,0,0.25);
  font-family: var(--font-gothic);
  pointer-events: auto;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(270deg, rgba(102, 126, 234, 0.3) 19%, rgba(118, 75, 162, 0.2) 42%, rgba(102, 126, 234, 0.4) 95%);
  }
`;

const MyPageName = styled.h1`
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.3rem;
  position: absolute;
  transform: rotate(90deg);
  transform-origin: top left;
  top: 17px;
  left: 26px;
  color: white;
`;

const ProfileCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 500px;
  width: 100%;
  text-align: center;
  position: relative;
  z-index: 1;
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 32px;
  color: white;
  font-weight: bold;
`;

const UserName = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
`;

const UserEmail = styled.p`
  font-size: 16px;
  color: #666;
  margin-bottom: 30px;
`;

const LogoutButton = styled.button`
  padding: 12px 24px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  font-family: var(--font-gothic);
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: #c82333;
  }
`;

const LoadingText = styled.div`
  color: white;
  font-size: 18px;
  font-family: var(--font-gothic);
`;

function MypageContainer({ onLoadComplete }) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // 마이페이지 패널 클릭 시 홈으로 이동
  const handleMypageWrapperClick = () => {
    if (pathname === '/') {
      router.push('/mypage');
    } else if (pathname.startsWith('/mypage/')) {
      router.push('/mypage');
    }
  };

  useEffect(() => {
    if (onLoadComplete) {
      onLoadComplete();
    }
  }, [onLoadComplete]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('로그아웃 중 오류가 발생했습니다:', error);
    }
  };

  if (loading) {
    return (
      <MyPageWrapper>
        <LoadingText>로딩 중...</LoadingText>
      </MyPageWrapper>
    );
  }

  if (!user) {
    return (
      <MyPageWrapper>
        <LoadingText>인증 중...</LoadingText>
      </MyPageWrapper>
    );
  }

  const getUserInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase();
  };

  return (
    <MyPageWrapper onClick={handleMypageWrapperClick}>
      <MyPageName>마이페이지</MyPageName>
      <ProfileCard onClick={(e) => e.stopPropagation()}>
        <Avatar>
          {getUserInitial(user.user_metadata?.name)}
        </Avatar>
        <UserName>
          {user.user_metadata?.name || '사용자'}
        </UserName>
        <UserEmail>{user.email}</UserEmail>
        <LogoutButton onClick={handleLogout}>
          로그아웃
        </LogoutButton>
      </ProfileCard>
    </MyPageWrapper>
  );
}

export default MypageContainer;