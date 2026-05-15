'use client';

import { useAllStores } from '@/hooks/useStores';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

export default function Map2D({ onStoreHover, onStoreLeave }) {
  const { stores } = useAllStores(); // 지도용으로는 모든 스토어 가져오기
  const pathname = usePathname();
  const router = useRouter();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const infoWindowRef = useRef(null);
  const customOverlayRef = useRef(null);

  // POI 클릭 핸들러
  const handlePOIClick = useCallback((storeId) => {
    router.push(`/store/${storeId}`);
  }, [router]);

  // 마커 추가 함수
  const addMarkers = useCallback(() => {
    if (!mapInstanceRef.current || !stores) return;

    // 기존 마커 제거
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // 새 마커 추가
    stores.forEach(store => {
      // latitude와 longitude를 숫자로 변환
      const lat = parseFloat(store.latitude);
      const lng = parseFloat(store.longitude);


      // 유효한 좌표인지 확인
      if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
        // 기본 마커 생성 함수 (검은 동그라미)
        const createDefaultIcon = (store) => {
          return {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
               <svg width="10" height="10" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <!-- 검은 동그라미 마커 -->
                 <circle cx="5" cy="5" r="5" fill="#322F18" stroke="#ffffff" stroke-width="1"/>
               </svg>
             `),
            scaledSize: new google.maps.Size(20, 20),
            anchor: new google.maps.Point(20, 20)
          };
        };

        // 호버 아이콘 생성 함수 (1.4배 확대된 검은 동그라미)
        const createHoverIcon = (store) => {
          return {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
               <svg width="10" height="10" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <!-- 검은 동그라미 마커 -->
                 <circle cx="5" cy="5" r="5" fill="#42ff89" stroke="#ffffff" stroke-width="1"/>
               </svg>
             `),
            scaledSize: new google.maps.Size(20, 20),
            anchor: new google.maps.Point(20, 20)
          };
        };


        // 기본 아이콘으로 마커 생성
        const defaultIcon = createDefaultIcon(store);
        const marker = new google.maps.Marker({
          position: { lat: lat, lng: lng },
          map: mapInstanceRef.current,
          title: store.name,
          icon: defaultIcon
        });

        // 마커 클릭 이벤트
        marker.addListener('click', () => {
          handlePOIClick(store.id);
        });

        // 마커 호버 이벤트 - 확대된 아이콘으로 변경 및 가게 이름 표시
        marker.addListener('mouseover', () => {
          marker.setZIndex(999998);

          // 상위 컴포넌트에 호버된 store 정보 전달
          if (onStoreHover) {
            onStoreHover(store);
          }

          // 호버 시 확대된 아이콘으로 변경
          const hoverIcon = createHoverIcon(store);
          marker.setIcon(hoverIcon);

          // 기존 커스텀 오버레이 제거
          if (customOverlayRef.current) {
            customOverlayRef.current.setMap(null);
            customOverlayRef.current = null;
          }

          // 커스텀 오버레이로 툴팁 생성 (X 아이콘 없음)
          const hasImage = store.thumbnail_img;
          const tooltipContent = hasImage
            ? `
              <div style="
                padding: 10px 8px 5px 8px;
                background: rgba(255, 255, 255, 0.8);
                border-radius: 8px;
                font-size: 14px;
                font-weight: 500;
                color: #333;
                flex-direction: column;
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                max-width: 300px;
                position: relative;
                margin-bottom: 15px;
                z-index: 999999;
              ">
                <img 
                  src="${store.thumbnail_img}" 
                  alt="${store.name}"
                  style="
                    width: 100%;
                    height: auto;
                    object-fit: cover;
                    border-radius: 4px;
                    border: 1px solid #eee;
                  "
                  onerror="this.style.display='none'"
                />
                <div>
                  <div style="font-weight: 600; margin-bottom: 4px; font-size: 1rem; text-align: center;">${store.name}</div>
                  ${store.keyword && Array.isArray(store.keyword) && store.keyword.length > 0 ? `
                    <div>
                      ${store.keyword.map(keyword =>
              `<span style="
                          font-size: 0.9rem;
                          color: #555;
                          white-space: wrap;
                          word-break: keep-all;
                                    ">${keyword}</span>`
            ).join(', ')}
                  </div>
                  ` : ''}
                </div>
              </div>
            `
            : `
              <div style="
                padding: 8px 12px 5px 12px;
                background: white;
                border: 1px solid #ccc;
                border-radius: 4px;
                font-size: 1rem;
                font-weight: 600;
                color: #333;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                position: relative;
                z-index: 999999;
                margin-bottom: 15px;
                max-width: 300px;
              ">
                <div style="font-weight: 600; margin-bottom: 4px; text-align: center;">${store.name}</div>
                ${store.keyword && Array.isArray(store.keyword) && store.keyword.length > 0 ? `
                  <div style="
                    width: 90%; margin: 0 auto;
                    white-space: wrap;
                    word-break: keep-all;
                  ">
                    ${store.keyword.map(keyword =>
              `<span style="
              font-size: 0.9rem;
              color: #555;
              white-space: nowrap;
                        ">${keyword}</span>`
            ).join(', ')}
                </div>
                ` : ''}
              </div>
            `;

          // 커스텀 오버레이 생성
          const overlayElement = document.createElement('div');
          overlayElement.innerHTML = tooltipContent;
          overlayElement.style.position = 'absolute';
          overlayElement.style.transform = 'translate(-50%, -100%)';
          overlayElement.style.marginTop = '-10px';
          overlayElement.style.zIndex = '999999';
          overlayElement.style.pointerEvents = 'none';

          customOverlayRef.current = new google.maps.OverlayView();
          customOverlayRef.current.onAdd = function () {
            const panes = this.getPanes();
            // overlayMouseTarget 레이어를 사용하여 최상위에 표시
            panes.overlayMouseTarget.appendChild(overlayElement);
          };

          customOverlayRef.current.draw = function () {
            const projection = this.getProjection();
            const position = projection.fromLatLngToDivPixel(marker.getPosition());
            overlayElement.style.left = position.x + 'px';
            overlayElement.style.top = position.y + 'px';
          };

          customOverlayRef.current.onRemove = function () {
            if (overlayElement.parentNode) {
              overlayElement.parentNode.removeChild(overlayElement);
            }
          };

          customOverlayRef.current.setMap(mapInstanceRef.current);
        });

        marker.addListener('mouseout', () => {
          marker.setZIndex(1);

          // 상위 컴포넌트에 호버 해제 정보 전달
          if (onStoreLeave) {
            onStoreLeave();
          }

          // 원래 아이콘으로 복원
          marker.setIcon(defaultIcon);

          // 커스텀 오버레이 제거
          if (customOverlayRef.current) {
            customOverlayRef.current.setMap(null);
            customOverlayRef.current = null;
          }
        });

        markersRef.current.push(marker);
      }
    });
  }, [stores, handlePOIClick]);

  // Google Maps 초기화 - Forced reflow 최소화를 위한 최적화
  useEffect(() => {
    let isMounted = true;
    let initTimer = null;

    const initMap = async () => {
      if (!mapRef.current || !isMounted) return;

      try {
        // API 라우트를 통해 API 키 가져오기
        const response = await fetch('/api/maps/script');
        if (!response.ok) {
          throw new Error('Failed to fetch Google Maps API key');
        }
        const data = await response.json();
        const apiKey = data.apiKey;

        if (!apiKey) {
          throw new Error('Google Maps API key not found');
        }

        // @googlemaps/js-api-loader 사용
        // libraries 최소화하여 초기 로딩 시간 단축
        const loader = new Loader({
          apiKey: apiKey,
          version: "weekly",
          libraries: [] // places는 필요할 때만 로드
        });

        const { Map } = await loader.importLibrary("maps");

        // DOM 요소가 존재하는지 확인
        if (!mapRef.current || !isMounted) {
          console.warn('Map container not found');
          return;
        }

        // requestAnimationFrame을 사용하여 DOM 조작을 배치 처리 (Forced reflow 최소화)
        requestAnimationFrame(() => {
          if (!mapRef.current || !isMounted) return;

          // 모바일 감지 (한 번만 읽어서 reflow 최소화)
          const isMobile = window.innerWidth <= 768;

          // 모바일/데스크톱에 따른 초기 설정
          const initialCenter = isMobile
            ? { lat: 37.567750, lng: 126.996055 } // 모바일 좌표
            : { lat: 37.567836, lng: 126.997402 }; // 데스크톱 좌표

          const initialZoom = isMobile ? 18.3 : 18.8; // 모바일: 17, 데스크톱: 18.5

          // 지도 초기화
          mapInstanceRef.current = new Map(mapRef.current, {
          center: initialCenter,
          zoom: initialZoom,
          mapTypeId: 'roadmap',
          disableDefaultUI: true, // 기본 UI 컨트롤 숨기기 (map/satellite 메뉴바, 줌 컨트롤 등)
          styles: [
            {
              "featureType": "all",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#322F18"
                }
              ]
            },
            {
              "featureType": "all",
              "elementType": "labels.text.stroke",
              "stylers": [
                {
                  "color": "#ffffff"
                }
              ]
            },
            {
              "featureType": "all",
              "elementType": "labels.icon",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "administrative",
              "elementType": "geometry.fill",
              "stylers": [
                {
                  "color": "#322F18"
                }
              ]
            },
            {
              "featureType": "administrative",
              "elementType": "geometry.stroke",
              "stylers": [
                {
                  "color": "#322F18"
                }
              ]
            },
            {
              "featureType": "landscape",
              "elementType": "geometry.fill",
              "stylers": [
                {
                  "lightness": "35"
                },
                {
                  "hue": "#00ff61"
                }
              ]
            },
            {
              "featureType": "landscape",
              "elementType": "geometry.stroke",
              "stylers": [
                {
                  "color": "#322F18"
                }
              ]
            },
            {
              "featureType": "landscape",
              "elementType": "labels",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "poi",
              "elementType": "geometry.fill",
              "stylers": [
                {
                  "color": "#ffffff"
                }
              ]
            },
            {
              "featureType": "poi",
              "elementType": "labels",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "road",
              "elementType": "geometry.fill",
              "stylers": [
                {
                  "color": "#42ff89"
                },
                {
                  "weight": "6"
                },
                {
                  "lightness": "34"
                }
              ]
            },
            {
              "featureType": "road",
              "elementType": "geometry.stroke",
              "stylers": [
                {
                  "color": "#73fca7"
                },
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "road",
              "elementType": "labels",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "transit",
              "elementType": "labels",
              "stylers": [
                {
                  "visibility": "simplified"
                },
                {
                  "hue": "#322F18"
                }
              ]
            },
            {
              "featureType": "transit",
              "elementType": "labels.text.stroke",
              "stylers": [
                {
                  "weight": "0.83"
                },
                {
                  "color": "#ffffff"
                }
              ]
            },
            {
              "featureType": "transit.line",
              "elementType": "all",
              "stylers": [
                {
                  "visibility": "on"
                },
                {
                  "weight": "5.46"
                },
                {
                  "hue": "#73fca7"
                }
              ]
            },
            {
              "featureType": "transit.station.bus",
              "elementType": "labels",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "water",
              "elementType": "geometry.fill",
              "stylers": [
                {
                  "color": "#ffffff"
                }
              ]
            },
            {
              "featureType": "water",
              "elementType": "labels.icon",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            }
          ]
          });

          // POI 마커 추가 (다음 프레임에서 실행하여 reflow 분산)
          requestAnimationFrame(() => {
            if (isMounted && mapInstanceRef.current) {
              addMarkers();
            }
          });
        });
      } catch (error) {
        console.error('Google Maps 로딩 실패:', error);
        // 폴백: 정적 이미지 표시
        if (mapRef.current && isMounted) {
          requestAnimationFrame(() => {
            if (mapRef.current && isMounted) {
              mapRef.current.style.backgroundImage = 'url(/2Dmap.png)';
              mapRef.current.style.backgroundSize = 'cover';
              mapRef.current.style.backgroundPosition = 'center';
            }
          });
        }
      }
    };

    // DOM이 완전히 마운트되고 레이아웃이 안정된 후 실행
    // Intersection Observer를 사용하여 지도가 뷰포트에 들어올 때만 로드 (lazy loading)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && isMounted) {
            // 지도가 뷰포트에 보일 때만 초기화
            // 지연 시간을 줄여서 더 빠르게 로드 (초기 렌더링 완료 후 즉시 로드)
            initTimer = setTimeout(() => {
              if (isMounted) {
                initMap();
              }
            }, 100); // 200ms -> 100ms로 단축하여 더 빠른 로드
            observer.disconnect();
          }
        });
      },
      { rootMargin: '50px' } // 뷰포트 50px 전에 미리 로드
    );

    if (mapRef.current) {
      observer.observe(mapRef.current);
    } else {
      // mapRef가 아직 없는 경우 약간의 지연 후 재시도
      initTimer = setTimeout(() => {
        if (mapRef.current && isMounted) {
          observer.observe(mapRef.current);
        }
      }, 100);
    }

    return () => {
      isMounted = false;
      if (initTimer) {
        clearTimeout(initTimer);
      }
      observer.disconnect();
    };
  }, [addMarkers]);

  // stores가 변경될 때마다 마커 업데이트
  useEffect(() => {
    if (mapInstanceRef.current) {
      addMarkers();
    }
  }, [stores, addMarkers]);

  // 지도 크기 조정 - requestAnimationFrame으로 배치 처리
  useEffect(() => {
    if (mapInstanceRef.current) {
      // requestAnimationFrame을 사용하여 reflow를 다음 프레임으로 지연
      requestAnimationFrame(() => {
        if (mapInstanceRef.current) {
          google.maps.event.trigger(mapInstanceRef.current, 'resize');
        }
      });
    }
  }, []);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      try {
        // 마커 정리
        if (markersRef.current) {
          markersRef.current.forEach(marker => {
            if (marker && marker.setMap) {
              marker.setMap(null);
            }
          });
          markersRef.current = [];
        }

        // InfoWindow 정리
        if (infoWindowRef.current) {
          infoWindowRef.current.close();
          infoWindowRef.current = null;
        }

        // 커스텀 오버레이 정리
        if (customOverlayRef.current) {
          customOverlayRef.current.setMap(null);
          customOverlayRef.current = null;
        }

        // 지도 인스턴스 정리
        if (mapInstanceRef.current) {
          mapInstanceRef.current = null;
        }

        // 전역 함수 정리
        if (window.initMap) {
          delete window.initMap;
        }
      } catch (error) {
        console.warn('Error during component cleanup:', error);
      }
    };
  }, []);

  return (
    <div
      ref={mapRef}
      style={{
        width: '100%',
        height: '100%',
        cursor: 'pointer',
        position: 'relative',
      }}
    />
  );
};