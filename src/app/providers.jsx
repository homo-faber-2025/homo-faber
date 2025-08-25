'use client';

import globalStyle from '@/styles/GlobalStyle';
import theme from '@/styles/Theme';
import { Global, ThemeProvider } from '@emotion/react';
import { AuthProvider } from '@/contexts/AuthContext';

function Providers({ children }) {
  return (
    <>
      <Global styles={globalStyle} />
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <div>{children}</div>
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}

export default Providers;
