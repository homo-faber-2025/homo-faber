'use client';

import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { set, useForm } from 'react-hook-form';

function LoginContainer() {
  const [error, setError] = useState('');
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const password = watch('password');
  const supabase = createClient();

  const onSubmit = async (formData) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      if (error) {
        throw error;
      }
      router.push('/');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>이메일</label>
        <input
          type="text"
          id="email"
          placeholder="이메일을 입력해주세요."
          {...register('email', {
            required: '이메일을 입력해주시기 바랍니다.',
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: '이메일 형식이 아닙니다.',
            },
          })}
        />
        <p>{errors.email?.message}</p>
      </div>
      <div>
        <label>비밀번호</label>
        <input
          type="password"
          id="password"
          placeholder="비밀번호를 입력해주세요."
          {...register('password', {
            required: true,
            minLength: {
              value: 6,
              message: '비밀번호를 6글자 이상 입력해주시기 바랍니다.',
            },
          })}
        />
        <p>{errors.password?.message}</p>
      </div>
      {error && <p>{error}</p>}
      <button>로그인</button>
    </form>
  );
}

export default LoginContainer;
