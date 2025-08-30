'use client';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import theme from '@/styles/Theme';

export const DetailWrapper = styled(motion.main)`
  width: calc(80vw - 60px);
  height: 100dvh;
  padding: 0px 10px 20px 50px;
  background-color: #F7F7F7;
  position: ${(props) => props.isMobile ? 'fixed' : 'absolute'};
  right: ${(props) => props.isMobile ? 'unset' : props.right};
  bottom: ${(props) => props.isMobile ? props.bottom : 'unset'};
  top: ${(props) => props.isMobile ? 'unset' : '0px'};
  left: ${(props) => props.isMobile ? '0px' : 'unset'};
  z-index: 10;
  box-shadow: -2px 0 4px 0 rgba(79,75,31,0.57);
  display: flex;
  overflow: hidden;

  ${theme.media.mobile} {
    width: 100dvw;
    height: calc(87dvh - 47px);
    padding: 0px;
  }
`;

export const DetailPageName = styled.h1`
  font-family: var(--font-gothic);
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.3rem;
  position: absolute;
  transform: rotate(90deg);
  transform-origin: top left;
  top: 17px;
  left: 29px;

  ${theme.media.mobile} { 
    transform: rotate(0deg);
    transform-origin: top left;
    top: 15px;
    left: 10px;
    font-size: 1rem;
  }
`

export const StoreDetailCard = styled.article`
  font-family: var(--font-gothic);
  letter-spacing: 0.2rem;
  color: black;
  display: flex;
  flex-grow: 1;
  gap: 2%;

  ${theme.media.mobile} {
    flex-direction: column;
    gap: 0px;
    padding-top: 34px;
  }
`;

export const StoreDetailSection = styled.section`
  // box-shadow: inset 0 0 10px 10px pink;
  width: 46%;
  text-align: center;
  overflow-y: auto;
  padding-top: 20px;

  ${theme.media.mobile} {
    width: 100%;
    padding-top: 10px;
  }
`

export const StoreImgSection = styled(StoreDetailSection)`
  margin-bottom: -20px;
  overflow-x: hidden;
  width: 52%;
  margin-top: -20px;
  margin-right: 30px;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;

  ${theme.media.mobile} {
    position: absolute;
    bottom: 0px;
    display: flex;
    width: 100%;
    margin-top: 0px;
    margin-right: 0px;
    margin-bottom: 0px;
    overflow-x: scroll;
  }
`

export const StoreName = styled.h2`
  font-size: 5rem;
  letter-spacing: 0.3rem;
  font-weight: 700;
  margin-bottom: 10px;
  color: #A0A0A0;
  background-color:rgb(146, 146, 146);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  text-shadow: 3px 4px 5px rgba(245, 245, 245, 0.3), -0.1px -0.1px 6px rgba(100,92,92,0.2), 2px 2px 2px rgba(255,255,255,0.5);
  transition: text-shadow .4s ;
  padding-top: 3px;
  margin-top:-2px;
  position: relative;
  width: fit-content;
  margin: 0 auto;

  &:hover{
      text-shadow: 0px 2px 3px rgba(221, 221, 221, 0.8), -0.1px -0.1px 5px rgba(100,92,92,0.6), 2px 2px 10px rgba(255,255,255,0.5);
  }

  ${theme.media.mobile} {
    font-size: 2.5em;
    margin-bottom: 10px;
  }
`;

export const BookmarkButton = styled.button`
  position: absolute;
  top: -18px;
  right: -40px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px 12px;
  border-radius: 50%;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    transform: scale(1.1);
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  ${theme.media.mobile} {
    right: -33px;
  }
`;

export const BookmarkIcon = styled.span`
  font-size: 20px;
  color: ${props => props.isBookmarked ? '#ff6b6b' : '#ccc'};
  transition: all 0.2s ease;
  text-shadow: 1px 1px 1px rgba(87, 13, 13, 0.68);
  
  &:hover {
    color: ${props => props.isBookmarked ? '#ff5252' : '#999'};
  }
`;

export const StoreAdress = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 50px;
  font-weight: 400;
  cursor: pointer;
  
  a {
    color: inherit;
    text-decoration: none;
    
    &:hover {
      font-weight: 600;
    }
  }

  ${theme.media.mobile} {
    font-size: 1rem;
    margin-bottom: 30px;
  }
`
export const StoreTagList = styled.div`
  font-size: 1.24rem;
  font-weight: 700;
  width: 60%;
  line-height: 1.5;
  margin: 0 auto 10px;

  ${theme.media.mobile} {
    font-size: 1rem;
    width: 90%;
    margin: 0 auto 15px;
  }
`

export const StoreTag = styled.span`
  word-break: keep-all;
  overflow-wrap: break-word;
  white-space: normal;
  display: inline;
  background: linear-gradient(
    to bottom,
    transparent 10%,
    var(--yellow) 60%,
    var(--yellow) 90%,
    transparent 100%
  );
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
`
export const StoreCapacity = styled.div`
  font-weight: 700;
  margin-top: 25px;
`

export const StoreContactList = styled.div`
  display: inline-grid;
  grid-template-columns: max-content 1fr;
  gap: 8px 2px;
  width: fit-content;
  margin: 56px auto 0;
  align-items: center;
  letter-spacing: 0.1rem;

  ${theme.media.mobile} {
    margin: 30px auto 0;
    gap: 6px 2px;
  }
`
export const StoreContact = styled.div`
  display: contents;
  font-size: 1.1rem;
`

export const StoreContactTxt = styled.div`
  font-weight: 700;
  white-space: nowrap;
  text-align: right;
  padding-right: 5px;
  margin-left: 20px;
`

export const StoreContactContent = styled.div`
  font-family: var(--font-abeezee);
  text-align: left;
  font-size: 1.17rem;
  margin-bottom: 1px;
  white-space: nowrap;
  letter-spacing: 0.06rem;
  
  a {
    color: inherit;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
      cursor: pointer;
    }
  }

  ${theme.media.mobile} {
    font-size: 1rem;
    white-space: normal;
    word-break: break-all;
  }
`
export const StoreDescription = styled.div`
`

export const StoreCardImg = styled.img`
  width: 100%;
  transform: rotate(-5deg);
  margin-top: -20px;
  transition: .3s all;
  &:hover{
    transform: rotate(5deg);
  }
`
export const StoreImgList = styled.div`
  width: 100%;
  margin-top: -56px;
  padding: 0 40px 10px 40px;
  margin-bottom: 40px;

  ${theme.media.mobile} {
    padding: 0;
    overflow-x: scroll;
    margin: 0px;
    width: unset;
  }
`
export const StoreImg = styled.img`
  width: 100%;
  border-radius: 50%;
  border: 0.6px solid black;
  vertical-align: top;
  position: relative;
  box-shadow: -1px 1px 3px 6px rgba(255,255,255,1), -2px -1px 20px 0.3px rgba(116, 116, 116, 0.63), 3px 15px 30px 10px rgba(177, 177, 177, 0.36);
  margin-bottom: -10px;
  position: relative;
  transition: all .4s ;

  &:hover{
    z-index: 2;
    transform: scale(1.06);
    box-shadow: -1px 1px 3px 6px rgba(255,255,255,1), -2px -1px 30px 0.5px rgba(116, 116, 116, 0), 3px 15px 30px 0px rgba(177, 177, 177, 0.36);
  }

  ${theme.media.mobile} {
    // height: 100%;
    // width: auto;
    // margin-bottom: 0px;
  }
`

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-family: var(--font-gothic);
  font-size: 1.5rem;
`;

export const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.5rem;
`;

