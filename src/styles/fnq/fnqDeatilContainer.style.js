'use client';
import styled from '@emotion/styled';
import { motion } from 'motion/react';
import theme from '@/styles/Theme';

export const DetailWrapper = styled(motion.main, {
  shouldForwardProp: (prop) => prop !== 'isMobile'
})`
  width: ${(props) => props.isMobile ? '100dvw' : 'calc(80vw - 50px)'};
  height: ${(props) => props.isMobile ? 'calc(87dvh - 37px)' : '100dvh'};
  padding: ${(props) => props.isMobile ? '0px 9px' : '0px 0px 0px 60px'};
  background-color:rgb(255, 255, 255);
  position: fixed;
  right: ${(props) => props.isMobile ? 'unset' : '0px'};
  bottom: ${(props) => props.isMobile ? '0px' : 'unset'};
  top: ${(props) => props.isMobile ? 'unset' : '0px'};
  z-index: 7;
  box-shadow: -2px 0 4px 0 rgba(84,84,84,0.57);
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`
export const DetailPageName = styled.h1`
  font-family: var(--font-gothic);
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.3rem;
  position: sticky;
  transform: rotate(90deg);
  transform-origin: top left;
  top: 17px;
  margin-left: -30px;
  z-index: 3;
  pointer-events: none;
  
  ${theme.media.mobile} { 
    transform: rotate(0deg);
    transform-origin: top left;
    top: 13px;
    margin-left: 1px;
    font-size: 1rem;
  }
`

export const DetailContextWrapper = styled.div`
  overflow-y: auto;
  padding-right: 20px;
  margin-top: -50px;
  padding-top: 20px;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;

  ${theme.media.mobile} { 
  padding-top: 40px;
  padding-right: 5px;
  }
`

export const Header = styled.header`
  width: 100%;
  display: flex;
  gap: 10px;
  align-items: flex-start;
  // margin-top: -30px;

  ${theme.media.mobile} { 
    margin-top: 35px;
  }
`

export const HeaderTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex-grow: 1;
  margin-left: 5px;
  margin-top: 4px;
  word-break: keep-all;
`

export const Title = styled.h2`
  font-size: 3.6rem;
  font-weight: 700;
  margin-left: -3px;
  margin-right: 130px;

  ${theme.media.mobile} { 
    font-size: 2.4rem;
    margin-right: 0px;
  }
`

export const CreatedAt = styled.p`
  font-size: 1.4rem;
  font-weight: 400;
  font-family: var(--font-abeezee);
  color: #444;

  ${theme.media.mobile} { 
    font-size: 1.2rem;
  }
`

export const StatusWrapper = styled.div`
  font-size: 1rem;
  font-weight: 400;
  margin-left: 7px;
  margin-top: 40px;
  max-width: 650px;

  ${theme.media.mobile} { 
    max-width: unset;
    width: 100%;
    padding-right: 12px;
    margin-left:-2px;
    margin-top: 25px;
  }
`

export const InfoWrapper = styled.div`
  display: flex;
  gap: 10px;
  margin-left: 4px;
  margin-top: 30px;
  margin-bottom: 20px;

  ${theme.media.mobile} { 
    display: grid;
    grid-template-columns: max-content max-content;
    gap: 15px 25px;
    max-width: unset;
    align-items: center;
    margin-top: 17px;
    margin-left: 2px;
    margin-bottom: 16px;
  }
`

export const InfoTitle = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  font-family: var(--font-gothic);
  color: #333;

  ${theme.media.mobile} { 
    font-size: 1.1rem;
  }
`

export const InfoValue = styled.div`
  font-size: 1.2rem;
  font-weight: 400;
  font-family: var(--font-gothic);
  color: #444;
  margin-right: 30px;

  ${theme.media.mobile} { 
    font-size: 1.1rem;
    font-weight: 500;
    padding-bottom: 1px;
  }
`

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
    position: sticky;
  top: 10px;
right: 10px;
      margin-top: -10px;
  z-index: 5;
  gap: 10px;

  ${theme.media.mobile} { 
    margin-top: 0px;
    position: sticky;
    top: 4px;
    right: 0;
    margin-right: -6px;
    margin-top: -13px;
    gap: 22px;
  }
`

export const Button = styled.button`
  padding: 7px 10px;
  background-color: transparent;
  border: none;
  font-size: 1.8rem;
  font-weight: 900;
  font-family: var(--font-gothic);
  cursor: pointer;
  transition: all 0.2s ease;
  color: #444;


  &:hover {
    background-color: #DADADA;
  }

  ${theme.media.mobile} { 
    font-size: 1rem;
    padding: 5px 10px;
    font-weight: 800;
    z-index: 5;
  }
`

export const FileWrapper = styled.div`
  margin-left: 2px;
  align-items: flex-start;
  max-width: 900px;
  border: solid 1px #DADADA;
  padding: 18px 20px 15px 16px;
  border-radius: 10px;

  ${theme.media.mobile} { 
    margin-left: 4px;
    padding: 14px 15px 14px 12px;
    margin-right: 7px;
  }
`

export const FileList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-start;

  ${theme.media.mobile} { 
    gap: 6px;
    align-items: flex-start;
  }
`

export const File = styled.a`
  font-size: 1.14rem;
  font-weight: 500;
  font-family: var(--font-gothic);
  color: #444;
  text-decoration: none;
  display: block;
  transition: color 0.2s ease;
  line-height: 1.4;
  word-break: break-all;
  
  &:hover {
    color:black;
    text-decoration: underline 1px;
    text-underline-offset: 4px;
  }

  ${theme.media.mobile} { 
    font-size: 1rem;
  }
`
