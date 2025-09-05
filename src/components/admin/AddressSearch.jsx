import { useState, useEffect } from 'react';
import DaumPostcodeEmbed from 'react-daum-postcode';

export default function AddressSearch({ register, setValue, setAddress, fieldPrefix = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [kakaoLoaded, setKakaoLoaded] = useState(false);

  useEffect(() => {
    if (window.kakao?.maps?.services) {
      setKakaoLoaded(true);
      return;
    }

    // Kakao API 키가 없으면 로드하지 않음
    if (!process.env.NEXT_PUBLIC_KAKAO_JS_KEY) {
      console.warn('Kakao API 키가 설정되지 않았습니다. NEXT_PUBLIC_KAKAO_JS_KEY 환경변수를 확인해주세요.');
      return;
    }

    // 이미 스크립트가 로드 중인지 확인
    const existingScript = document.querySelector('script[src*="dapi.kakao.com"]');
    if (existingScript) {
      const checkLoaded = () => {
        if (window.kakao?.maps?.services) {
          setKakaoLoaded(true);
        } else {
          setTimeout(checkLoaded, 100);
        }
      };
      checkLoaded();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JS_KEY}&libraries=services&autoload=false`;

    console.log('Kakao 스크립트 로드 시작:', script.src);
    console.log('API 키 존재 여부:', !!process.env.NEXT_PUBLIC_KAKAO_JS_KEY);

    script.onload = () => {
      console.log('Kakao 스크립트 로드 완료');
      if (window.kakao?.maps?.load) {
        window.kakao.maps.load(() => {
          console.log('Kakao Maps API 초기화 완료');
          setKakaoLoaded(!!window.kakao.maps.services);
        });
      } else {
        console.error('Kakao Maps API가 제대로 로드되지 않았습니다.');
        console.error('window.kakao 상태:', window.kakao);
      }
    };

    script.onerror = (error) => {
      console.error('Kakao 스크립트 로드 실패:', error);
      console.error('에러 상세 정보:', {
        message: error.message,
        filename: error.filename,
        lineno: error.lineno,
        colno: error.colno,
        stack: error.stack
      });
    };

    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const convertAddressToCoords = (address) => {
    return new Promise((resolve) => {
      if (!kakaoLoaded || !window.kakao?.maps?.services?.Geocoder) {
        resolve({ latitude: null, longitude: null });
        return;
      }

      const geocoder = new window.kakao.maps.services.Geocoder();

      geocoder.addressSearch(address, (result, status) => {
        if (
          status === window.kakao.maps.services.Status.OK &&
          result.length > 0
        ) {
          const coords = {
            latitude: parseFloat(result[0].y),
            longitude: parseFloat(result[0].x),
          };
          resolve(coords);
        } else {
          resolve({ latitude: null, longitude: null });
        }
      });
    });
  };

  const handleComplete = async (data) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname) extraAddress += data.bname;
      if (data.buildingName) {
        extraAddress += extraAddress
          ? `, ${data.buildingName}`
          : data.buildingName;
      }
      if (extraAddress) fullAddress += ` (${extraAddress})`;
    }

    const coords = await convertAddressToCoords(fullAddress);

    const fieldNames = {
      address: fieldPrefix ? `${fieldPrefix}address` : 'address',
      latitude: fieldPrefix ? `${fieldPrefix}latitude` : 'latitude',
      longitude: fieldPrefix ? `${fieldPrefix}longitude` : 'longitude'
    };

    setValue(fieldNames.address, fullAddress);
    setValue(fieldNames.latitude, coords.latitude);
    setValue(fieldNames.longitude, coords.longitude);

    if (!fieldPrefix) {
      setAddress(fullAddress);
    }

    setIsOpen(false);
  };

  return (
    <>
      <input
        placeholder="주소를 검색해주세요."
        {...register(fieldPrefix ? `${fieldPrefix}address` : 'address', { required: '주소는 필수 입력 항목입니다.' })}
        onClick={() => setIsOpen(!isOpen)}
        readOnly
      />
      {isOpen && <DaumPostcodeEmbed onComplete={handleComplete} />}
    </>
  );
}

