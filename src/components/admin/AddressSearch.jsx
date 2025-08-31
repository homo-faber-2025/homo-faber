import { useState, useEffect } from 'react';
import DaumPostcodeEmbed from 'react-daum-postcode';

export default function AddressSearch({ register, setValue, setAddress }) {
  const [isOpen, setIsOpen] = useState(false);
  const [kakaoLoaded, setKakaoLoaded] = useState(false);

  useEffect(() => {
    if (window.kakao?.maps?.services) {
      setKakaoLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JS_KEY}&libraries=services&autoload=false`;

    script.onload = () => {
      window.kakao.maps.load(() => {
        setKakaoLoaded(!!window.kakao.maps.services);
      });
    };

    document.head.appendChild(script);
    return () =>
      document.head.contains(script) && document.head.removeChild(script);
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
          resolve({
            latitude: parseFloat(result[0].y),
            longitude: parseFloat(result[0].x),
          });
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

    setValue('address', fullAddress);
    setValue('latitude', coords.latitude);
    setValue('longitude', coords.longitude);
    setAddress(fullAddress);
    setIsOpen(false);
  };

  return (
    <>
      <input
        placeholder="주소를 검색해주세요."
        {...register('address', { required: '주소는 필수 입력 항목입니다.' })}
        onClick={() => setIsOpen(!isOpen)}
        readOnly
      />
      {isOpen && <DaumPostcodeEmbed onComplete={handleComplete} />}
    </>
  );
}
