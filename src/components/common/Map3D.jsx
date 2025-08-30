'use client';

import useWindowSize from '@/hooks/useWindowSize';
import { usePOI } from '@/hooks/usePOI';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const Map3D = ({ stores }) => {
  const { width, height } = useWindowSize();
  const pathname = usePathname();
  const router = useRouter();
  usePOI(stores);

  // /store 페이지 또는 개별 스토어 페이지에서 Map3D 클릭 시 홈으로 이동
  const handleMapClick = (e) => {
    if (pathname !== '/') {
      router.push('/');
    }
  };

  // 터치 이벤트 핸들러 추가
  const handleTouchStart = (e) => {
    // e.preventDefault();
    e.stopPropagation();
  };

  const handleTouchEnd = (e) => {
    // e.preventDefault();
    e.stopPropagation();
    handleMapClick(e);
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.xdworld.kr/2.13.0/XDWorldEM.js';
    script.async = true;
    script.onload = () => {
      Module.locateFile = function (s) {
        return `https://cdn.xdworld.kr/2.13.0/${s}`;
      };

      Module.postRun = function () {
        Module.initialize({
          container: document.getElementById('map3D'),
          terrain: {
            dem: {
              url: 'https://xdworld.vworld.kr',
              name: 'dem',
              servername: 'XDServer3d',
              encoding: true,
            },
            image: {
              url: 'https://xdworld.vworld.kr',
              name: 'tile',
              servername: 'XDServer3d',
            },
          },
          worker: { use: true, path: '/worker/XDWorldWorker.js', count: 5 },
          defaultKey: 'dJe!e!iaEpHmEpCrD5QpEQf2#FBrdzDmd(BQDQEQDJdaE(iB',
        });

        Module.getViewCamera().setLocation(
          new Module.JSVector3D(126.99514470317824, 37.568451978489975, 46),
        );
        Module.getViewCamera().setDirect(124);
        Module.getViewCamera().setFov(45);
        Module.getViewCamera().setTilt(11);

        // 구글 배경지도가 로딩속도가 빠름
        // 구글은 푸른색감 기본지도는 초록색감 -> 최종 디자인보고 결정
        var google = Module.GoogleMap();
        google.layername = 'satellite';
        google.quality = 'middle';
        google.zerolevelOffset = 1;

        Module.getTileLayerList().createXDServerLayer({
          url: 'https://xdworld.vworld.kr',
          servername: 'XDServer3d',
          name: 'facility_build',
          type: 9,
          minLevel: 0,
          maxLevel: 15,
        });
      };

      document.body.appendChild(script);
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (typeof Module !== 'undefined' && Module.Resize) {
      Module.Resize(width, height);
    }
  }, [width, height]);

  return (
    <div
      id="map3D"
      style={{
        width: '100dvw',
        height: '100dvh',
        cursor: 'pointer',
        touchAction: 'manipulation', // 터치 동작 최적화
        WebkitTapHighlightColor: 'transparent', // iOS 터치 하이라이트 제거
        position: 'fixed', // 고정 위치로 설정
        top: '0',
        left: '0',
        zIndex: 1, // 낮은 z-index로 설정하여 다른 컴포넌트가 위에 올라올 수 있도록
      }}
      onClick={handleMapClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    />
  );
};

export default Map3D;