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
          container: document.getElementById('map'),
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
          new Module.JSVector3D(126.9958537267327, 37.56628736129694, 500)
        );
        Module.getViewCamera().setDirect(24);
        Module.getViewCamera().setFov(45);

        setTimeout(() =>
          Module.getViewCamera().moveOval(new Module.JSVector3D(126.9958537267327, 37.56628736129694, 40.496476641856134), 10, 24, 1),
          // Module.getViewCamera().setTilt(10), 
          3000);


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

    // Cleanup the script on component unmount
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div id="map" style={{ width: '100%', height: '100vh' }}></div>
  );
};

export default Map3D;
