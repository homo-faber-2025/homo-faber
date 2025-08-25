'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import styled from '@emotion/styled';
import { motion } from 'motion/react';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const SignupWrapper = styled(motion.main)`
  width: 100%;
  height: 100%;
  padding-left: 70px;
  padding-top: 27px;
  z-index: 3;
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
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
    background: linear-gradient(270deg, rgba(40, 167, 69, 0.3) 19%, rgba(32, 201, 151, 0.2) 42%, rgba(40, 167, 69, 0.4) 95%);
  }
`;

const SignupPageName = styled.h1`
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

const SignupForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 400px;
  width: 100%;
  position: relative;
  z-index: 1;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-family: var(--font-gothic);
  font-weight: 600;
  color: #333;
  font-size: 14px;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  font-family: var(--font-gothic);
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
  
  &::placeholder {
    color: #999;
  }
`;

const ErrorMessage = styled.p`
  color: #dc3545;
  font-size: 14px;
  margin: 0;
  font-family: var(--font-gothic);
`;

const SubmitButton = styled.button`
  padding: 12px 24px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  font-family: var(--font-gothic);
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: #218838;
  }
  
  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;

const LoginLink = styled.div`
  text-align: center;
  margin-top: 20px;
  font-family: var(--font-gothic);
  
  a {
    color: #007bff;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

function SignupContainer({ onLoadComplete }) {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // 컴포넌트 로드 완료 시 부모 컴포넌트에 알림
  useEffect(() => {
    if (onLoadComplete) {
      onLoadComplete();
    }
  }, [onLoadComplete]);

  // 회원가입 패널 클릭 시 홈으로 이동
  const handleSignupWrapperClick = () => {
    if (pathname === '/') {
      router.push('/signup');
    } else if (pathname.startsWith('/signup/')) {
      router.push('/signup');
    }
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: 'onChange' });
  const password = watch('password');

  const onSubmit = async (formData) => {
    setIsLoading(true);
    setError('');

    try {
      const { data, error } = await signUp(formData.email, formData.password, {
        name: formData.name,
      });

      if (error) {
        throw error;
      }

      if (data?.user) {
        router.push('/mypage');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SignupWrapper onClick={handleSignupWrapperClick}>
      <SignupPageName>회원가입</SignupPageName>
      <SignupForm onSubmit={handleSubmit(onSubmit)} onClick={(e) => e.stopPropagation()}>
        <h2 style={{
          textAlign: 'center',
          marginBottom: '20px',
          fontFamily: 'var(--font-gothic)',
          color: '#333'
        }}>
          회원가입
        </h2>

        <FormGroup>
          <Label htmlFor="email">이메일</Label>
          <Input
            type="email"
            id="email"
            placeholder="이메일을 입력해주세요"
            {...register('email', {
              required: '이메일을 입력해주세요',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: '올바른 이메일 형식이 아닙니다',
              },
            })}
          />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="name">이름</Label>
          <Input
            type="text"
            id="name"
            placeholder="이름을 입력해주세요"
            {...register('name', { required: '이름을 입력해주세요' })}
          />
          {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="password">비밀번호</Label>
          <Input
            type="password"
            id="password"
            placeholder="비밀번호를 입력해주세요"
            {...register('password', {
              required: '비밀번호를 입력해주세요',
              minLength: {
                value: 6,
                message: '비밀번호는 최소 6자 이상이어야 합니다',
              },
            })}
          />
          {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="confirmPassword">비밀번호 확인</Label>
          <Input
            type="password"
            id="confirmPassword"
            placeholder="비밀번호를 다시 입력해주세요"
            {...register('confirmPassword', {
              validate: (value) =>
                value === password || '비밀번호가 일치하지 않습니다',
            })}
          />
          {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword.message}</ErrorMessage>}
        </FormGroup>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <SubmitButton type="submit" disabled={isLoading}>
          {isLoading ? '가입 중...' : '회원가입'}
        </SubmitButton>

        <LoginLink>
          이미 계정이 있으신가요? <Link href="/login">로그인</Link>
        </LoginLink>
      </SignupForm>
    </SignupWrapper>
  );
}

export default SignupContainer; 
