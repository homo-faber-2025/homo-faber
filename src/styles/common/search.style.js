'use client';

import styled from '@emotion/styled';
import { motion } from 'motion/react';
import theme from '@/styles/Theme';

export const SearchWrapper = styled(motion.div, {
  shouldForwardProp: (prop) => prop !== 'isMobile',
})`
  width: 100%;
  padding-right: 20px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  z-index: 2;

  ${theme.media.mobile} {
    position: fixed;
    top: 14px;
    right: 5px;
    width: 70dvw;
    padding-right: 0;
    z-index: 6; /* AnimatedPanel(z-index: 6)보다 높게 설정 */
  }
`;

export const SearchBox = styled.div`
  display: flex;
  margin-left: auto;
  padding: 1px 27px 0 27px;
  box-shadow: 1px 4px 4px 0 rgba(0,0,0,0.25);
  align-items: center;
  width: 360px;
  border-radius: 28px;
  background-color: ${props => props.backgroundColor || '#322F18'};
  
  &:focus-within, &:hover {
    outline: 2px solid ${props => props.focusOutlineColor || '#FFF8B8'};
  }

  ${theme.media.mobile} {
    width: 100%;
    margin: 0 auto;
    border-radius: 28px 10px 10px 28px;

    &:focus-within, &:hover {
      outline: 1px solid ${props => props.focusOutlineColor || '#FFF8B8'};
    }
  }
`;

export const TextBox = styled.input`
  width: 100%;
  flex-grow: 1;
  margin: 12px 0;
  border: none;
  outline: none;
  margin-right: -60px;
  background-color: ${props => props.inputBackgroundColor || '#363315'};
  font-size: 1.2rem; 
  font-family: var(--font-gothic);
  font-weight: 800;
  color: ${props => props.textColor || '#FFF8B8'};
  transform: scaleX(0.8);
  transform-origin: left center; 
  &::placeholder {
    color: ${props => props.textColor || '#FFF8B8'};
    opacity: 80%;
  }

  ${theme.media.mobile} {
    margin-right: -40px;
  }
`;

export const ClearButton = styled.button`
  padding-bottom: 0px;
  border: none;
  border-radius: 50%;
  background: none;
  color: ${props => props.textColor || '#FFF8B8'};
  font-family: var(--font-gothic);
  font-weight: 800;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: -5px;
  margin-right: 15px;
`;

export const SearchIcon = styled.div`
  display: flex;
  margin-right: -4px;
  padding-bottom: 3px;
  align-items: center;
  justify-content: flex-end;
  cursor: pointer;
  padding-left: 5px;
  margin-left: auto;
`;
