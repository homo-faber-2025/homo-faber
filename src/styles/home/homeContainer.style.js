import styled, { keyframes } from '@emotion/styled';
import theme from '@/styles/Theme';

export const HomeWrapper = styled.main`
  width: calc(100%);
  height: 100%;
  padding-left: 34px;
  position: relative;
  z-index: 2;
  background-color: var(--yellow);
  cursor: ${(props) => (props.pathname && (props.pathname == '/')) ? 'pointer' : 'default'};
  display: flex;
  flex-direction: column;
  box-shadow: -2px 4px 10px 0 rgba(0,0,0,0.25);
  overflow: hidden;
  transition: transform 0.3s ease;
  // margin-left: -20px;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 15px;
    height: 100%;
    background: linear-gradient(270deg, rgba(69, 67, 43, 1) 0%, rgba(239, 232, 168, 1) 12%, rgba(239, 232, 168, 1) 35%, rgba(69, 67, 43, 1) 41%, rgba(217, 212, 166, 1) 47%, rgba(217, 212, 166, 1) 73%, rgba(69, 67, 43, 1) 78%, rgba(192, 189, 158, 1) 86%, rgba(192, 189, 158, 1) 99%, rgba(69, 67, 43, 1) 100%);

    ${theme.media.mobile} {
      width: 100%;
      height: 10px;
      background: linear-gradient(360deg, rgba(69, 67, 43, 1) 0%, rgba(239, 232, 168, 1) 12%, rgba(239, 232, 168, 1) 35%, rgba(69, 67, 43, 1) 41%, rgba(217, 212, 166, 1) 47%, rgba(217, 212, 166, 1) 73%, rgba(69, 67, 43, 1) 78%, rgba(192, 189, 158, 1) 86%, rgb(137, 135, 112) 99%, rgba(69, 67, 43, 1) 100%);
    }
  }

  &:hover {
    transform: ${(props) => (props.pathname && (props.pathname == '/')) ? 'translateX(-40px)' : 'default'};
  }

  ${theme.media.mobile} {
    padding-left: 0;

    &:hover{
      transform: unset;
    }
  } 
`;

export const HomeDecoration = styled.div`
  position: absolute;
  left: 10px;
  top: 0;
  width: 15px;
  height: 100%;
  background: linear-gradient(270deg, rgba(69, 67, 43, 1) 0%, rgba(239, 232, 168, 1) 12%, rgba(239, 232, 168, 1) 35%, rgba(69, 67, 43, 1) 41%, rgba(217, 212, 166, 1) 47%, rgba(217, 212, 166, 1) 73%, rgba(69, 67, 43, 1) 78%, rgba(192, 189, 158, 1) 86%, rgb(215, 212, 178) 99%, rgb(166, 161, 106) 100%);

  ${theme.media.mobile} {
    display: none;
  }
`;

export const HomePageName = styled.h1`
  font-family: var(--font-gothic);
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.3rem;
  position: absolute;
  transform: rotate(90deg);
  transform-origin: top left;
  top: 12px;
  left: 50px;
  z-index:7;

  ${theme.media.mobile} { 
    transform: rotate(0deg);
    transform-origin: top left;
    top: 22px;
    left:10px;
    z-index:2;
    font-size: 1rem;
  }
`

export const HomeContentWrapper = styled.div`
  width: calc(100% + 10px);
  height: 100dvh;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  margin-left: -9px;
  &::-webkit-scrollbar {
    display: none;
  }

  ${theme.media.mobile} {
    margin-top: 11px;
    height: 100%;
    width: 100dvw;
    margin-left: 0px;
  }
`;

export const ContentContainer = styled.div`
  width: 100%;
  height: 100dvh;
  position: relative;
  z-index: 2;

  ${theme.media.mobile} {
    height: 100%;
  }
`;

export const HomeImage = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  pointer-events: none;
  
  & img {
    object-fit: cover;
    object-position: center;
  }
