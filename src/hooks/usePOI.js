import { useEffect } from 'react';

export function usePOI(stores) {
  useEffect(() => {
    if (!stores || typeof Module === 'undefined') return;

    // POI 레이어 생성
    const layerList = new Module.JSLayerList(true);
    const layer = layerList.createLayer("STORE_POI_LAYER", Module.ELT_3DPOINT);

    const SIZE_OPTIONS = [120, 150, 180, 200];
    const LINE_HEIGHT_OPTIONS = [10, 20, 30, 40];
    const LINE_COLOR = new Module.JSColor(255, 255, 255);

    // 그림자 설정
    const SHADOW_COLOR = 'rgba(255, 255, 255, 0.8)';
    const SHADOW_BLUR = 10;
    const SHADOW_OFFSET_X = 1;
    const SHADOW_OFFSET_Y = 2;
    const PADDING = SHADOW_BLUR + Math.max(SHADOW_OFFSET_X, SHADOW_OFFSET_Y); 

    // stores가 변경될 때마다 모든 POI를 새로 생성
    stores.forEach(store => {
      if (!store.latitude || !store.longitude) return;

      const poi = Module.createPoint(`store_${store.id}`);
      poi.setPosition(new Module.JSVector3D(store.longitude, store.latitude, 20));

      const randomMaxSize = SIZE_OPTIONS[Math.floor(Math.random() * SIZE_OPTIONS.length)];
      const randomLineHeight = LINE_HEIGHT_OPTIONS[Math.floor(Math.random() * LINE_HEIGHT_OPTIONS.length)];

      if (store.thumbnail_img) {
        const img = new Image();
        img.crossOrigin = "anonymous";

        img.onload = function () {
          const originalWidth = this.width;
          const originalHeight = this.height;

          const ratio = Math.min(
            randomMaxSize / originalWidth,
            randomMaxSize / originalHeight
          );

          const newWidth = Math.round(originalWidth * ratio);
          const newHeight = Math.round(originalHeight * ratio);

          // 그림자를 위한 여백을 포함한 캔버스 생성
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = newWidth + (PADDING * 2);
          canvas.height = newHeight + (PADDING * 2);

          // 그림자 설정
          ctx.shadowColor = SHADOW_COLOR;
          ctx.shadowBlur = SHADOW_BLUR;
          ctx.shadowOffsetX = SHADOW_OFFSET_X;
          ctx.shadowOffsetY = SHADOW_OFFSET_Y;

          // 이미지를 패딩을 고려하여 중앙에 그리기
          ctx.drawImage(
            img,
            PADDING,
            PADDING,
            newWidth,
            newHeight
          );

          // POI 설정
          poi.setImage(
            ctx.getImageData(0, 0, canvas.width, canvas.height).data,
            canvas.width,
            canvas.height
          );
          poi.setText(store.name);
          poi.setPositionLine(randomLineHeight, LINE_COLOR);
          layer.addObject(poi, 0);
        };

        img.src = store.thumbnail_img;
      } else {
        poi.setText(store.name);
        poi.setPositionLine(randomLineHeight, LINE_COLOR);
        layer.addObject(poi, 0);
      }
    });

    return () => {
      if (layer) {
        layer.clear();
      }
    };
  }, [stores]);
}