'use client';

import useWindowSize from '@/hooks/useWindowSize';
import { usePOI } from '@/hooks/usePOI';
import { useEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const Map3D = ({ stores, onStoreHover, onStoreLeave, onMapClick }) => {
  const { width, height } = useWindowSize();
  const router = useRouter();

  // POI 클릭 핸들러
  const handlePOIClick = useCallback((storeId) => {
    router.push(`/store/${storeId}`);
  }, [router]);

  usePOI(stores, handlePOIClick, onStoreHover, onStoreLeave);


  // 지도 클릭 핸들러 (마우스 및 터치)
  const handleMapClickEvent = useCallback((e) => {
    // POI 클릭이 아닌 경우에만 패널 축소 이벤트 발생
    // POI 클릭은 usePOI에서 처리되므로 여기서는 빈 공간 클릭만 처리
    if (onMapClick) {
      onMapClick(e);
    }
  }, [onMapClick]);

  // 터치 이벤트 핸들러
  const handleTouchStart = (e) => {
    e.stopPropagation();
  };

  const handleTouchEnd = (e) => {
    e.stopPropagation();
    handleMapClickEvent(e);
  };

  // 마우스 클릭 이벤트 핸들러
  const handleMouseClick = useCallback((e) => {
    // POI가 클릭된 경우가 아니면 패널 축소
    const target = e.target;
    // map3D 컨테이너나 그 자식 요소 중 POI가 아닌 경우
    if (target.id === 'map3D' || target.closest('#map3D')) {
      // 약간의 지연을 두어 POI 클릭 이벤트가 먼저 처리되도록 함
      setTimeout(() => {
        handleMapClickEvent(e);
      }, 100);
    }
  }, [handleMapClickEvent]);

  useEffect(() => {
    // 이미 스크립트가 로드되었는지 확인
    if (typeof Module !== 'undefined' && Module.initialize) {
      // 이미 로드된 경우 바로 초기화
      initializeMap();
      return;
    }

    // 스크립트가 이미 존재하는지 확인
    const existingScript = document.querySelector('script[src*="XDWorldEM.js"]');
    if (existingScript) {
      // 기존 스크립트의 onload 이벤트에 초기화 함수 추가
      existingScript.addEventListener('load', initializeMap);
      return () => {
        existingScript.removeEventListener('load', initializeMap);
      };
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.xdworld.kr/2.13.0/XDWorldEM.js';
    script.async = true;
    script.onload = initializeMap;

    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const initializeMap = () => {
    if (typeof Module === 'undefined') return;

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
        new Module.JSVector3D(126.995128259481, 37.56844176478388, 37.128498304635286),
      );
      Module.getViewCamera().setDirect(130);
      Module.getViewCamera().setFov(45);
      Module.getViewCamera().setTilt(2);
      Module.getViewCamera().setAltitude(40);

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

      // 마우스 휠 민감도 설정 (값이 낮을수록 민감도가 낮아짐)
      const control = Module.getControl();
      if (control && control.setMouseWheelDelta) {
        // 기본값보다 낮은 값으로 설정하여 민감도 낮춤 (0.3 = 기본값의 30%)
        control.setMouseWheelDelta(0.1);
      }
    };
  };

  useEffect(() => {
    if (typeof Module !== 'undefined' && Module.Resize) {
      Module.Resize(width, height);
    }
  }, [width, height]);

  // 지도 클릭 이벤트 리스너 등록
  useEffect(() => {
    const mapElement = document.getElementById('map3D');
    if (!mapElement) return;

    // 마우스 클릭 이벤트 리스너
    mapElement.addEventListener('click', handleMouseClick);

    return () => {
      mapElement.removeEventListener('click', handleMouseClick);
    };
  }, [handleMouseClick]);

  return (
    <div
      id="map3D"
      style={{
        width: '100%',
        height: '100%',
        cursor: 'pointer',
        touchAction: 'manipulation', // 터치 동작 최적화
        WebkitTapHighlightColor: 'transparent', // iOS 터치 하이라이트 제거
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    />
  );
};

export default Map3D;