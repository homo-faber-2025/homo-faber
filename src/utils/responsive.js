// 모바일 분기점 감지 유틸리티 함수들

/**
 * 현재 화면이 모바일 크기인지 확인하는 함수
 * @param {number} width - 화면 너비
 * @returns {boolean} 모바일 여부
 */
export const isMobileBreakpoint = (width) => {
  return width <= 767;
};

/**
 * 현재 화면이 태블릿 크기인지 확인하는 함수
 * @param {number} width - 화면 너비
 * @returns {boolean} 태블릿 여부
 */
export const isTabletBreakpoint = (width) => {
  return width >= 768 && width <= 1023;
};

/**
 * 현재 화면이 데스크톱 크기인지 확인하는 함수
 * @param {number} width - 화면 너비
 * @returns {boolean} 데스크톱 여부
 */
export const isDesktopBreakpoint = (width) => {
  return width >= 1024;
};

/**
 * 화면 크기에 따른 디바이스 타입을 반환하는 함수
 * @param {number} width - 화면 너비
 * @returns {string} 'mobile' | 'tablet' | 'desktop'
 */
export const getDeviceType = (width) => {
  if (isMobileBreakpoint(width)) return 'mobile';
  if (isTabletBreakpoint(width)) return 'tablet';
  return 'desktop';
};

/**
 * 모바일에서 사용할 bottom 위치를 계산하는 함수
 * @param {string} pathname - 현재 경로
 * @returns {string} bottom 위치 값
 */
export const getMobileBottomPosition = (pathname) => {
  if (pathname === '/') {
    return 'calc(-80dvh + 120px)';
  } else if (pathname.startsWith('/store')) {
    return '0px';
  } else {
    return 'calc(-80dvh + 120px)';
  }
};

/**
 * 데스크톱에서 사용할 right 위치를 계산하는 함수
 * @param {string} pathname - 현재 경로
 * @returns {string} right 위치 값
 */
export const getDesktopRightPosition = (pathname) => {
  if (pathname === '/') {
    return 'calc(-80dvw + 120px)';
  } else if (pathname.startsWith('/store')) {
    return '0px';
  } else {
    return 'calc(-80dvw + 120px)';
  }
};
