"use client";

import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import ImageTool from '@editorjs/image';
import { useImageUpload } from '@/hooks/useImageUpload';

const Editor = forwardRef(({ onChange }, ref) => {
  const editorRef = useRef(null);
  const instanceRef = useRef(null);

  // 이미지 업로드 훅 사용
  const { uploadImage } = useImageUpload({
    bucket: 'gallery',
    maxSizeInMB: 1
  });

  // 부모 컴포넌트에서 호출할 수 있는 메서드들을 노출
  useImperativeHandle(ref, () => ({
    save: async () => {
      if (!instanceRef.current) {
        throw new Error('Editor 인스턴스가 없습니다');
      }

      await instanceRef.current.isReady;
      return await instanceRef.current.save();
    },
    clear: async () => {
      if (instanceRef.current) {
        await instanceRef.current.isReady;
        instanceRef.current.clear();
      }
    },
    isReady: () => {
      return instanceRef.current !== null;
    }
  }));

  useEffect(() => {
    if (!editorRef.current || instanceRef.current) return;

    // Editor.js 인스턴스 생성
    const initializeEditor = async () => {
      try {
        instanceRef.current = new EditorJS({
          holder: editorRef.current,
          autofocus: true,
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
                      console.log('이미지 업로드 시작:', file);
                      const result = await uploadImage(file);
                      console.log('이미지 업로드 결과:', result);
                      return result;
                    } catch (error) {
                      console.error('이미지 업로드 오류:', error);
                      return {
                        success: 0,
                        error: error.message
                      };
                    }
                  }
                }
              }
            }
          },
          data: {},
          onChange: (api, event) => {
            console.log('Editor 내용 변경됨:', event);
            // onChange prop이 있으면 호출
            if (onChange && typeof onChange === 'function') {
              onChange(api, event);
            }
          },
          onReady: () => {
            console.log('Editor.js 초기화 완료!');
          }
        });

        // Editor가 준비될 때까지 대기
        await instanceRef.current.isReady;
        console.log('Editor.js가 사용할 준비가 되었습니다.');
      } catch (error) {
        console.error('Editor 초기화 오류:', error);
      }
    };

    initializeEditor();

    // 언마운트 시 인스턴스 정리
    return () => {
      if (instanceRef.current && typeof instanceRef.current.destroy === 'function') {
        instanceRef.current.destroy();
        instanceRef.current = null;
      }
    };
  }, []);

  return (
    <div style={{
      border: '1px solid #e1e5e9',
      borderRadius: '8px',
      background: 'white',
      marginBottom: '20px'
    }}>
      <div
        id="editorjs"
        ref={editorRef}
        style={{
          minHeight: '300px',
          padding: '20px'
        }}
      />
    </div>
  );
});

Editor.displayName = 'Editor';

export default Editor;