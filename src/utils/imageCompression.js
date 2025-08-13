/**
 * 이미지 압축 유틸 함수
 * 1MB를 넘는 이미지를 압축하여 1MB 이하로 만듭니다.
 */

/**
 * 이미지 파일을 압축합니다.
 * @param {File} file - 압축할 이미지 파일
 * @param {number} maxSizeInMB - 최대 파일 크기 (MB 단위, 기본값: 1)
 * @param {number} quality - 압축 품질 (0.1 ~ 1.0, 기본값: 0.8)
 * @returns {Promise<File>} 압축된 이미지 파일
 */
export const compressImage = (file, maxSizeInMB = 1, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    // 파일이 이미지인지 확인
    if (!file.type.startsWith('image/')) {
      resolve(file); // 이미지가 아니면 그대로 반환
      return;
    }

    const maxSizeInBytes = maxSizeInMB * 1024 * 1024; // MB를 바이트로 변환

    // 파일 크기가 이미 최대 크기보다 작으면 압축하지 않음
    if (file.size <= maxSizeInBytes) {
      resolve(file);
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // 원본 이미지 크기
      let { width, height } = img;

      // 이미지 크기 조정 (너무 큰 경우)
      const maxDimension = 1920; // 최대 너비/높이
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = (height * maxDimension) / width;
          width = maxDimension;
        } else {
          width = (width * maxDimension) / height;
          height = maxDimension;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // 이미지를 캔버스에 그리기
      ctx.drawImage(img, 0, 0, width, height);

      // 압축된 이미지를 Blob으로 변환
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('이미지 압축에 실패했습니다.'));
            return;
          }

          // 압축된 파일 크기가 여전히 크면 품질을 더 낮춰서 재압축
          if (blob.size > maxSizeInBytes && quality > 0.1) {
            const newQuality = quality - 0.1;
            canvas.toBlob(
              (newBlob) => {
                if (newBlob) {
                  const compressedFile = new File([newBlob], file.name, {
                    type: file.type,
                    lastModified: Date.now(),
                  });
                  resolve(compressedFile);
                } else {
                  reject(new Error('이미지 재압축에 실패했습니다.'));
                }
              },
              file.type,
              newQuality
            );
          } else {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          }
        },
        file.type,
        quality
      );
    };

    img.onerror = () => {
      reject(new Error('이미지 로드에 실패했습니다.'));
    };

    // File을 Data URL로 변환하여 이미지 로드
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target.result;
    };
    reader.onerror = () => {
      reject(new Error('파일 읽기에 실패했습니다.'));
    };
    reader.readAsDataURL(file);
  });
};

/**
 * 이미지 파일의 크기를 확인하고 필요시 압축합니다.
 * @param {File} file - 확인할 이미지 파일
 * @param {number} maxSizeInMB - 최대 파일 크기 (MB 단위, 기본값: 1)
 * @returns {Promise<File>} 압축된 이미지 파일 또는 원본 파일
 */
export const checkAndCompressImage = async (file, maxSizeInMB = 1) => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

  if (file.size <= maxSizeInBytes) {
    return file; // 압축 불필요
  }

  try {
    console.log(`이미지 압축 중... (원본: ${(file.size / 1024 / 1024).toFixed(2)}MB)`);
    const compressedFile = await compressImage(file, maxSizeInMB);
    console.log(`압축 완료: ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
    return compressedFile;
  } catch (error) {
    console.error('이미지 압축 실패:', error);
    return file; // 압축 실패시 원본 반환
  }
};

/**
 * 이미지 파일의 정보를 로그로 출력합니다.
 * @param {File} file - 확인할 이미지 파일
 * @param {string} label - 로그 라벨
 */
export const logImageInfo = (file, label = '이미지') => {
  const sizeInMB = (file.size / 1024 / 1024).toFixed(2);
  console.log(`${label}: ${file.name} (${sizeInMB}MB, ${file.type})`);
};
