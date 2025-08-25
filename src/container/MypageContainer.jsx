'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import styled from '@emotion/styled';
import { motion } from 'motion/react';
import { usePathname } from 'next/navigation';
import { useBookmarks } from '@/hooks/useBookmarks';
import { convertIndustryNameToKorean } from '@/utils/converters';

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

const BookmarkSection = styled.div`
  margin-top: 30px;
  width: 100%;
`;

const BookmarkTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
`;

const BookmarkList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  padding: 10px;
`;

const BookmarkItem = styled.div`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const StoreName = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
`;

const StoreInfo = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
`;

const StoreTags = styled.div`
  font-size: 12px;
  color: #888;
`;

const NoBookmarks = styled.div`
  text-align: center;
  color: #666;
  font-size: 14px;
  padding: 20px;
`;

const ProfileEditSection = styled.div`
  margin-top: 20px;
  width: 100%;
`;

const EditButton = styled.button`
  padding: 8px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  font-family: var(--font-gothic);
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-right: 10px;
  
  &:hover {
    background: #0056b3;
  }
`;

const CancelButton = styled(EditButton)`
  background: #6c757d;
  
  &:hover {
    background: #545b62;
  }
`;

const SaveButton = styled(EditButton)`
  background: #28a745;
  
  &:hover {
    background: #218838;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  font-family: var(--font-gothic);
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 12px;
  margin-top: 5px;
`;

const SuccessMessage = styled.div`
  color: #28a745;
  font-size: 12px;
  margin-top: 5px;
`;

function MypageContainer({ onLoadComplete }) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { bookmarks, loading: bookmarksLoading } = useBookmarks();

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

  const handleBookmarkClick = (storeId) => {
    router.push(`/store/${storeId}`);
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

        {/* 프로필 수정 버튼 */}
        <EditButton onClick={() => router.push('/mypage/edit')}>
          프로필 수정
        </EditButton>

        <LogoutButton onClick={handleLogout}>
          로그아웃
        </LogoutButton>

        {/* 북마크된 가게 리스트 */}
        <BookmarkSection>
          <BookmarkTitle>북마크한 가게</BookmarkTitle>
          <BookmarkList>
            {bookmarksLoading ? (
              <NoBookmarks>로딩 중...</NoBookmarks>
            ) : bookmarks.length > 0 ? (
              bookmarks.map((bookmark) => {
                const store = bookmark.stores;
                if (!store) return null;

                return (
                  <BookmarkItem
                    key={bookmark.id}
                    onClick={() => handleBookmarkClick(store.id)}
                  >
                    <StoreName>{store.name}</StoreName>
                    {store.address && (
                      <StoreInfo>{store.address}</StoreInfo>
                    )}
                    {store.store_industry?.length > 0 && (
                      <StoreTags>
                        {store.store_industry
                          .map(item => item.industry_types?.name)
                          .filter(Boolean)
                          .map(convertIndustryNameToKorean)
                          .join(' • ')}
                      </StoreTags>
                    )}
                  </BookmarkItem>
                );
              })
            ) : (
              <NoBookmarks>북마크한 가게가 없습니다.</NoBookmarks>
            )}
          </BookmarkList>
        </BookmarkSection>
      </ProfileCard>
    </MyPageWrapper>
  );
}

export default MypageContainer;