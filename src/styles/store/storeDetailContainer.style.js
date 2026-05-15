'use client';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import theme from '@/styles/Theme';

export const DetailWrapper = styled(motion.main, {
  shouldForwardProp: (prop) => prop !== 'isMobile'
})`
  width: calc(80vw - 60px);
  height: 100dvh;
  padding: 0px 0px 0px 50px;
  background-color: #F7F7F7;
  position: fixed;
  right: ${(props) => props.isMobile ? 'unset' : '0px'};
  bottom: ${(props) => props.isMobile ? '0px' : 'unset'};
  top: ${(props) => props.isMobile ? 'unset' : '0px'};
  left: ${(props) => props.isMobile ? '0px' : 'unset'};
  z-index: 7;
  box-shadow: -2px 0 4px 0 rgba(79,75,31,0.57);
  display: flex;
  overflow: hidden;

  ${theme.media.mobile} {
    width: 100%;
    height: calc(87dvh - 47px);
    padding: 0px;
    overflow-y: scroll;
    flex-direction: column;
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
    margin-left: 10px;
    left: 10px;
    font-size: 1rem;
    z-index: 10;
    position: sticky;
  }
`

export const InterviewButton = styled.button`
  // margin-top: 6px;
  padding: 8px 0px;
  background-color: transparent; 
  color: #888;
  border: none;
  border-radius: 4px;
  font-family: var(--font-gothic);
  font-size: 0.9rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s ease;
  // margin-left: auto;
  position: absolute;
  letter-spacing: 0.1rem;
  top: 110px;
  left: 38px;
  transform: rotate(90deg);
  transform-origin: top left;
  text-decoration: 0.8px underline wavy;
  text-underline-offset: 5px;
  color: black;


  ${theme.media.mobile} {
    font-size: 1rem;
    padding: unset;
    position: sticky;
    z-index: 10;
    transform: unset;
    top: 10px;
    left: unset;
    color: #555;
    right: 8px;
    margin-left: auto;
  }
`

export const StoreDetailCard = styled.article`
  font-family: var(--font-gothic);
  letter-spacing: 0.2rem;
  color: black;
  display: flex;
  flex-grow: 1;
  gap: 7%;
  padding-top: 10px;

  ${theme.media.tablet} {
    gap: 0px;
    padding-top: 15px;
    overflow-y: scroll;
    display: block;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

export const StoreDetailSection = styled.section`
  width: 45%;
  text-align: center;
  overflow-y: auto;
  padding-top: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-left: 50px;
    &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  min-width: 450px;

  ${theme.media.tablet} {
    width: 100%;
    padding-top: 20px;
    overflow-y: unset;
    position: static;
    display: block;
    padding-left: 0px;
    min-width: unset;
  }
`

export const StoreImgSection = styled(StoreDetailSection)`
  margin-bottom: -20px;
  overflow-x: hidden;
  width: 48%;
  // margin-top: 0px;
  padding-left:0px;
  min-width: unset;

  ${theme.media.tablet} {
    width: 100%;
    margin-top: 20px;
    margin-right: 0px;
    margin-bottom: 0px;
    overflow-y: unset;
  }
`

export const StoreName = styled.h2`
  font-size: 5.4rem;
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
  width: 100%;
  // margin: 0 auto;
  padding-bottom: 8px;
  // width: fit-content;
  margin-bottom: 8px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-right: 10px;

  &:hover{
      text-shadow: 0px 2px 3px rgba(221, 221, 221, 0.8), -0.1px -0.1px 5px rgba(100,92,92,0.6), 2px 2px 10px rgba(255,255,255,0.5);
  }

  ${theme.media.tablet} {
    font-size: 3.1rem;
    font-weight: 800;
    margin-bottom: 10px;
  }
`;

export const StoreNameTxt = styled.span`
  flex-wrap: wrap;
  // word-break: break-all;
  width: fit-content;
  display: inline;
  // width: 300px;
  // flex-grow: 1;

  ${theme.media.tablet} {
    // display: inline;
  }