`

export const HomeTitle = styled.div`
  // position: absolute;
  // pointer-events: none;
  width: 100%;
  height: 100dvh;
  margin-top: -100dvh;
  display: flex;
  flex-direction: column;
  padding: 30px 90px 10px;
  justify-content: center;
  align-items:center;
  z-index: 20;
  color: white;
  opacity: 0;
  word-break: keep-all;
  animation-name: fadeIn;
  animation-duration: 1s;
  animation-timing-function: ease-in-out;
  animation-delay: 1s;
  animation-fill-mode: forwards;
  background-color:rgba(255, 248, 184, 0.17);
  position: relative;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  &::after{
    content: '';
    position: absolute;
    width: 100%;
    height: 40px;
    bottom: 0px;
    background: linear-gradient(to top, rgb(255, 248, 184), transparent);
    z-index: -1;
    pointer-events: none;
  }

  ${theme.media.mobile} {
        position: absolute;
        margin-top: 0;
        left: 0;
        height: 100%;
        top: 0;
        padding: 40px 20px 2px;

        &::after{
          height: 20px;
        }
  }
`

export const Title = styled.h1`
  font-size: 5rem;
  color: white;
  text-shadow: 0 0 10px black;
  font-weight: 900;
  text-align: center;
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1.2;
  padding-bottom: 50px;
  pointer-events: none;

  ${theme.media.mobile} {
    font-size: 3rem;
  }
`;

export const Intro = styled.h3`
  font-size: 2rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 15px;
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1.34;
  color: white;
  text-shadow: 0 0 5px black;
  pointer-events: none;

  ${theme.media.mobile} {
    font-size: 1.4rem;
  }
`;

export const HomeButton = styled.button`
  font-size: 1.3rem;
  font-weight: 700;
  text-align: center;
  padding: 7px 20px;
  border-radius: 17px;
  margin-top: auto;
  margin-bottom: 25px;
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1.34;
  color: black;
  background-color:#FFF8B8;
  background:rgb(249, 237, 122);
  background: linear-gradient(0deg, rgb(246, 234, 146) 0%, rgb(251, 249, 232) 100%);
  color: black;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.8);
  border: 0.5px solid white;


  &::after {
    position: absolute;
    content: "";
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    direction: rtl;
    z-index: -1;
    border-radius: 17px;
    box-shadow:
    -1px -4px 20px 0px #fff9,
    0px -1px 5px 0px #fff9,
    1px 4px 20px 0px #0002,
    0px 1px 5px 0px #0001;
    transition: all 0.3s ease; 
    animation: buttonBounce 3s infinite alternate;

    @keyframes buttonBounce {
      0% {
        box-shadow: none;
      }
      40% {
        box-shadow:
          -1px -4px 20px 0px #fff9,
          0px -1px 5px 0px #fff9,
          1px 4px 20px 0px #0002,
          0px 1px 5px 0px #0001;
      }
    }
  }

  &:hover {
    color: #000;
    border-radius: 17px;
    box-shadow:  2px 2px 6px 0 rgba(255,255,255,.5),
              -2px -2px 6px 0 rgba(255,255,255, .5), 
              inset -2px -2px 6px 0 rgba(255,255,255,.2),
              inset 2px 2px 6px 0 rgba(0, 0, 0, .4);
  }
    
  

  ${theme.media.mobile} {
    margin-bottom: 16px;  
    font-size: 1.2rem;
    padding: 7px 20px;
  }
`;

export const SubTitle = styled.h2`
  font-size: 1.6rem;
  font-weight: 800;
  text-align: center;
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1.34;
  color: white;
  text-shadow: 0 0 3px rgba(0, 0, 0, 1);
  pointer-events: none;

  ${theme.media.mobile} {
    font-size: 1.3rem;
  }
`;

export const HomeArrow = styled.div`
  font-size: 2.4rem;
  transform: rotate(180deg);
  margin-bottom: 10px;
  margin-top: 40px;
  animation: arrowBounce 1s infinite;

  @keyframes arrowBounce {
    0% {
      transform: translateY(-10px) rotate(180deg);
    }
    50% {
      transform: translateY(0px) rotate(180deg);
    }
    100% {
      transform: translateY(-10px) rotate(180deg);
    }
  }

  ${theme.media.mobile} {
    margin-top: 20px;
  }
`;


export const HomeIntroductionContainer = styled.div`
  width: 100%;
  position: relative;
  z-index: 1;

  ${theme.media.mobile} {
    // height: 100
  }
