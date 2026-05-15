import styled from '@emotion/styled';
import theme from '@/styles/Theme';
import { motion } from 'motion/react';

export const InfoWrapper = styled(motion.main, {
  shouldForwardProp: (prop) => prop !== 'gradientCss' && prop !== 'pathname',
})`
  width: 100%;
  height: 100dvh;
  padding-left: 70px;
  padding-top: 57px;
  z-index: 3;
  background:rgb(255, 255, 255);
  background: ${(props) => props.gradientCss};
  background-size: 200% 200%;
  background-position: -100% -100%;
  cursor: ${(props) => (props.pathname && (props.pathname === '/' || props.pathname.startsWith('/info/'))) ? 'pointer' : 'default'};
  display: flex;
  flex-direction: column;
  border-left: solid 3px #DADADA;
  box-shadow: -8px 4px 10px 0 rgba(0,0,0,0.25);
  font-family: var(--font-gothic);
  pointer-events: auto;
  position: relative;
  color: #333;
  overflow-y: hidden;

  ${theme.media.mobile} { 
    padding: 0px 15px 20px 15px;
    overflow-x: hidden;
    position: relative;
    border-top: solid 2px #DADADA;
    box-shadow: 0px -4px 10px 3px rgba(0,0,0,0.3);
    border-left: none;
    width: 100dvw;
    word-break: keep-all;
  }
`;


export const InfoPageName = styled.div`
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.3rem;
  position: absolute;
  transform: rotate(90deg);
  transform-origin: top left;
  top: 17px;
  left: 25px;

  ${theme.media.mobile} { 
    transform: rotate(0deg);
    transform-origin: top left;
    position: sticky;
    top: 10px;
    left: 10px;
    font-size: 1rem;
    margin-bottom: 40px;
    z-index: 3;
  }
`

export const InfoPageContent = styled.div`
  height: 100dvh; 
  overflow-y: scroll;
  padding-right: 70px;
  margin-top: -65px;
  padding-top: 65px;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;

  ${theme.media.mobile} {
    height: 100%;
    padding-bottom: 100px;
    padding-right: 0px;
    overflow-x: hidden;
  }
`


export const Infoh1 = styled.h1`
  font-size: 3.3rem;
  font-weight: 800;
  margin-bottom: 10px;
  line-height: 1.4;
  word-break: keep-all;

  ${theme.media.mobile} {
    font-size: 2.1rem;
    width: 100%;
  }
`


export const Infoh3 = styled.h3`
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 10px;
  line-height: 1.8;
  font-style: italic;
  width: 100%;
  max-width: 450px;
  margin-left: auto;
  margin-right: 20px;
  color: #888;
  text-indent: -170px;
  margin-bottom: 200px;
  word-break: keep-all;

  ${theme.media.tablet} {
    text-indent: 0px;
    font-size: 0.9rem;
    width: 90%;
    margin-left: 0;
    margin-bottom: 130px;
    text-align: left;
  }
`

export const Infoh2 = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 30px;
  line-height: 1.6;

  ${theme.media.mobile} {
    font-size: 1.3rem;
    width: 100%;
    margin: 0 auto;
    text-align: center;
    margin-bottom: 50px;
    font-weight: 800;
  }
`

export const InfoArticle = styled.article`
  max-width: 700px;
  margin-left: 100px;
  margin-top: 20px;
  margin-bottom: 260px;
  word-break: keep-all;
  margin-left: auto;

  ${theme.media.mobile} {
    margin-left: 0;
    margin-top: 0px;
    margin-bottom: 200px;
  }
`

export const InfoSubTitle = styled.h4`
  font-size: 1.2rem;
  font-weight: 800;
  margin-bottom: 30px;
  margin-top: 160px;
  margin-left: 100px;

  &:first-of-type {
    margin-top: 0px;
  }

  & + p {
    text-indent: 100px;

    ${theme.media.mobile} {
      text-indent: 80px;
    }
  }

  ${theme.media.mobile} {
    font-size: 1.15rem;
    margin-left: 0;
    font-weight: 700;
  }
`

export const InfoPara = styled.p`
  font-size: 1.23rem;
  font-weight: 400;
  line-height: 1.88;
  letter-spacing: 0.01rem;
  margin-bottom:40px;
  color: black;
  word-break: keep-all;

  ${theme.media.mobile} {
    font-size: 1.15rem;
    margin-left: 0;
    line-height: 1.85;
  }
`
export const InfoParaLink = styled.div`
  font-size: 1rem;
  font-weight: 700;
  margin-top: 120px;
  margin-bottom: 20px;
  text-align: right;
  color: black;
  line-height: 1.7;
  span {
    text-decoration: underline wavy 1px;
    text-underline-offset: 5px;
    cursor: pointer;
    font-weight: 900;
  }

  ${theme.media.mobile} {
    font-size: 1rem;
    margin-left: auto;
    margin-top: 80px;
    margin-bottom: 10px;
    text-align: left;
    text-indent: -10px;
    padding-left: 10px;
  }
`

/*-------------------------------- Timeline --------------------------------*/
export const InfoTimelineTable = styled.table`
  width: 100%;
  // max-width: 800px;
  border-collapse: collapse;
  border: none;
  margin-bottom: 250px;
