'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Editor from '@/components/interview/Editor';
import StoreSelect from '@/components/interview/StoreSelect';
import { useImageUpload } from '@/hooks/useImageUpload';
import {
  getInterviewById,
  updateInterview,
  createInterview,
} from '@/utils/supabase/interview';
import * as S from '@/styles/admin/adminForm.style';
import Button from '@/components/admin/Button';

const InterviewForm = ({
  mode = 'create',
  interviewId = null,
  onSave,
  onBack,
  isLoading = false,
  onSaveClick,
}) => {
  const router = useRouter();
  const [selectedStoreId, setSelectedStoreId] = useState('');
  const [coverImgPreview, setCoverImgPreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [localCoverImage, setLocalCoverImage] = useState(null);
  const [error, setError] = useState(null);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 에디터 관련 상태
  const editorRef = useRef(null);
  const [editorData, setEditorData] = useState({ blocks: [] });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      intro: '',
      coverImg: '',
      date: '',
      interviewee: '',
    },
    mode: 'onChange',
  });

  const { uploadImage, processImageForPreview } = useImageUpload({
    bucket: 'gallery',
    maxSizeInMB: 0.5,
  });

  // 데이터 로딩
  useEffect(() => {
    if (mode === 'edit' && interviewId) {
      const loadData = async () => {
        try {
          setIsDataLoading(true);
          const interview = await getInterviewById(interviewId);

          setSelectedStoreId(String(interview.store_id || ''));
          setValue('intro', interview.intro || '');
          setValue('coverImg', interview.cover_img || '');
          setCoverImgPreview(interview.cover_img || '');
          setValue('date', interview.date || '');
          setValue('interviewee', interview.interviewee || '');
          setEditorData({ blocks: interview.contents || [] });
        } catch (err) {
          setError(err.message);
        } finally {
          setIsDataLoading(false);
        }
      };
      loadData();
    }
  }, [mode, interviewId, setValue]);

  // 이미지 프리뷰 처리 (에디터 데이터 보존)
  const handleImagePreview = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);

      // 현재 에디터 데이터 백업
      if (editorRef.current?.isReady()) {
        const currentData = await editorRef.current.save();
        setEditorData(currentData);
      }

      const result = await processImageForPreview(file);
      if (result.success) {
        setLocalCoverImage(result.file.originalFile);
        setCoverImgPreview(result.file.url);
      } else {
        alert(`이미지 처리에 실패했습니다: ${result.error}`);
      }
    } catch (error) {
      console.error('이미지 처리 실패:', error);
      alert('이미지 처리에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  // 저장 처리
  const handleSave = useCallback(
    async (formData) => {
      try {
        setIsSaving(true);

        if (!selectedStoreId) {
          alert('연결할 스토어를 선택해주세요.');
          return;
        }

        // 에디터 데이터 가져오기
        let outputData = editorData;
        if (editorRef.current?.isReady()) {
          outputData = await editorRef.current.save();
        }

        // 이미지 업로드
        let coverImgUrl = coverImgPreview;
        if (localCoverImage) {
          const coverImg = await uploadImage(localCoverImage);
          coverImgUrl = coverImg.file.url;
        }

        const updateData = {
          store_id: selectedStoreId,
          intro: formData.intro || null,
          cover_img: coverImgUrl || null,
          date: formData.date || null,
          interviewee: formData.interviewee || null,
          contents: outputData?.blocks || [],
        };

        if (mode === 'create') {
          await createInterview(updateData);
          alert('인터뷰가 성공적으로 등록되었습니다.');
        } else {
          await updateInterview(interviewId, updateData);
          alert('수정 완료');
        }

        router.push('/admin/interview');
      } catch (error) {
        console.error('저장 중 오류 발생:', error);
        alert('저장 중 오류가 발생했습니다.');
      } finally {
        setIsSaving(false);
      }
    },
    [
      selectedStoreId,
      localCoverImage,
      uploadImage,
      mode,
      interviewId,
      router,
      coverImgPreview,
      editorData,
    ],
  );

  useEffect(() => {
    if (onSaveClick) {
      onSaveClick.current = () => handleSubmit(handleSave)();
    }
  }, [onSaveClick, handleSubmit, handleSave]);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push('/admin/interview');
    }
  };

  if (isDataLoading) {
    return (
      <S.AdminFormWrapper>
        <S.Header>
          <h1>{mode === 'create' ? '인터뷰 등록' : '인터뷰 수정'}</h1>
          <Button onClick={handleBack}>목록으로</Button>
        </S.Header>
        <S.LoadingMessage>인터뷰 데이터를 불러오는 중...</S.LoadingMessage>
      </S.AdminFormWrapper>
    );
  }

  if (error) {
    return (
      <S.AdminFormWrapper>
        <S.Header>
          <h1>{mode === 'create' ? '인터뷰 등록' : '인터뷰 수정'}</h1>
          <Button onClick={handleBack}>목록으로</Button>
        </S.Header>
        <S.ErrorMessage>오류가 발생했습니다: {error}</S.ErrorMessage>
      </S.AdminFormWrapper>
    );
  }

  return (
    <S.AdminFormWrapper>
      <S.Header>
        <h1>{mode === 'create' ? '인터뷰 등록' : '인터뷰 수정'}</h1>
        <S.Actions>
          <Button onClick={handleBack}>목록으로</Button>
          <Button
            className="edit"
            onClick={handleSubmit(handleSave)}
            disabled={isSaving}
          >
            {isSaving ? '저장 중...' : '저장'}
          </Button>
        </S.Actions>
      </S.Header>

      <S.FormSection>
        <S.FormField>
          <StoreSelect
            selectedStoreId={selectedStoreId}
            onStoreChange={setSelectedStoreId}
            placeholder="인터뷰를 연결할 스토어를 선택하세요"
          />
        </S.FormField>

        <S.FormGrid>
          <div>
            <S.FormField>
              <label htmlFor="cover-img">커버 이미지</label>
              <input
                id="cover-img"
                type="file"
                accept="image/*"
                onChange={handleImagePreview}
                style={{ display: 'none' }}
              />
              <Button
                className="create"
                onClick={() => document.getElementById('cover-img').click()}
                disabled={isUploading}
              >
                {isUploading ? '업로드 중...' : '이미지 선택'}
              </Button>
              {coverImgPreview && (
                <div className="image-preview">
                  <Image
                    src={coverImgPreview}
                    alt="커버 이미지 미리보기"
                    width={300}
                    height={200}
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              )}
            </S.FormField>

            <S.FormField>
              <label htmlFor="intro">인터뷰 소개</label>
              <textarea
                id="intro"
                {...register('intro')}
                placeholder="인터뷰에 대한 간단한 소개를 입력하세요"
              />
              {errors.intro && (
                <S.ErrorInputMessage>
                  {errors.intro.message}
                </S.ErrorInputMessage>
              )}
            </S.FormField>

            <S.FormField>
              <label htmlFor="interviewee">인터뷰이</label>
              <input
                id="interviewee"
                type="text"
                {...register('interviewee')}
                placeholder="인터뷰이 이름을 입력하세요"
              />
              {errors.interviewee && (
                <S.ErrorInputMessage>
                  {errors.interviewee.message}
                </S.ErrorInputMessage>
              )}
            </S.FormField>

            <S.FormField>
              <label htmlFor="date">인터뷰 날짜</label>
              <input id="date" type="date" {...register('date')} />
              {errors.date && (
                <S.ErrorInputMessage>{errors.date.message}</S.ErrorInputMessage>
              )}
            </S.FormField>
          </div>

          <S.FormField>
            <h3>인터뷰 내용</h3>
            <Editor ref={editorRef} data={editorData} />
          </S.FormField>
        </S.FormGrid>
      </S.FormSection>
    </S.AdminFormWrapper>
  );
};

export default InterviewForm;
