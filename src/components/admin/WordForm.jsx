"use client";

import { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';

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

const RequiredField = styled.span`
  color: #dc3545;
  margin-left: 4px;
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 14px;
  margin-top: 5px;
`;

const WordForm = ({ mode = 'create', onSave, onBack, isSaving, onSaveClick, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    meaning: '',
    source: ''
  });
  const [errors, setErrors] = useState({});

  // 초기 데이터가 있으면 폼에 설정
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        meaning: initialData.meaning || '',
        source: initialData.source || ''
      });
    }
  }, [initialData]);

  // 저장 함수를 ref로 노출
  useEffect(() => {
    if (onSaveClick) {
      onSaveClick.current = handleSave;
    }
  }, [onSaveClick, formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // 에러 메시지 초기화
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = '단어명은 필수 입력 항목입니다.';
    }

    if (!formData.meaning.trim()) {
      newErrors.meaning = '의미는 필수 입력 항목입니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await onSave(formData);
    } catch (error) {
      console.error('저장 중 오류:', error);
    }
  };

  return (
    <FormSection>
      <h2>단어 정보</h2>

      <FormGrid>
        <FormField>
          <label>
            단어명<RequiredField>*</RequiredField>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="단어명을 입력하세요"
            disabled={isSaving}
          />
          {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
        </FormField>

        <FormField>
          <label>출처</label>
          <input
            type="text"
            name="source"
            value={formData.source}
            onChange={handleInputChange}
            placeholder="출처를 입력하세요 (선택사항)"
            disabled={isSaving}
          />
        </FormField>
      </FormGrid>

      <FormField>
        <label>
          의미<RequiredField>*</RequiredField>
        </label>
        <textarea
          name="meaning"
          value={formData.meaning}
          onChange={handleInputChange}
          placeholder="단어의 의미를 자세히 입력하세요"
          disabled={isSaving}
        />
        {errors.meaning && <ErrorMessage>{errors.meaning}</ErrorMessage>}
      </FormField>
    </FormSection>
  );
};

export default WordForm;
