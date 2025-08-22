"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Editor from '@/components/interview/Editor';
import StoreSelect from '@/components/interview/StoreSelect';
import { getInterviewById, updateInterview } from '@/utils/supabase/interview';
import { checkAndCompressImage } from '@/utils/imageCompression';
import { createClient } from '@/utils/supabase/client';
import styled from '@emotion/styled';

const AdminInterviewEditPage = styled.div`
  padding: 20px;
  position: absolute;
  top: 0;
  left: 0;
  width: 100dvw;
  height: 100dvh;
  background: white;
  z-index: 10;
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e1e5e9;

  h1 {
    margin: 0;
    color: #333;
    font-size: 2rem;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
`;

const BackBtn = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #6c757d;
  color: white;

  &:hover {
    background-color: #545b62;
  }
`;

const SaveBtn = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #007bff;
  color: white;

  &:hover:not(:disabled) {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const FormSection = styled.div`
  margin-top: 20px;

  h2 {
    margin-bottom: 20px;
    color: #333;
    font-size: 1.8rem;
    border-bottom: 2px solid #e1e5e9;
    padding-bottom: 10px;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 30px;
`;

const FormField = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #333;
  }

  input, textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
    transition: border-color 0.2s ease;

    &:focus {
      outline: none;
      border-color: #007bff;
    }
  }

  textarea {
    resize: vertical;
    min-height: 100px;
  }
`;

const ImageUploadSection = styled.div`
  margin-bottom: 20px;

  .image-preview {
    margin-top: 10px;
    max-width: 300px;
    
    img {
      width: 100%;
      height: auto;
      border-radius: 6px;
      border: 1px solid #ddd;
    }
  }

  .upload-button {
    padding: 10px 20px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #218838;
    }

    &:disabled {
      background-color: #6c757d;
      cursor: not-allowed;
    }
  }
`;

const StoreSelectSection = styled.div`
  margin-bottom: 30px;
`;

const EditorSection = styled.div`
  margin-top: 20px;

  h3 {
    margin-bottom: 15px;
    color: #555;
    font-size: 1.3rem;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 1.1rem;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: red;
  font-size: 1.1rem;
`;

const InterviewEditPage = () => {
  const router = useRouter();
  const params = useParams();
  const interviewId = params.id;

  const [selectedStoreId, setSelectedStoreId] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [interviewData, setInterviewData] = useState(null);
  const [intro, setIntro] = useState('');
  const [coverImg, setCoverImg] = useState('');
  const [coverImgPreview, setCoverImgPreview] = useState('');
  const [date, setDate] = useState('');
  const [interviewee, setInterviewee] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const editorRef = useRef(null);

  useEffect(() => {
    const loadInterview = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getInterviewById(interviewId);
        console.log('로드된 인터뷰 데이터:', data);
        console.log('contents 데이터:', data?.contents);
        setInterviewData(data);
        setSelectedStoreId(data.store_id);
        setIntro(data.intro || '');
        setCoverImg(data.cover_img || '');
        setCoverImgPreview(data.cover_img || '');
        setDate(data.date || '');
        setInterviewee(data.interviewee || '');
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (interviewId) {
      loadInterview();
    }
  }, [interviewId]);

  const handleEditorChange = (api, event) => {
    console.log('handleEditorChange 호출됨:', { api, event });
  };

  const handleBack = () => {
    router.push('/admin/interview');
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);

      // 이미지 압축
      const compressedFile = await checkAndCompressImage(file, 0.5);

      // Supabase Storage에 업로드
      const supabase = createClient();
      const fileName = `cover_${Date.now()}_${compressedFile.name}`;

      const { data, error } = await supabase.storage
        .from('gallery')
        .upload(fileName, compressedFile);

      if (error) throw error;

      // 공개 URL 생성
      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(fileName);

      setCoverImg(publicUrl);
      setCoverImgPreview(publicUrl);

    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      alert('이미지 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditorSave = async () => {
    try {
      if (!editorRef.current || !editorRef.current.isReady()) {
        console.error('Editor가 준비되지 않았습니다');
        return;
      }

      const outputData = await editorRef.current.save();
      const updateData = {
        store_id: selectedStoreId,
        contents: outputData.blocks,
        intro: intro,
        cover_img: coverImg,
        date: date,
        interviewee: interviewee
      };

      if (!outputData) {
        console.error('저장된 데이터가 없습니다');
        return;
      }

      console.log('=== Editor.js 저장 데이터 ===');
      console.log('전체 데이터:', outputData);
      console.log('시간:', new Date(outputData.time).toLocaleString());
      console.log('버전:', outputData.version);
      console.log('블록 개수:', outputData.blocks ? outputData.blocks.length : 0);

      if (outputData.blocks && outputData.blocks.length > 0) {
        outputData.blocks.forEach((block, index) => {
          console.log(`블록 ${index + 1}:`, {
            타입: block.type,
            데이터: block.data,
          });
        });
      } else {
        console.warn('블록 데이터가 비어있습니다');
      }

      setIsSaving(true);
      await updateInterview(interviewId, updateData);
      alert('수정 완료');
      router.push('/admin/interview');
    } catch (error) {
      console.error('수정 중 오류 발생:', error);
      alert('수정 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AdminInterviewEditPage>
        <Header>
          <h1>인터뷰 수정</h1>
          <BackBtn onClick={handleBack}>목록으로</BackBtn>
        </Header>
        <LoadingMessage>인터뷰 데이터를 불러오는 중...</LoadingMessage>
      </AdminInterviewEditPage>
    );
  }

  if (error) {
    return (
      <AdminInterviewEditPage>
        <Header>
          <h1>인터뷰 수정</h1>
          <BackBtn onClick={handleBack}>목록으로</BackBtn>
        </Header>
        <ErrorMessage>오류가 발생했습니다: {error}</ErrorMessage>
      </AdminInterviewEditPage>
    );
  }

  return (
    <AdminInterviewEditPage>
      <Header>
        <h1>인터뷰 수정</h1>
        <Actions>
          <BackBtn onClick={handleBack}>목록으로</BackBtn>
          <SaveBtn onClick={handleEditorSave} disabled={isSaving}>
            {isSaving ? '저장 중...' : '저장'}
          </SaveBtn>
        </Actions>
      </Header>

      <FormSection>
        <h2>{interviewData?.stores?.name}</h2>

        <FormGrid>
          <div>
            <FormField>
              <ImageUploadSection>
                <label htmlFor="cover-img">커버 이미지</label>
                <input
                  id="cover-img"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  className="upload-button"
                  onClick={() => document.getElementById('cover-img').click()}
                  disabled={isUploading}
                >
                  {isUploading ? '업로드 중...' : '이미지 선택'}
                </button>
                {coverImgPreview && (
                  <div className="image-preview">
                    <img src={coverImgPreview} alt="커버 이미지 미리보기" />
                  </div>
                )}
              </ImageUploadSection>
            </FormField>

            <FormField>
              <label htmlFor="intro">인터뷰 소개</label>
              <textarea
                id="intro"
                value={intro}
                onChange={(e) => setIntro(e.target.value)}
                placeholder="인터뷰에 대한 간단한 소개를 입력하세요"
              />
            </FormField>

            <FormField>
              <label htmlFor="interviewee">인터뷰이</label>
              <input
                id="interviewee"
                type="text"
                value={interviewee}
                onChange={(e) => setInterviewee(e.target.value)}
                placeholder="인터뷰이 이름을 입력하세요"
              />
            </FormField>

            <FormField>
              <label htmlFor="date">인터뷰 날짜</label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </FormField>
          </div>

          <FormField>
            <EditorSection>
              <h3>인터뷰 내용</h3>
              <Editor
                ref={editorRef}
                onChange={handleEditorChange}
                data={interviewData?.contents ? { blocks: interviewData.contents } : {}}
              />
            </EditorSection>
          </FormField>
        </FormGrid>
      </FormSection>
    </AdminInterviewEditPage>
  );
};

export default InterviewEditPage;
