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
      if (!instanceRef.current) throw new Error('Editor 인스턴스가 없습니다');
      await instanceRef.current.isReady;
      return await instanceRef.current.save();
    },
    clear: async () => {
      if (instanceRef.current) {
        await instanceRef.current.isReady;
        instanceRef.current.clear();
      }
    },
    isReady: () => instanceRef.current !== null
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
        console.log('Editor 초기화 데이터:', data);
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
            marker: MarkerTool // 우리가 만든 MarkerTool 등록
          },
          inlineToolbar: ['link', 'marker', 'bold', 'italic'],
          data: data || {},
          onChange: (api, event) => {
            // onChange 이벤트 디바운싱
            if (onChangeTimeoutRef.current) {
              clearTimeout(onChangeTimeoutRef.current);
            }
            onChangeTimeoutRef.current = setTimeout(() => {
              if (typeof onChange === 'function') onChange(api, event);
            }, 300); // 300ms 디바운싱
          },
          onReady: () => {
            console.log('Editor.js 초기화 완료!');
          }
        });

        await instanceRef.current.isReady;
        console.log('Editor.js 준비 완료');
        isInitializedRef.current = true;

        // 초기 데이터가 있으면 설정
        if (data && data.blocks && data.blocks.length > 0) {
          try {
            await instanceRef.current.render(data);
          } catch (error) {
            console.warn('Editor 초기 데이터 설정 중 오류:', error);
          }
        }
      } catch (error) {
        console.error('Editor 초기화 오류:', error);
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
  }, []); // data 의존성 제거하여 불필요한 재초기화 방지

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
