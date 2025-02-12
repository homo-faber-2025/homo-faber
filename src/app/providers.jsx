'use client';

import globalStyle from '@/styles/GlobalStyle';
import theme from '@/styles/Theme';
import { Global, ThemeProvider } from '@emotion/react';

function Providers({ children }) {
  return (
    <>
      <Global styles={globalStyle} />
      <ThemeProvider theme={theme}>
        <div>{children}</div>
      </ThemeProvider>
    </>
  );
}

export default Providers;
