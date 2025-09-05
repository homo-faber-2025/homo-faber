'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { createWord, updateWord, getWordById } from '@/utils/supabase/word';
import Button from '@/components/admin/Button';
import * as S from '@/styles/admin/adminForm.style';

const WordForm = ({
  mode = 'create',
  wordId,
}) => {
  // 기본값 설정
  const formMode = mode;
  const formWordId = wordId;
  const router = useRouter();
  const [error, setError] = useState(null);
  const [wordData, setWordData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);

  // react-hook-form 설정
  const {
    setValue,
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      meaning: '',
      source: '',
    },
    mode: 'onChange', // 실시간 유효성 검사
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        if (formMode === 'edit' && formWordId) {
          setIsDataLoading(true);
          setError(null);

          // 단어 데이터 로드
          const word = await getWordById(formWordId);
          console.log('Loaded word data:', word);
          setWordData(word);

          // 기본 정보 설정
          setValue('name', word.name || '');
          setValue('meaning', word.meaning || '');
          setValue('source', word.source || '');

          // 폼 유효성 검사 트리거
          await trigger(['name', 'meaning']);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsDataLoading(false);
      }
    };

    loadData();
  }, [formMode, formWordId, setValue]);

  const handleBack = () => {
    router.push('/admin/word');
  };

  const handleSave = useCallback(async (formData) => {
    try {
      setIsSaving(true);

      const wordData = {
        name: formData.name,
        meaning: formData.meaning,
        source: formData.source || '',
      };

      if (formMode === 'create') {
        await createWord(wordData);
        alert('단어가 성공적으로 등록되었습니다.');
        router.push('/admin/word');
      } else {
        await updateWord(formWordId, wordData);
        alert('수정 완료');
        router.push('/admin/word');
      }

    } catch (error) {
      console.error('저장 중 오류 발생:', error);
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  }, [formMode, formWordId, router]);

  if (isDataLoading) {
    return (
      <S.AdminFormWrapper>
        <S.Header>
          <h1>{formMode === 'create' ? '단어 등록' : '단어 수정'}</h1>
          <Button onClick={handleBack}>목록으로</Button>
        </S.Header>
        <S.LoadingMessage>단어 데이터를 불러오는 중...</S.LoadingMessage>
      </S.AdminFormWrapper>
    );
  }

  if (error) {
    return (
      <S.AdminFormWrapper>
        <S.Header>
          <h1>{formMode === 'create' ? '단어 등록' : '단어 수정'}</h1>
          <Button onClick={handleBack}>목록으로</Button>
        </S.Header>
        <S.ErrorMessage>오류가 발생했습니다: {error}</S.ErrorMessage>
      </S.AdminFormWrapper>
    );
  }

  return (
    <S.AdminFormWrapper>
      <S.Header>
        <h1>{formMode === 'create' ? '단어 등록' : '단어 수정'}</h1>
        <S.Actions>
          <Button onClick={handleBack}>목록으로</Button>
          <Button className="edit" onClick={handleSubmit(handleSave)} disabled={isSaving}>
            {isSaving ? '저장 중...' : '저장'}
          </Button>
        </S.Actions>
      </S.Header>

      <S.FormSection>
        <h2>{formMode === 'edit' && wordData?.name ? wordData.name : '단어 정보'}</h2>

        <S.FormGrid>
          <div>
            <S.FormField>
              <label htmlFor="name">단어명 <span style={{ color: 'red' }}>*</span></label>
              <input
                id="name"
                type="text"
                {...register('name', {
                  required: '단어명은 필수 입력값입니다.',
                  minLength: { value: 1, message: '단어명을 입력해주세요.' }
                })}
                placeholder="(필수) 단어명을 입력하세요"
              />
              {errors.name && (
                <S.ErrorInputMessage>
                  {errors.name.message}
                </S.ErrorInputMessage>
              )}
            </S.FormField>

            <S.FormField>
              <label htmlFor="source">출처</label>
              <input
                id="source"
                type="text"
                {...register('source')}
                placeholder="출처를 입력하세요 (선택사항)"
              />
            </S.FormField>
          </div>

          <div>
            <S.FormField>
              <label htmlFor="meaning">의미 <span style={{ color: 'red' }}>*</span></label>
              <textarea
                id="meaning"
                {...register('meaning', {
                  required: '의미는 필수 입력값입니다.',
                  minLength: { value: 1, message: '의미를 입력해주세요.' }
                })}
                placeholder="(필수) 단어의 의미를 자세히 입력하세요"
                rows={6}
              />
              {errors.meaning && (
                <S.ErrorInputMessage>
                  {errors.meaning.message}
                </S.ErrorInputMessage>
              )}
            </S.FormField>
          </div>
        </S.FormGrid>
      </S.FormSection>
    </S.AdminFormWrapper>
  );
};

export default WordForm;
