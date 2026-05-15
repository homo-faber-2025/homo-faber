'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAllStores } from '@/hooks/useStores';
import Loader from '@/components/common/Loader';
import Error from '@/components/common/Error';

// Map3D를 dynamic import로 로드하여 ExitStatus 오류 방지
const Map3D = dynamic(() => import('../components/common/Map3D'), {
  ssr: false,
  loading: () => <Loader text="지도를 불러오는 중..." baseColor="white" />
});

// Map2D를 dynamic import로 로드
const Map2D = dynamic(() => import('../components/common/Map2D'), {
  ssr: false,
  loading: () => <Loader text="지도를 불러오는 중..." baseColor="white" />
});

export default function MapContainer() {
  const { stores, isLoading, error } = useAllStores(); // 지도용으로는 모든 스토어 가져오기
  const [isMap3D, setIsMap3D] = useState(false); // 기본값은 2D
  const [hasMounted3D, setHasMounted3D] = useState(false); // 3D 지도 마운트 여부
  const [hoveredStore, setHoveredStore] = useState(null); // 호버된 store 상태
  const pathname = usePathname();
  const router = useRouter();

  // 지도 클릭 시 패널을 작게 만들기
  const handleMapClick = (e) => {
    // 패널 축소 이벤트 발생
    window.dispatchEvent(new CustomEvent('collapsePanel'));
  };

  // 지도 전환 함수
  const toggleMapView = () => {
    const newIsMap3D = !isMap3D;
    setIsMap3D(newIsMap3D);
    // 3D로 전환될 때 한 번 마운트되면 이후 유지
    if (newIsMap3D && !hasMounted3D) {
      setHasMounted3D(true);
    }
  };

  // Store hover 핸들러
  const handleStoreHover = (store) => {
    setHoveredStore(store);
    // 전역으로 hovered store 정보 저장 (StoreList에서 사용)
    window.hoveredStoreId = store.id;
    // 커스텀 이벤트 발생
    window.dispatchEvent(new CustomEvent('storeHover', { detail: store }));
  };

  const handleStoreLeave = () => {
    setHoveredStore(null);
    // 전역 hovered store 정보 제거
    window.hoveredStoreId = null;
    // 커스텀 이벤트 발생
    window.dispatchEvent(new CustomEvent('storeLeave'));
  };

  // 전역 이벤트 리스너 등록 (Navigation에서 호출할 수 있도록)
  useEffect(() => {
    const handleMapToggle = () => {
      toggleMapView();
    };

    // 커스텀 이벤트 리스너 등록
    window.addEventListener('toggleMapView', handleMapToggle);

    return () => {
      window.removeEventListener('toggleMapView', handleMapToggle);
    };
  }, [isMap3D]);

  if (isLoading) {
    return <Loader text="지도를 불러오는 중..." baseColor="white" />;
  }

  if (error) {
    return <Error message="Error loading stores" />;
  }

  return (
    <>
      {/* Map2D - 처음에는 2D 지도만 렌더링 */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100dvw',
          height: '100dvh',
          zIndex: isMap3D ? 1 : 2
        }}
        onClick={handleMapClick}
      >
        <Map2D
          onStoreHover={handleStoreHover}
          onStoreLeave={handleStoreLeave}
        />
      </div>

      {/* Map3D - 한 번 마운트되면 유지하고 z-index로 전환 */}
      {hasMounted3D && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100dvw',
            height: '100dvh',
            zIndex: isMap3D ? 2 : 1
          }}
        >
          <Map3D
            stores={stores}
            onStoreHover={handleStoreHover}
            onStoreLeave={handleStoreLeave}
            onMapClick={handleMapClick}
          />
        </div>
      )}
    </>
  );
} 