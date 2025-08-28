import styled from '@emotion/styled';
import theme from '@/styles/Theme';

export const StoreWrapper = styled.main`
  width: 80dvw;
  height: 100dvh;
  padding-left: 64px;
  padding-top: 27px;
  position: fixed;
  right: ${(props) => props.isMobile ? 'unset' : props.right};
  bottom: ${(props) => props.isMobile ? props.bottom : 'unset'};
  top: ${(props) => props.isMobile ? 'unset' : '0px'};
  z-index: 2;
  background-color: var(--yellow);
  cursor: ${(props) => (props.pathname && (props.pathname !== '/' || props.pathname.startsWith('/store/'))) ? 'pointer' : 'default'};
  transition: ${(props) => props.isMobile ? 'bottom 0.6s cubic-bezier(0.2, 0, 0.4, 1)' : 'right 0.6s cubic-bezier(0.2, 0, 0.4, 1)'};
  display: flex;
  flex-direction: column;
  box-shadow: -2px 4px 10px 0 rgba(0,0,0,0.25);
  overflow: hidden;

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
      background: linear-gradient(360deg, rgba(69, 67, 43, 1) 0%, rgba(239, 232, 168, 1) 12%, rgba(239, 232, 168, 1) 35%, rgba(69, 67, 43, 1) 41%, rgba(217, 212, 166, 1) 47%, rgba(217, 212, 166, 1) 73%, rgba(69, 67, 43, 1) 78%, rgba(192, 189, 158, 1) 86%, rgba(192, 189, 158, 1) 99%, rgba(69, 67, 43, 1) 100%);
    }
  }

  ${theme.media.mobile} {
    width: 100dvw;
    height: 87dvh;
    padding-left: 0;
  }
`;

export const StorePageName = styled.h1`
  font-family: var(--font-gothic);
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.3rem;
  position: absolute;
  transform: rotate(90deg);
  transform-origin: top left;
  top: 17px;
  left: 43px;

  ${theme.media.mobile} { 
    transform: rotate(0deg);
    transform-origin: top left;
    top: 22px;
    left:10px;
    font-size: 1rem;
  }
`

export const StoreFilterWrapper = styled.div`
  margin-bottom: 7px;
  margin-top: ${(props) => (props.isFilterOpen ? '60px' : '152.5px')};

  ${theme.media.mobile} {
    margin-top: 50px;
    margin-left: 2px;
    margin-right: -2px;
    position: relative;
  }
`

export const StoreFilterBtn = styled.button`
  border : none;
  background: none;
  text-align: left;
  font-size: 1.12rem; 
  font-family: var(--font-gothic);
  font-weight: 800;
  transform: scaleX(0.8);
  transform-origin: left center;
  cursor: pointer;
  color: black;

  ${theme.media.mobile} {
    margin-left: 10px;
  }
`

export const ResetFilterBtn = styled(StoreFilterBtn)`
  margin-left: -27px;

  ${theme.media.mobile} {
    margin-left: -23px;
  }
`