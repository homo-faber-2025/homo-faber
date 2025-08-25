'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { motion } from 'motion/react';
import { usePathname } from 'next/navigation';
import { updateUserProfile } from '@/utils/supabase/user';

const EditWrapper = styled(motion.main)`
  width: calc(80vw - 60px);
  height: 100dvh;
  padding: 0px 10px 20px 50px;
  background-color: #F7F7F7;
  position: absolute;
  right: ${(props) => props.right};
  top: 0px;
  z-index: 7;
  box-shadow: -2px 0 4px 0 rgba(79,75,31,0.57);
  display: flex;
  overflow: hidden;
`;

const EditPageName = styled.h1`
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

const EditCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 500px;
  width: 100%;
  position: relative;
  z-index: 1;
`;

const EditTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 30px;
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  font-family: var(--font-gothic);
  background: white;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 30px;
  justify-content: center;
`;

const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  font-family: var(--font-gothic);
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SaveButton = styled(Button)`
  background: #28a745;
  color: white;
  
  &:hover:not(:disabled) {
    background: #218838;
  }
`;

const CancelButton = styled(Button)`
  background: #6c757d;
  color: white;
  
  &:hover:not(:disabled) {
    background: #545b62;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 14px;
  margin-top: 8px;
  text-align: center;
`;

const SuccessMessage = styled.div`
  color: #28a745;
  font-size: 14px;
  margin-top: 8px;
  text-align: center;
`;

const LoadingText = styled.div`
  color: white;
  font-size: 18px;
  font-family: var(--font-gothic);
`;

function MypageEditContainer({ }) {
  const { user, loading, refreshUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [right, setRight] = useState('-100dvw');

  const [formData, setFormData] = useState({
    name: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 마이페이지 편집 패널 클릭 시 홈으로 이동
  const handleEditWrapperClick = () => {
    if (pathname === '/') {
      router.push('/mypage/edit');
    } else if (pathname.startsWith('/mypage/edit')) {
      router.push('/mypage/edit');
    }
  };

  // pathname 변경 시 width 업데이트
  useEffect(() => {
    const newRight = pathname.startsWith('/mypage/') && pathname !== '/mypage' ? '0px' : '-100dvw';
    setRight(newRight);
  }, [pathname]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // 사용자 데이터로 폼 초기화
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.user_metadata?.name || '',
        phone: user.user_metadata?.phone || '',
        company: user.user_metadata?.company || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // 에러 메시지 초기화
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSave = async () => {
    if (!user) return;

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await updateUserProfile(user.id, formData);
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

  if (loading) {
    return (
      <EditWrapper>
        <LoadingText>로딩 중...</LoadingText>
      </EditWrapper>
    );
  }

  if (!user) {
    return (
      <EditWrapper>
        <LoadingText>인증 중...</LoadingText>
      </EditWrapper>
    );
  }

  return (
    <EditWrapper
      right={right}
      initial={{ right: '-100dvw' }}
      animate={{ right: right }}
      exit={{ right: '-100dvw' }}
      transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
    >
      <EditPageName>프로필 수정</EditPageName>
      <EditCard onClick={(e) => e.stopPropagation()}>
        <EditTitle>프로필 정보 수정</EditTitle>

        <FormGroup>
          <Label htmlFor="name">이름</Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="이름을 입력하세요"
          />
        </FormGroup>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        <ButtonGroup>
          <CancelButton onClick={handleCancel} disabled={isLoading}>
            취소
          </CancelButton>
          <SaveButton onClick={handleSave} disabled={isLoading}>
            {isLoading ? '저장 중...' : '저장'}
          </SaveButton>
        </ButtonGroup>
      </EditCard>
    </EditWrapper>
  );
}

export default MypageEditContainer;
