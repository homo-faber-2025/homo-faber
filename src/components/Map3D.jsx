'use client';

import { useEffect } from 'react';

const Map3D = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.xdworld.kr/latest/XDWorldEM.js';
    script.async = true;
    script.onload = () => {
      Module.locateFile = function (s) {
        return `https://cdn.xdworld.kr/latest/${s}`;
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
          worker: {
            use: true,
            path: '/worker/XDWorldWorker.js',
            count: 5,
          },
          defaultKey:
            'DFG~EpIREQDmdJe1E9QpdBca#FBSDJFmdzHoe(fB4!e1E(JS1I==',
        });

        Module.getViewCamera().setLocation(
          new Module.JSVector3D(126.9958537267327, 37.56628736129694, 40.496476641856134)
        );
        Module.getViewCamera().setDirect(24);
        Module.getViewCamera().setFov(45);
        Module.getViewCamera().setTilt(10);

        // 구글 배경지도가 로딩속도가 빠름
        // 구글은 푸른색감 기본지도는 초록색감 -> 최종 디자인보고 결정
        var google = Module.GoogleMap();
        google.layername = "satellite";
        google.quality = "middle";
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

  return (
    <div id="map3D" style={{ width: '100dvw', height: '100dvh' }}></div>
  );
};

export default Map3D;
