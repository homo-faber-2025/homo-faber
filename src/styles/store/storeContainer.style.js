import styled from '@emotion/styled';

export const StoreWrapper = styled.main`
  width: 80dvw;
  height: 100dvh;
  padding-left: 70px;
  padding-top: 27px;
  position: absolute;
  right: ${(props) => props.right};
  top: 0px;
  z-index: 2;
  background-color: var(--yellow);
  cursor: ${(props) => (props.pathname && (props.pathname !== '/' || props.pathname.startsWith('/store/'))) ? 'pointer' : 'default'};
  transition: right 0.6s cubic-bezier(0.2, 0, 0.4, 1);
  display: flex;
  flex-direction: column;
  box-shadow: -2px 4px 10px 0 rgba(0,0,0,0.25);
  overflow-y: hidden;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 15px;
    height: 100%;
    background: linear-gradient(270deg, rgba(69, 67, 43, 1) 0%, rgba(239, 232, 168, 1) 12%, rgba(239, 232, 168, 1) 35%, rgba(69, 67, 43, 1) 41%, rgba(217, 212, 166, 1) 47%, rgba(217, 212, 166, 1) 73%, rgba(69, 67, 43, 1) 78%, rgba(192, 189, 158, 1) 86%, rgba(192, 189, 158, 1) 99%, rgba(69, 67, 43, 1) 100%);
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
`

export const StoreFilterWrapper = styled.div`
  margin-bottom: 7px;
  margin-top: ${(props) => (props.isFilterOpen ? '60px' : '154.5px')};
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
`

export const ResetFilterBtn = styled(StoreFilterBtn)`
  margin-left: -27px;
`