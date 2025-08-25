const theme = {
  // 반응형 브레이크포인트
  breakpoints: {
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
  },
  // 미디어 쿼리 헬퍼
  media: {
    mobile: `@media (max-width: 767px)`,
    tablet: `@media (min-width: 768px)`,
    desktop: `@media (min-width: 1024px)`,
  }
};

export default theme;
