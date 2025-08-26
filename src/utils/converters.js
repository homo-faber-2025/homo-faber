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
    'medical_device': '의료기기',
    'printing_post-processing': '인쇄 후처리',
    'culture': '문화',
    'IT': 'IT',
    'design': '디자인',
    'press': '프레스',
    'clock': '시계',
    'building_material': '건축 자재',
    'video': '비디오',
    'etc': '기타',
    'F&B': 'F&B',
    'tool': '도구',
    'sound': '사운드',
    'teaching_aids': '교육 자료',
    'arcade_console': '아케이드 콘솔',
    'electron': '전자',
    'chemistry': '화학',
    'electricity': '전기',
    'jewelry': '주얼리',
    'rubber&acrylic': '고무 및 아크릴',
    'machine': '기계',
    // 재료 타입 매핑을 여기에 추가할 수 있습니다
  };

  return nameMap[englishName] || englishName;
} 