`

export const BookmarkButton = styled.button`
  // position: absolute;
  top: 0px;
  right: 0px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px 7px;
  border-radius: 50%;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  // margin-right: -40px;
  min-width: 30px;
  flex-shrink: 0;
  margin-top: -18px;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    transform: scale(1.1);
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  ${theme.media.tablet} {
    padding: 2px 2px;
    // position: absolute;
    margin-right: -38px;
    // margin-left: -6px;
  }
`;

export const BookmarkIcon = styled.span`
  font-size: 2.3rem;
  color: ${props => props.isBookmarked ? '#ff6b6b' : '#ccc'};
  transition: all 0.2s ease;
  text-shadow: 1px 1px 1px rgba(87, 13, 13, 0.68);
  
  &:hover {
    color: ${props => props.isBookmarked ? '#ff5252' : '#999'};
  }

  ${theme.media.tablet} {
    font-size: 2rem;
  }
`;

export const StoreAdress = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 2px;
  font-weight: 400;
  cursor: pointer;
  line-height: 1.4;
  word-break: keep-all;
  margin-left: auto;
  text-align: right;
  
  a {
    color: inherit;
    text-decoration: none;
  }

  ${theme.media.tablet} {
    font-size: 1rem;
    margin-bottom: 2px;
    text-align: center;
    margin-left: unset;
  }
`



export const StoreTagList = styled.div`
  font-size: 1.24rem;
  font-weight: 700;
  width: 100%;
  text-align: left;
  line-height: 1.5;
  margin: 40px 0px 10px 0px;
  padding-left: 0px;
  padding-right: 20px;

  ${theme.media.tablet} {
    font-size: 1.1rem;
    width: 90%;
    margin: 30px auto 15px;
    text-align: center;
    padding-right: 0px;
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
  font-size: 1.24rem;
  margin-right: auto;

  ${theme.media.tablet} {
    font-size: 1rem;
    margin-top: 30px;
  }
`

export const StoreIndustry = styled.div`
  font-weight: 700;
  margin-top: 30px;
  font-size: 1.24rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  // margin-right: auto;
  gap: 5px;

  ${theme.media.tablet} {
    font-size: 1rem;
    margin-top: 20px;
  }
`

export const StoreContactList = styled.div`
  display: inline-grid;
  grid-template-columns: max-content 1fr;
  gap: 12px 2px;
  width: fit-content;
  margin-top: 80px;
  // margin-right: auto;
  width: 100%;
  padding-left: 3px;
  align-items: center;
  letter-spacing: 0.1rem;

  ${theme.media.tablet} {
    margin: 60px auto 0;
    gap: 10px 0px;
    position: static;
    padding-left: 0px;
    width: unset;
  }
`
export const StoreContact = styled.div`
  display: contents;
  font-size: 1.1rem;

  ${theme.media.tablet} {
    font-size: 1.2rem;
  }
`

export const StoreContactTxt = styled.div`
  font-weight: 700;
  white-space: nowrap;
  text-align: right;
  padding-right: 5px;
  // margin-left: 20px;
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

  ${theme.media.tablet} {
    font-size: 1.2rem;
    white-space: normal;
    word-break: break-all;
  }
`
export const StoreDescription = styled.div`
  margin-top: 50px;
`

export const StoreCardImg = styled.img`
  width: 80%;
  transform: rotate(-2deg);
  // margin-top: -30px;
  transition: .3s all;
  &:hover{
    transform: rotate(2deg);
  }

  ${theme.media.tablet} {
    margin-top: 0px;
    height: 100%;
  }
`
export const StoreImgList = styled.div`
  width: 100%;
  // margin-top: -40px;
  margin-top: 15px;
  padding: 0 30px 10px 40px;
  margin-bottom: 40px;

  ${theme.media.tablet} {
    padding: 0;
    // margin-top: -36px;
    width: unset;
  }
`
export const StoreImg = styled.img`
  width: 100%;
  // border-radius: 50%;
  border: 1px dotted black;
  vertical-align: top;
  position: relative;
  transition: all .4s ;
  margin-bottom: 15px;

  &:hover{
    z-index: 2;
    transform: scale(1.05);
  }

  ${theme.media.tablet} {
      width: 95%;
      height: 100%;
      box-shadow: none;
      margin-bottom: 10px;

      &:hover{
        transform: unset;
        box-shadow: none;
        z-index:0;
      }
  }
`