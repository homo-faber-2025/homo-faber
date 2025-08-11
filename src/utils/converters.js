/**
 * 영어 업종명을 한글로 변환하는 함수
 * @param {string} englishName - 영어 업종명
 * @returns {string} - 한글 업종명
 */
export function convertIndustryNameToKorean(englishName) {
  const nameMap = {
    'manufacturing': '제조',
    'distribution': '유통',
    // 추가 업종명 매핑을 여기에 추가할 수 있습니다
  };

  return nameMap[englishName] || englishName;
}

/**
 * 영어 용량 타입을 한글로 변환하는 함수
 * @param {string} englishName - 영어 용량 타입명
 * @returns {string} - 한글 용량 타입명
 */
export function convertCapacityNameToKorean(englishName) {
  const nameMap = {
    '소량 생산': '개인 및 학생 작업 가능',
    // 용량 타입 매핑을 여기에 추가할 수 있습니다
  };

  return nameMap[englishName] || englishName;
}

/**
 * 영어 재료 타입을 한글로 변환하는 함수
 * @param {string} englishName - 영어 재료 타입명
 * @returns {string} - 한글 재료 타입명
 */
export function convertMaterialNameToKorean(englishName) {
  const nameMap = {
    // 재료 타입 매핑을 여기에 추가할 수 있습니다
  };

  return nameMap[englishName] || englishName;
} 