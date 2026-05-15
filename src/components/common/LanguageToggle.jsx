'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import theme from '@/styles/Theme';

const ToggleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  top: 270px;
  left: -6px;
  gap: 4px;
  padding: 6px 5px;
  background: rgba(201, 201, 201, 0.63);
  border: 1px solid rgba(109, 109, 109, 0.1);
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(35, 35, 35, 0.4);
  backdrop-filter: saturate(180%) blur(8px);
  transition: all 0.3s ease;
  cursor: pointer;
  user-select: none;
  z-index: 3;
  width: 80px;
  // min-width: 110px;

  ${theme.media.mobile} {
    display: ${props => props.isOpen ? 'flex' : 'none'};
    top: 320px;
    left: 2px;
  }
`;

const LanguageButton = styled.button`
  padding: 5px 6px 4px;
  width: 100%;
  border: ${({ isActive, theme }) =>
    isActive
      ? '1px solid #ccc'
      : 'transparent'
  };
  background: ${({ isActive, theme }) =>
    isActive
      ? 'rgba(240, 240, 240, 0.9)'
      : 'transparent'
  };
  color: ${({ isActive, theme }) =>
    isActive
      ? '#333'
      : '#555'
  };
  border-radius: 8px;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 28px;
  font-family: var(--font-gothic);

  &:hover {
    background: ${({ isActive, theme }) =>
    isActive
      ? 'rgba(240, 240, 240, 0.9)'
      : 'rgba(220, 220, 220, 0.6)'
  };
  }

  &:focus {
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.3);
  }
`;

const ToggleSwitch = styled.div`
  position: relative;
  width: 44px;
  height: 24px;
  background: ${({ isActive, theme }) =>
    isActive
      ? '#007bff'
      : '#ddd'
  };
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ isActive, theme }) =>
    isActive
      ? '#0056b3'
      : '#e9e9e9'
  };
  }
`;

const ToggleThumb = styled.div`
  position: absolute;
  top: 2px;
  left: ${({ isActive }) => isActive ? '22px' : '2px'};
  width: 20px;
  height: 20px;
  background: #fff;
  border-radius: 50%;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const LanguageText = styled.span`
  font-size: 12px;
  font-weight: 500;
      color: #333;
  transition: color 0.3s ease;
`;

/**
 * 언어 전환 토글 컴포넌트
 * @param {Object} props
 * @param {string} props.variant - 'buttons' | 'switch' | 'compact' (기본값: 'buttons')
 * @param {string} props.position - 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'inline' (기본값: 'inline')
 * @param {boolean} props.showLabels - 언어 라벨 표시 여부 (기본값: true)
 * @param {Function} props.onLanguageChange - 언어 변경 시 호출되는 콜백 함수
 */
export default function LanguageToggle({
  isOpen,
  variant = 'buttons',
  position = 'inline',
  showLabels = true,
  onLanguageChange
}) {
  const { language, toggleLanguage, isKorean, isEnglish, isLoading } = useLanguage();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleToggle = () => {
    toggleLanguage();
    if (onLanguageChange) {
      onLanguageChange(language === 'ko' ? 'en' : 'ko');
    }
  };

  // 서버사이드 렌더링 시 로딩 상태 처리
  if (!isClient || isLoading) {
    return (
      <ToggleContainer isOpen={isOpen}>
        <LanguageButton disabled>
          <LanguageText>KO</LanguageText>
        </LanguageButton>
        <LanguageButton disabled>
          <LanguageText>EN</LanguageText>
        </LanguageButton>
      </ToggleContainer>
    );
  }

  if (variant === 'switch') {
    return (
      <ToggleSwitch isActive={isEnglish} onClick={handleToggle}>
        <ToggleThumb isActive={isEnglish} />
      </ToggleSwitch>
    );
  }

  if (variant === 'compact') {
    return (
      <LanguageButton
        isActive={false}
        onClick={handleToggle}
        style={{
          minWidth: 'auto',
          padding: '4px 8px',
          fontSize: '11px'
        }}
      >
        {isKorean ? 'KO' : 'EN'}
      </LanguageButton>
    );
  }

  // 기본 buttons variant
  return (
    <ToggleContainer onClick={handleToggle} isOpen={isOpen}>
      <LanguageButton isActive={isKorean}>
        {showLabels ? '한국어' : 'KO'}
      </LanguageButton>
      <LanguageButton isActive={isEnglish}>
        {showLabels ? 'English' : 'EN'}
      </LanguageButton>
    </ToggleContainer>
  );
}
