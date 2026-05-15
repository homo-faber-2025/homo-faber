import styled from '@emotion/styled';
import theme from '@/styles/Theme';

export const NavigationIcon = styled.img`
  width: 70px;
  height: 70px;
  object-fit: cover;
  object-position: center;
  position: fixed;
  top: 10px;
  left: 24px;
  z-index: 1000;
  transition: all 1s ease-in-out; 
  animation: ${props => props.isOpen ? 'breathe2 2s ease-in-out' : 'breathe 7s ease-in-out infinite'};

  &:hover {
    transform: rotate(360deg);
    cursor: pointer;
    transition: all 1s ease-in-out; 
  }

  @keyframes breathe {
    70% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes breathe2 {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  ${theme.media.mobile} {
    width: 50px;
    height: 50px;
    top: 10px;
    left: 8px;
  }
`;

export const Title = styled.h1`
  position: fixed;
  top: 18px;
  left: 24px;
  z-index: 99;
  font-size: 2.4rem;
  font-weight: 700;
  margin-left: -3px;
  margin-right: 130px;

  ${theme.media.mobile} {
    font-size: 2.4rem;
    margin-right: 0px;
  }
`

export const NavigationBg = styled.div`
    display: none;
    backdrop-filter: saturate(180%) blur(5px);
    background: rgba(198, 198, 198, 0.67);

  ${theme.media.mobile} {
    display: ${props => props.isOpen ? 'block' : 'none'};
    width: 100dvw;
    height: 100dvh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9;
  }
`

export const NavigationWrapper = styled.nav`
  position: fixed;
  top: 103px;
  left: 22px;
  z-index: 5;
  background: rgba(201, 201, 201, 0.63);
  border: 1px solid rgba(109, 109, 109, 0.1);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(35, 35, 35, 0.3);
  padding: 8px 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  backdrop-filter: saturate(180%) blur(8px);
  font-family: var(--font-gothic);
  
  /* 애니메이션 속성 */
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.isOpen ? 'translateY(0) scale(1)' : 'translateY(-10px) scale(0.95)'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  /* 열린 상태에서만 포인터 이벤트 허용 */
  pointer-events: ${props => props.isOpen ? 'auto' : 'none'};

  ${theme.media.mobile} {
    top: 50px;
    left: 60px;
    // flex-direction: row;
    flex-wrap: wrap;
    margin-right: 20px;
    justify-content: flex-start
    align-items: center;
    // gap: 3px 4px;
    padding: 6px 6px;
    border-radius: 8px;
    z-index: 12;
  }
`;

export const NavigationItem = styled.div`
  display: inline-block;
  padding: 7px 7px 6px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: ${props => props.active ? 700 : 500};
  line-height: 1;
  color: #555;
  background: ${props => props => props.active ? 'rgb(240, 240, 240)' : 'transparent'};
  border: ${props => props.active ? '1px solid #ccc' : '1px solid transparent'};
  transition: background 0.2s ease, color 0.2s ease;

  ${theme.media.mobile} {
   padding: 10px 14px;
    border-radius: 10px;
    font-size: 1.2rem;
    z-index: 10;
  }
`;

export const CloseButton = styled.button`
  position: fixed;
  font-size: 1.8rem;
  font-weight: 100;
  font-family: var(--font-gothic);
  cursor: pointer;
  background: none;
  top: 410px;
  left: 32px;
  border: none;
  color: #666;
  z-index: 1001;
`;

export const MapToggleButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  opacity: 0.8;
  background: #999;
  color: white;
  border: 1px solid transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  font-family: var(--font-gothic);
  position: absolute;
  bottom: 20px;
  left: 28px;
  z-index: 5;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);

  &:hover {
    opacity: 1;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.25);
  }

  &:active {
    transform: translateY(0);
  }

  ${theme.media.mobile} {
    padding: 10px 14px;
    border-radius: 25px;
    font-size: 1.2rem;
    left: unset;
    right: 20px;
    bottom: 20px;
    display: ${props => props.isOpen ? 'flex' : 'none'};
    z-index: 10;
  }
`;

export const SwitchTrack = styled.div`
  position: relative;
  width: 20px;
  height: 40px;
  background: ${props => props.isActive
    ? 'rgba(255,255,255,0.3)'
    : 'rgba(255,255,255,0.2)'
  };
  border-radius: 20px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255,255,255,0.3);
`;

export const SwitchThumb = styled.div`
  position: absolute;
  top: ${props => props.isActive ? '22px' : '2px'};
  left: 1px;
  width: 16px;
  height: 16px;
  background: white;
  border-radius: 50%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  transform: ${props => props.isActive ? 'scale(1.1)' : 'scale(1)'};
`;

export const SwitchText = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${props => props.isActive ? 'white' : '#444'};
  white-space: nowrap;
  transition: all 0.3s ease;
  
  ${theme.media.mobile} {
    font-size: 14px;
  }
`;

// export const LanguageToggleWrapper = styled.div`
//   position: fixed;
//   top: 20px;
//   right: 20px;
//   z-index: 1001;
  
//   ${theme.media.mobile} {
//     top: 15px;
//     right: 15px;
//     z-index: 1001;
//   }
// `;

// export const LanguageToggleContainer = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   margin-top: 8px;
//   padding: 4px;
  
//   ${theme.media.mobile} {
//     margin-top: 6px;
//     padding: 2px;
//   }
// `;