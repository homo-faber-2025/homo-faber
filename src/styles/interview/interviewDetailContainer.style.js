'use client';
import styled from '@emotion/styled';
import { motion } from 'motion/react';
import theme from '@/styles/Theme';

export const DetailWrapper = styled(motion.main, {
  shouldForwardProp: (prop) => prop !== 'isMobile'
})`
  width: ${(props) => props.isMobile ? '100dvw' : 'calc(80vw - 50px)'};
  height: ${(props) => props.isMobile ? 'calc(87dvh - 42px)' : '100dvh'};
  padding: 0px 10dvw 0px 60px;
  background-color: #F7F7F7;
  position: fixed;
  right: ${(props) => props.isMobile ? 'unset' : '0px'};
  bottom: ${(props) => props.isMobile ? '0px' : 'unset'};
  top: ${(props) => props.isMobile ? 'unset' : '0px'};
  z-index: 6;
  box-shadow: -2px 0 4px 0 rgba(84,84,84,0.57);
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  

  ${theme.media.mobile} {
    padding: 0px !important;
    box-shadow: 0px 0 8px 2px rgba(109, 109, 109, 0.66);
  }
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
  margin-left: -29px;
  z-index: 10;
  
  ${theme.media.mobile} { 
    transform: rotate(0deg);
    transform-origin: top left;
    top: 14px;
    margin-left: 11px;
    font-size: 1rem;
  }
`

export const InterviewHeader = styled.div`
  display: flex;
  gap: 2dvw;
  margin-top: -14px;
  position: relative;
  min-height: 90dvh;
  justify-content: flex-end;

  ${theme.media.tablet} {
    flex-direction: column;
    gap: 0px;
    margin-top: 0px;
    align-items: center;
    min-height: unset;
    justify-content: unset;
  }
`

export const InterviewTitle = styled.div`
  font-family: var(--font-gothic);
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: -12px;
  text-align: left;
  position: absolute;
  top:28px;
  left: 0px;

  ${theme.media.tablet} {
    gap: 10px;
    position: static;
    top: unset;
    left: unset;
    text-align: center;
    margin-top: -140px;
    order:2;
  }
`
export const InterviewStore = styled.h2`
  font-weight: 800;
  font-size: 6.5dvw;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  background-color:rgb(101, 101, 101);
  text-shadow: 0px 0px 3px rgba(166, 166, 166, 0.43), -0.1px 1px 4px rgba(95, 87, 87, 0.5), 1px -1px 1px rgba(255, 255, 255, 0.78), 0px 0px 5px rgba(107, 107, 107, 0.79);
  position: relative;
  padding-top: 7px;
  transition: text-shadow .4s ;
  margin-right: -50px;


  ${theme.media.tablet} {
    font-size: 4.4rem;
    background-color:rgb(230, 230, 230);
    text-shadow: 0px 0px 3px rgba(212, 212, 212, 0.76), -0.1px 1px 1px rgba(130, 126, 126, 0.5), 1px -1px 1px rgba(221, 221, 221, 0.78), 0px 0px 5px rgba(107, 107, 107, 0.79);
    padding-top: 0px;
    margin-right: 0px;
  }
`
export const InterviewPerson = styled.h3`
  font-weight: 800;
  font-size: 3dvw;
  padding-top: 4px;
  background-color:rgb(82, 82, 82);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  text-shadow: 1px 0px 0px rgba(245, 245, 245, 0.26), -0.1px -0.1px 4px rgba(56, 50, 50, 0.3), 0px 0px 1px rgba(255, 255, 255, 0.61);
  -webkit-text-stroke: 0.1px rgba(198, 198, 198, 0.96);
  margin-left: 12px;

  ${theme.media.tablet} {
    font-size: 2.4rem;
    z-index: 10;
    margin-top: 0px;
    background-color:rgb(72, 72, 72);
    text-shadow: 1px 0px 0px rgba(245, 245, 245, 0.43), -0.1px -0.1px 4px rgba(56, 50, 50, 0.64), 0px 0px 1px rgba(255, 255, 255, 0.78);
    -webkit-text-stroke: 0.1px rgba(198, 198, 198, 0.82);
    margin-left: 0px;
  }
`
export const InterviewIntro = styled.span`
  font-weight: 600;
  font-size: 1.3rem;
  line-height: 1.7;
  word-break: keep-all;
  text-align: left;
  position: absolute;
  left: 0px;
  bottom: -60px;
  color:rgb(73, 73, 73);
  width: 47%;
  min-width: 350px;
  margin-left: 20px;
  text-decoration: underline 2rem  #F7F7F7;
  text-underline-offset: -1.5rem;
  font-family: var(--font-gothic);
  z-index: 2;
  display: inline;
  text-decoration-skip-ink: none;

  ${theme.media.tablet} {
    position: static;
    font-size: 1.1rem;
    width: 100%;
    padding: 0 20px;
    mix-blend-mode: normal;
    bottom: 0px;
    margin-top: 80px;
    margin-left: 0px;
    color:rgb(34, 34, 34);
    order: 3;
    text-align: center;
    text-decoration: unset;
  }
`

export const InterviewCoverImg = styled.img`
  // max-height: 100dvh;
  max-width: 80dvw;
  height: 100dvh;
  margin-right: -10dvw;
  margin-left: -40px;
  // text-align: right;
  object-fit: cover;
  object-position: center;
  border-radius: 0% 0 0% 43%;

  ${theme.media.tablet} {
    max-height: 70dvh;
    width: 130dvw;
    min-height: 40dvh;
    object-position: center;
    margin-right: 0px;
    margin-left: 0px;
    border-radius: 0 0 50% 50%;
    position: static;
    margin-top: -26px;
    max-width: unset;
    z-index: -1;
  }
`

export const InterviewInfo = styled.div`
  font-weight: 500;
  font-size: 1.1rem;
  margin-bottom: 8px;
  margin-left: auto;

  & :first-of-type{
    margin-top: 200px;
  }

  ${theme.media.tablet} {
    font-size: 1rem;
    margin-right: 20px;
  }
`

export const InterviewLink = styled.div`
    display: flex;
    flex-direction: column;
    padding-top: 500px;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-size: 1.5rem;
    line-height: 1.4;
    font-weight: 600;
    color: rgb(94, 94, 94);
    position: relative;
    width: calc(80vw - 50px);
    margin-left: -60px;
    margin-top: -800px;
    height: 600px;
    flex-shrink: 0;
    z-index: 1;
    background: linear-gradient(to top, 
      rgba(247, 247, 247, 1) 0%, 
      rgba(247, 247, 247, 0.9) 20%, 
      rgba(247, 247, 247, 0.8) 50%, 
      rgba(247, 247, 247, 0.3) 80%, 
      rgba(247, 247, 247, 0.1) 90%, 
      rgba(247, 247, 247, 0) 100%
    );

    a {
      color: rgb(47, 0, 255);
      text-decoration: underline wavy 1px;
      text-underline-offset: 8px;
      cursor: pointer;
      margin-top: 40px;
      font-weight: 900;
      letter-spacing: 0.1rem;
    }

    ${theme.media.tablet} {
      margin-top: -700px;

      
    }

    ${theme.media.mobile} {
      width: 100dvw;
      margin-left: 0px;
      margin-top: -700px;
      padding-top: 500px;
      font-size: 1.3rem;
    }
`