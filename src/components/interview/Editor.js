"use client";

import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import ImageTool from '@editorjs/image';
import styled from '@emotion/styled';

import { useImageUpload } from '@/hooks/useImageUpload';
import MarkerTool from '@/utils/markerTool';

const EditorWrapper = styled.div`
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  background: white;
  margin-bottom: 20px;

  & h1 {
    font-size: 1.6rem !important;
  }
`;

const Editor = forwardRef(({ onChange, data }, ref) => {
  const editorRef = useRef(null);
  const instanceRef = useRef(null);
  const isInitializedRef = useRef(false);
  const onChangeTimeoutRef = useRef(null);

  const { uploadImage } = useImageUpload({
    bucket: 'gallery',
    maxSizeInMB: 0.5
  });

  useImperativeHandle(ref, () => ({
    save: async () => {
      if (!instanceRef.current) {
        throw new Error('Editor 인스턴스가 없습니다');
      }

      try {
        // Editor가 준비될 때까지 대기
        await instanceRef.current.isReady;

        // save 메서드 호출 (공식 문서에 따르면 Promise를 반환)
        const result = await instanceRef.current.save();

        // 공식 문서 형식에 맞는지 확인
        if (result && typeof result === 'object' && 'blocks' in result) {
          return result;
        } else {
          throw new Error('Editor save 결과가 올바른 형식이 아닙니다');
        }
      } catch (error) {
        console.error('Editor save 중 오류:', error);
        throw error;
      }
    },
    clear: async () => {
      if (instanceRef.current) {
        await instanceRef.current.isReady;
        if (typeof instanceRef.current.clear === 'function') {
          instanceRef.current.clear();
        }
      }
    },
    isReady: () => {
      return instanceRef.current !== null && isInitializedRef.current;
    }
  }));

  useEffect(() => {
    if (!editorRef.current) return;

    // 이미 인스턴스가 있다면 제거
    if (instanceRef.current) {
      try {
        if (typeof instanceRef.current.destroy === 'function') {
          instanceRef.current.destroy();
        }
      } catch (error) {
        console.warn('Editor destroy 중 오류:', error);
      }
      instanceRef.current = null;
      isInitializedRef.current = false;
    }

    const initializeEditor = async () => {
      try {
        console.log('Editor 초기화 시작, 데이터:', data);

        instanceRef.current = new EditorJS({
          holder: editorRef.current,
          autofocus: false,
          placeholder: '내용을 입력하세요...',
          tools: {
            header: {
              class: Header,
              config: {
                placeholder: '제목을 입력하세요',
                levels: [1, 2, 3, 4, 5, 6],
                defaultLevel: 3
              }
            },
            image: {
              class: ImageTool,
              config: {
                captionPlaceholder: '이미지 설명을 입력하세요',
                buttonContent: '이미지 선택',
                uploader: {
                  uploadByFile: async (file) => {
                    try {
                      const result = await uploadImage(file);
                      return result;
                    } catch (error) {
                      return { success: 0, error: error.message };
                    }
                  }
                }
              }
            },
            marker: MarkerTool
          },
          inlineToolbar: ['link', 'marker', 'bold', 'italic'],
          // data는 이전에 저장된 데이터가 있을 때만 전달
          data: data || { blocks: [] },
          onChange: (api, event) => {
            console.log('Editor 내용 변경됨:', event);
            // onChange 이벤트 디바운싱
            if (onChangeTimeoutRef.current) {
              clearTimeout(onChangeTimeoutRef.current);
            }
            onChangeTimeoutRef.current = setTimeout(() => {
              if (typeof onChange === 'function') onChange(api, event);
            }, 300); // 300ms 디바운싱
          },
          onReady: () => {
            isInitializedRef.current = true;
          }
        });

        // Editor가 준비될 때까지 대기 (공식 문서 방식)
        await instanceRef.current.isReady;

      } catch (error) {
        isInitializedRef.current = false;
      }
    };

    initializeEditor();

    return () => {
      // 디바운싱 타이머 정리
      if (onChangeTimeoutRef.current) {
        clearTimeout(onChangeTimeoutRef.current);
      }

      if (instanceRef.current) {
        try {
          if (typeof instanceRef.current.destroy === 'function') {
            instanceRef.current.destroy();
          }
        } catch (error) {
          console.warn('Editor cleanup 중 오류:', error);
        }
        instanceRef.current = null;
        isInitializedRef.current = false;
      }
    };
  }, [data]); // data 의존성 유지

  return (
    <EditorWrapper>
      <div
        id="editorjs"
        ref={editorRef}
        style={{
          minHeight: '300px',
          padding: '20px'
        }}
      />
    </EditorWrapper>
  );
});

Editor.displayName = 'Editor';
export default Editor;
