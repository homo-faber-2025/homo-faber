import { useEffect } from 'react';

export function usePOI(stores) {
  useEffect(() => {
    // Module이 준비될 때까지 기다리는 함수
    const waitForModule = () => {
      if (typeof Module === 'undefined' || !Module.JSLayerList) {
        setTimeout(waitForModule, 100);
        return;
      }

      createPOIs();
    };

    const createPOIs = () => {
      if (!stores || !Array.isArray(stores) || stores.length === 0) {
        return;
      }

      try {
        // POI 레이어 생성
        const layerList = new Module.JSLayerList(true);
        const layer = layerList.createLayer(
          'STORE_POI_LAYER',
          Module.ELT_3DPOINT,
        );

        const SIZE_OPTIONS = [120, 150, 180, 200];
        const LINE_HEIGHT_OPTIONS = [10, 20, 30, 40];
        const LINE_COLOR = new Module.JSColor(255, 255, 255);

        // 그림자 설정
        const SHADOW_COLOR = 'rgba(255, 255, 255, 0.8)';
        const SHADOW_BLUR = 10;
        const SHADOW_OFFSET_X = 1;
        const SHADOW_OFFSET_Y = 2;
        const PADDING =
          SHADOW_BLUR + Math.max(SHADOW_OFFSET_X, SHADOW_OFFSET_Y);

        console.log(`POI 생성 시작: ${stores.length}개`);

        // stores 처리
        stores.forEach((store, index) => {
          if (!store.latitude || !store.longitude) return;

          const poi = Module.createPoint(`store_${store.id || index}`);
          poi.setPosition(
            new Module.JSVector3D(
              Number(store.longitude),
              Number(store.latitude),
              20,
            ),
          );

          const randomMaxSize =
            SIZE_OPTIONS[Math.floor(Math.random() * SIZE_OPTIONS.length)];
          const randomLineHeight =
            LINE_HEIGHT_OPTIONS[
            Math.floor(Math.random() * LINE_HEIGHT_OPTIONS.length)
            ];

          if (store.thumbnail_img) {
            const img = new Image();
            img.crossOrigin = 'anonymous';

            img.onload = function () {
              try {
                const originalWidth = this.width;
                const originalHeight = this.height;

                const ratio = Math.min(
                  randomMaxSize / originalWidth,
                  randomMaxSize / originalHeight,
                );

                const newWidth = Math.round(originalWidth * ratio);
                const newHeight = Math.round(originalHeight * ratio);

                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = newWidth + PADDING * 2;
                canvas.height = newHeight + PADDING * 2;

                ctx.shadowColor = SHADOW_COLOR;
                ctx.shadowBlur = SHADOW_BLUR;
                ctx.shadowOffsetX = SHADOW_OFFSET_X;
                ctx.shadowOffsetY = SHADOW_OFFSET_Y;

                ctx.drawImage(img, PADDING, PADDING, newWidth, newHeight);

                poi.setImage(
                  ctx.getImageData(0, 0, canvas.width, canvas.height).data,
                  canvas.width,
                  canvas.height,
                );
                poi.setText(store.name);
                poi.setPositionLine(randomLineHeight, LINE_COLOR);
                layer.addObject(poi, 0);
              } catch (error) {
                console.warn(`이미지 POI 실패: ${store.name}`, error);
              }
            };

            img.onerror = function () {
              // 이미지 실패 시 텍스트만
              poi.setText(store.name);
              poi.setPositionLine(randomLineHeight, LINE_COLOR);
              layer.addObject(poi, 0);
            };

            img.src = store.thumbnail_img;
          } else {
            // 텍스트만
            poi.setText(store.name);
            poi.setPositionLine(randomLineHeight, LINE_COLOR);
            layer.addObject(poi, 0);
          }
        });

        console.log('POI 생성 완료');
      } catch (error) {
        console.error('POI 생성 실패:', error);
      }
    };

    // stores가 있으면 Module 기다리기 시작
    if (stores && stores.length > 0) {
      waitForModule();
    }
  }, [stores]);
}