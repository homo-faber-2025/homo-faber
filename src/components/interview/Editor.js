"use client";

import { useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
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

const Editor = forwardRef(({ data }, ref) => {
  const editorInstanceRef = useRef(null);

  const { uploadImage } = useImageUpload({
    bucket: 'gallery',
    maxSizeInMB: 0.5
  });

  useImperativeHandle(ref, () => ({
    save: async () => {
      if (editorInstanceRef.current) {
        return await editorInstanceRef.current.save();
      }
      throw new Error('Editor is not ready');
    },
    isReady: () => {
      return editorInstanceRef.current !== null;
    }
  }));

  useEffect(() => {
    let editor = null;

    const initEditor = async () => {
      try {
        editor = new EditorJS({
          holder: 'editorjs',
          placeholder: '내용을 입력하세요...',
          tools: {
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
          data: data || { blocks: [] },
        });

        await editor.isReady;
        editorInstanceRef.current = editor;
      } catch (error) {
        console.error('Editor initialization failed:', error);
      }
    };

    initEditor();

    return () => {
      if (editorInstanceRef.current && typeof editorInstanceRef.current.destroy === 'function') {
        try {
          editorInstanceRef.current.destroy();
        } catch (error) {
          console.warn('Editor destroy failed:', error);
        }
        editorInstanceRef.current = null;
      }
    };
  }, [data]);

  return (
    <EditorWrapper>
      <div
        id="editorjs"
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
