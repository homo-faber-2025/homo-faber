import { Gothic_A1, Noto_Serif_KR, ABeeZee } from 'next/font/google';
import dynamic from 'next/dynamic';
import './globals.css';
import Providers from '@/app/providers';
import ConditionalLayout from '@/components/common/ConditionalLayout';

// Navigation을 동적 로딩하여 초기 로딩 속도 개선
const Navigation = dynamic(() => import('@/components/common/Navigation'), {
  ssr: false,
  loading: () => null,
});

// 필요한 weight만 로드하여 초기 로딩 속도 개선
const gothic = Gothic_A1({
  weight: ['400', '500', '600', '700', '800', '900'], // 자주 사용하는 weight만 로드
  subsets: ['latin'],
  variable: '--font-gothic',
  display: 'swap',
  preload: true, // 폰트 우선 로드
});
const noto = Noto_Serif_KR({
  weight: ['400', '500', '600', '700', '900'], // 자주 사용하는 weight만 로드
  subsets: ['latin'],
  variable: '--font-noto',
  display: 'swap',
  preload: false, // 필요시 로드
});
const abeezee = ABeeZee({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-abeezee',
  display: 'swap',
  preload: false, // 필요시 로드
});


export const metadata = {
  title: '산림동의 만드는 사람들: 호모파베르',
  description: '을지로의 제조업을 살리다! 기술유통중개소에서 기술자들을 쉽게 만나보세요.',
  keywords: '산림동의 만드는 사람들, 호모파베르, 기술자, 기술유통중개소, 을지로, 제조업',
  openGraph: {
    title: '산림동의 만드는 사람들: 호모파베르',
    description: '을지로의 제조업을 살리다! 기술유통중개소에서 기술자들을 쉽게 만나보세요.',
    keywords: '산림동의 만드는 사람들, 호모파베르, 기술자, 기술유통중개소, 을지로, 제조업',
    type: 'website',
    locale: 'ko_KR',
    images: [
      {
        url: '/img/DSC03100.jpg',
        width: 1200,
        height: 630,
        alt: '산림동의 만드는 사람들: 호모파베르',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '산림동의 만드는 사람들: 호모파베르',
    description: '을지로의 제조업을 살리다! 기술유통중개소에서 기술자들을 쉽게 만나보세요.',
    keywords: '산림동의 만드는 사람들, 호모파베르, 기술자, 기술유통중개소, 을지로, 제조업',
    images: ['/img/DSC03100.jpg'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Critical CSS 인라인화 - 초기 렌더링에 필요한 최소한의 스타일만 */}
        {/* 원래 설정 유지: globals.css와 GlobalStyle.jsx의 폰트 크기 설정 반영 */}
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              --white: #F8F8F8;
              --black: #000000;
              --light-black: #434343;
              --yellow: #FFF8B8;
              --brown: #363315;
              --gray: #A9A9A9;
              --red: #FE0000;
              --neon-green: #40FF89;
            }
            /* globals.css 설정: 웹 10px, 모바일 11px */
            html {
              font-size: 10px; /* 웹 기준 폰트 크기 */
            }
            @media (max-width: 768px) {
              html {
                font-size: 11px; /* 모바일 기준 폰트 크기 */
              }
            }
            /* GlobalStyle.jsx의 설정도 고려 (나중에 로드되지만 Critical CSS에서도 일관성 유지) */
            /* 모바일 first: 9.6pt, 데스크톱: 10pt */
            /* 하지만 globals.css의 px 설정이 우선 적용되도록 유지 */
            html, body {
              max-width: 100vw;
              overflow-x: hidden;
              margin: 0;
              padding: 0;
            }
            body {
              color: var(--black);
              background: var(--white);
              font-family: var(--font-gothic), 'Gothic A1', Arial, Helvetica, sans-serif;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }
            * {
              box-sizing: border-box;
            }
          `
        }} />
      </head>
      <body
        className={`${gothic.variable} ${noto.variable} ${abeezee.variable}`}
      >
        <Providers>
          <ConditionalLayout />
          <Navigation />
          {children}
        </Providers>
      </body>
    </html>
  );
}