`;

export const HomeToggleWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  margin-top: 40px;
  // padding-top: 20px;
  position: sticky;
  top: 20px;
  z-index: 10;
  margin-bottom: -40px;

  & button:first-of-type {
    border-radius: 30px 0 0 30px;
    padding-left: 22px;
  }

  & button:last-of-type {
    border-radius: 0 30px 30px 0;
    padding-right: 22px;
  }

  ${theme.media.mobile} {
    top: 50px;
  }
`;

export const HomeToggle = styled.button`
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  padding: 10px 18px;
  border: 0.5px solid white;
  // border-radius: 0px;
  margin-top: auto;
  margin-bottom: 25px;
  font-family: var(--font-gothic);
  letter-spacing: 0.1rem;
  transition: all 0.3s ease;
  background-color: white;
  background: rgba(255, 255, 255, 0.86);
  border: 1px solid rgba(109, 109, 109, 0.1);
  box-shadow: 0 2px 8px rgba(98, 98, 98, 0.3);
  backdrop-filter: saturate(180%) blur(8px);
  font-family: var(--font-gothic);

  &:hover {
    background-color: white;
    color: black;
    cursor: pointer;
    box-shadow: inset 2px 3px 10px 0 rgba(65, 65, 65, 0.3);
  }

  ${(props) => props.$active && `
    background-color: var(--yellow);
    background: var(--yellow);
    color: black;
    font-weight: 700;
    box-shadow: inset 2px 3px 10px 0 rgba(65, 65, 65, 0.3);
  `}
`;

export const HomeIntroduction = styled.div`
  // box-shadow: 0 0 10px 10px red;
  width: calc(100% - 140px);
  // height: calc(100dvh - 100px);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  // justify-content: center;
  border-bottom: 2px dotted rgba(0, 0, 0, 0.63);
  margin: 0 70px;
  word-break: keep-all;

  ${theme.media.mobile} {
    width: calc(100% - 40px);
    margin: 0 20px;
  }
`

export const HomeIntroTitle = styled.h4`
  font-size: 1.6rem;
  font-weight: 600;
  text-align: center;
  font-family: var(--font-gothic);
  letter-spacing: 0.1rem;
  padding-top: 80px;
  line-height: 1.5;
`

export const HomeIntroSub = styled.div`
  font-size: 1.1rem;
  font-weight: 400;
  text-align: center;
  font-family: var(--font-gothic);
  letter-spacing: 0.1rem;
  padding-top: 20px;
  line-height: 1.5;
  margin-bottom: 20px;
  width: 40%;
  word-break: keep-all;

  ${theme.media.mobile} {
    width: 100%;
  }
`

export const HomeIntroButton = styled.button`
  font-size: 1.2rem;
  font-weight: 600;
  text-align: center;
  font-family: var(--font-gothic);
  letter-spacing: 0.1rem;
  padding: 10px 20px;
  border-radius: 10px;
  background-color: transparent;
  border: none;
  text-decoration: underline 1px wavy;
  text-underline-offset: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
  &:hover {
    color: #000;
    text-decoration: underline 2px wavy;
  }
`

export const HomeIntroImage = styled.div`
  position: relative;
  width: 65%;
  height: auto;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 10px;
  margin-top: 40px;
  margin-bottom: 120px;
  margin-right: auto;
  margin-left: 10px;
  box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.1), 0 0 10px 2px var(--yellow);
  transition: all 0.3s ease;

  &:hover{
    transform: scale(1.01);
  }

  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 10px;
    top: 0;
    left: 0;
    box-shadow: inset 0 0 10px 10px var(--yellow);
  }

  & img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
  }

  ${theme.media.mobile} {
    width: 100%;
    margin-right: 0;
    margin-left: 0;
  }
`

export const HomeIntroImageSecond = styled(HomeIntroImage)`
  margin-left: auto;
  margin-right: 10px;
  margin-top: -300px;
  box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.1), 0 0 10px 2px var(--yellow);

  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 10px;
    top: 0;
    left: 0;
    box-shadow: inset 0 0 10px 2px var(--yellow);
  }

  ${theme.media.mobile} {
    margin-top: -100px;
  }
`