'use client';

import { Gothic_A1, Noto_Serif_KR } from 'next/font/google';
import './globals.css';
import Providers from '@/app/providers';
import { AppProvider, useApp } from '@/contexts/AppContext';
import Map3D from '@/components/Map3D';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styled from '@emotion/styled';

const gothic = Gothic_A1({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-gothic',
});
const noto = Noto_Serif_KR({
  weight: ['200', '300', '400', '500', '600', '700', '900'],
  subsets: ['latin'],
  variable: '--font-noto',
});

const LayoutContainer = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`;

const MapContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  transition: transform 0.3s ease-in-out;

  ${(props) => {
    if (props.pathname === '/store') {
      return 'transform: translateX(-80vw);';
    }
    return 'transform: translateX(0);';
  }}
`;

const StorePanel = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: ${(props) => (props.isExpanded ? '80vw' : '320px')};
  height: 100vh;
  background: white;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
  z-index: 1000;
  overflow-y: auto;

  ${(props) => {
    if (props.isExpanded) {
      return 'transform: translateX(0);';
    } else if (props.showPreview) {
      return 'transform: translateX(224px);'; // 30% 미리보기
    } else {
      return 'transform: translateX(100%);'; // 완전히 숨김
    }
  }}
`;

const ToggleButton = styled.button`
  position: fixed;
  top: 50%;
  right: ${(props) => {
    if (props.isExpanded) return 'calc(80vw + 20px)';
    return '20px';
  }};
  transform: translateY(-50%);
  z-index: 1100;
  padding: 12px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  transition: right 0.3s ease-in-out;
  cursor: pointer;

  &:hover {
    background: #0056b3;
  }
`;

const ContentContainer = styled.div`
  position: relative;
  z-index: 10;
  width: 100%;
  height: 100%;
`;

// 내부 레이아웃 컴포넌트
function LayoutContent({ children }) {
  const { stores, isLoading, error } = useApp();
  const [mapMounted, setMapMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // 패널 상태 결정
  const isStorePageExpanded = pathname === '/store';
  const showPreview = pathname === '/'; // 홈에서만 미리보기

  const togglePanel = () => {
    if (isStorePageExpanded) {
      router.push('/', { scroll: false });
    } else {
      router.push('/store', { scroll: false });
    }
  };

  // 지도가 필요한 페이지만
  const mapPages = ['/', '/store']; // 홈과 스토어 페이지에서만 지도 표시
  const shouldShowMap =
    mapPages.includes(pathname) || pathname.startsWith('/store/');

  // 맵이 로드되면 한 번만 마운트 (지도가 필요한 페이지에서만)
  useEffect(() => {
    if (shouldShowMap && !mapMounted && !isLoading && stores.length > 0) {
      setMapMounted(true);
    }
  }, [shouldShowMap, isLoading, stores.length, mapMounted]);

  if (error) {
    return <div>에러가 발생했습니다: {error.message}</div>;
  }

  // 지도가 필요없는 페이지들은 일반 레이아웃으로 렌더링
  if (!shouldShowMap) {
    return <ContentContainer>{children}</ContentContainer>;
  }

  return (
    <LayoutContainer>
      {/* 맵 - 지도 페이지에서만 마운트 */}
      <MapContainer pathname={pathname}>
        {mapMounted ? (
          <Map3D stores={stores} />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#f5f5f5',
              color: '#666',
            }}
          >
            맵 로딩 중...
          </div>
        )}
      </MapContainer>

      {/* 토글 버튼 */}
      <ToggleButton isExpanded={isStorePageExpanded} onClick={togglePanel}>
        {isStorePageExpanded ? '← 맵으로' : '상점 목록 →'}
      </ToggleButton>

      {/* 스토어 패널 - 홈과 스토어 페이지에서만 표시 */}
      {(pathname === '/' || pathname === '/store') && (
        <StorePanel isExpanded={isStorePageExpanded} showPreview={showPreview}>
          {children}
        </StorePanel>
      )}

      {/* 스토어 상세 페이지 등 기타 페이지 */}
      {pathname.startsWith('/store/') && pathname !== '/store' && (
        <StorePanel isExpanded={false} showPreview={false}>
          {children}
        </StorePanel>
      )}
    </LayoutContainer>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className={`${gothic.className} ${noto.className}`}>
        <Providers>
          <AppProvider>
            <LayoutContent>{children}</LayoutContent>
          </AppProvider>
        </Providers>
      </body>
    </html>
  );
}