`

export const InfoTimelineTableHead = styled.thead`
  display: none;
`
export const InfoTimelineTableBody = styled.tbody`
  width: calc(100% - 23dvw);  

  ${theme.media.tablet} {
    width: 100%;
  }
`

export const InfoTimelineTableTr = styled.tr`
  border-top: ${(props) => props.isFirstOfYear ? '1.2px solid #000' : 'none'};
  display: flex;
  position: relative;
  width: calc(100% - 23dvw);  

  &:hover {
    background-color: var(--yellow);

    &::after {
      display: ${(props) => props.isImg ? 'block' : 'none'};
      pointer-events: none;
      content: '';
      position: absolute;
      top: 0;
      right: -24vw;
      width: 24vw;
      height: 100%;
      background-color: var(--yellow);
    }

    .timeline-img {
      height: auto;
      z-index: 2;
    }
  }

  ${theme.media.tablet} {
    width: 100%;

    &:hover {
      &::after {
        display: none;
      }    
    }
}  
`

export const InfoTimelineTableTd = styled.td`
  padding: 12px;
  vertical-align: top;
  line-height: 1.5;
  font-size: 1.1rem;
  border-top: ${(props) => props.isFirstOfYear ? 'none' : '1px dotted rgb(167, 167, 167)'};

  ${theme.media.tablet} {
    padding: 6px 10px 10px 10px;
  }
`

export const InfoTimelineTableTdYear = styled(InfoTimelineTableTd)`
  min-width: 80px;
  text-align: center;
  border-bottom: none;
  flex-shrink: 0;
  font-size: 1.15rem;
  font-weight: 800;
  font-family: var(--font-abeezee);
  background-color: rgb(248, 248, 248);
  padding-right: 2px;

  ${theme.media.tablet} {
    min-width: 55px;
    padding-top: 8px;
  }
`

export const InfoTimelineTableTdMonth = styled(InfoTimelineTableTd)`
  width: 90px;
  flex-shrink: 0;
  text-align: right;
  font-weight: 500;
  font-family: var(--font-abeezee);
  font-size: 1.15rem;
  background-color: rgb(248, 248, 248);
  padding-right: 13px;
  padding-left: 5px;

  ${theme.media.tablet} {
    min-width: 65px;
    word-break: keep-all;
    width:65px;
    line-height: 1.8;
    text-align: center;
    padding-left: 10px;
    padding-right: 10px;
    flex-shrink: 0;
  }
`
export const InfoTimelineMobile = styled.td`
  display: flex; 
  flex-direction: column;
  gap: 5px;
  flex-grow: 1;
  flex-wrap: wrap;
  width: 10px;
  margin-left: 2px;
  padding: 0;
  border: none;
`

export const InfoTimelineTableTdTitle = styled.div`
  flex-grow: 1;
  font-weight: 500;
  line-height: 1.6;
  word-break: keep-all;
  padding-left: 18px;
  padding: 12px;
  padding-left: 18px;
  vertical-align: top;
  line-height: 1.5;
  font-size: 1.1rem;
  border-top: ${(props) => props.isFirstOfYear ? 'none' : '1px dotted rgb(167, 167, 167)'};

  ${theme.media.tablet} {
    padding-left: 10px;
    flex-grow: unset;
    flex-shrink: 1;
    flex-wrap: wrap;
    padding-top: 10px;
    font-size: 1.05rem;
  }
`


export const InfoTimelineInfo = styled.div`
  margin-top: 8px;
  margin-left: 10%;
  font-weight: 400;
  word-break: keep-all;

  ${theme.media.tablet} {
    margin-left: 0;
    font-size: 1rem;
  }
`

export const InfoTimelineTableTdImg = styled.div`
  width: 24dvw;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: -1px;
  right: -24dvw;
  transition: all .4s ;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    vertical-align: top;
    margin-top: 1px;
    border-top: 1px dotted rgb(167, 167, 167);
    padding-left: 7dvw;
  }

  &:hover {
    height: auto;
    z-index: 2;
  }

  ${theme.media.tablet} {
    width: 100%;
    display: block;
    position: static;
    right: unset;
    top: unset;
    height: auto;
    padding-left: 7px;
    padding-right: 20px;
    margin-bottom: 15px;

    img {
      margin-left: 5px;
      padding-left: 0px;
      border-top: none;
      height: auto;
    }

    &:hover {
      height: auto;
      right: 0;
    }
  }
`


/*-------------------------------- Credits --------------------------------*/
export const InfoCreditsTable = styled.table`
  width: 100%;
  max-width: 800px;
  border-collapse: collapse;
  margin: 0 auto;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 250px;

  ${theme.media.mobile} {
    margin-bottom: 100px;
  }
`

export const InfoCreditsTableTr = styled.tr`
`

export const InfoCreditsTableTh = styled.th`
  padding: 6px 10px;
  font-weight: 600;
  text-align: right;
  width: 50%;
  vertical-align: top;

  ${theme.media.mobile} {
    width: unset;
    min-width: 100px;
    flex-shrink: 0;
  }
`

export const InfoCreditsTableTd = styled.td`
  padding: 6px 10px;
  vertical-align: top;
  word-break: keep-all;
`