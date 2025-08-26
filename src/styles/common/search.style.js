'use client';

import styled from '@emotion/styled';
import theme from '@/styles/Theme';

export const SearchWrapper = styled.div`
  width: 100%;
  padding-right: 20px;

  ${theme.media.mobile} {
    position: fixed;
    top: 10px;
    right: 5px;
    width: 70dvw;
    padding-right: 0;
  }
`;

export const SearchBox = styled.div`
  display: flex;
  margin-left: auto;
  padding: 1px 27px 0 27px;
  box-shadow: 0 4px 4px 0 rgba(0,0,0,0.25);
  align-items: center;
  width: 360px;
  border-radius: 28px;
  background-color: #322F18;
  &:focus-within, &:hover {
    outline: 2px solid #FFF8B8;
  }

  ${theme.media.mobile} {
    width: 100%;

    &:focus-within, &:hover {
      outline: 1px solid #FFF8B8;
    }
  }
`;

export const SearchIcon = styled.div`
  display: flex;
  margin-right: -4px;
  padding-bottom: 3px;
  align-items: center;
  justify-content: flex-end;
  cursor: pointer;
`;

export const TextBox = styled.input`
  width: 100%;
  margin: 12px 0;
  border: none;
  outline: none;
  background-color: #363315;
  font-size: 1.2rem; 
  font-family: var(--font-gothic);
  font-weight: 800;
  color: #FFF8B8;
  transform: scaleX(0.8);
  transform-origin: left center; 
  &::placeholder {
    color: #FFF8B8;
    opacity: 80%;
  }
`;