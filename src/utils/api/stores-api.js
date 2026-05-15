/**
 * API 라우트를 통한 스토어 관련 함수들
 * 서버사이드에서 실행되어 보안이 강화됨
 */

/**
 * 모든 스토어를 가져옵니다.
 * @param {string} searchKeyword - 검색 키워드 (선택사항)
 * @param {number} limit - 가져올 개수 (기본값: 20)
 * @param {number} offset - 시작 위치 (기본값: 0)
 * @returns {Promise<Object>} { data: 스토어 목록, pagination: 페이지네이션 정보 }
 */
export async function getStores(searchKeyword = '', limit = 20, offset = 0) {
  try {
    const params = new URLSearchParams();
    if (searchKeyword && searchKeyword.trim() !== '') {
      params.append('search', searchKeyword.trim());
    }
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());

    const response = await fetch(`/api/stores?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '스토어 목록을 불러오는 중 오류가 발생했습니다.');
    }

    const result = await response.json();
    return {
      data: result.data || [],
      pagination: result.pagination || { total: 0, limit, offset, hasMore: false }
    };
  } catch (error) {
    console.error('API Error (getStores):', error);
    throw error;
  }
}

/**
 * 특정 스토어를 가져옵니다.
 * @param {string} storeId - 스토어 ID
 * @returns {Promise<Object>} 스토어 데이터
 */
export async function getStoreById(storeId) {
  try {
    if (!storeId) {
      throw new Error('스토어 ID가 필요합니다.');
    }

    const response = await fetch(`/api/stores/${storeId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 404) {
        throw new Error('스토어를 찾을 수 없습니다.');
      }
      throw new Error(errorData.error || '스토어 정보를 불러오는 중 오류가 발생했습니다.');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('API Error (getStoreById):', error);
    throw error;
  }
}

/**
 * 스토어를 생성합니다.
 * @param {Object} storeData - 스토어 데이터
 * @returns {Promise<Object>} 생성된 스토어 데이터
 */
export async function createStore(storeData) {
  try {
    const response = await fetch('/api/stores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(storeData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '스토어 생성 중 오류가 발생했습니다.');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('API Error (createStore):', error);
    throw error;
  }
}

/**
 * 스토어를 업데이트합니다.
 * @param {string} storeId - 스토어 ID
 * @param {Object} updateData - 업데이트할 데이터
 * @returns {Promise<Object>} 업데이트된 스토어 데이터
 */
export async function updateStore(storeId, updateData) {
  try {
    if (!storeId) {
      throw new Error('스토어 ID가 필요합니다.');
    }

    const response = await fetch(`/api/stores/${storeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '스토어 업데이트 중 오류가 발생했습니다.');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('API Error (updateStore):', error);
    throw error;
  }
}

/**
 * 스토어를 삭제합니다.
 * @param {string} storeId - 스토어 ID
 * @returns {Promise<boolean>} 삭제 성공 여부
 */
export async function deleteStore(storeId) {
  try {
    if (!storeId) {
      throw new Error('스토어 ID가 필요합니다.');
    }

    const response = await fetch(`/api/stores/${storeId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '스토어 삭제 중 오류가 발생했습니다.');
    }

    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('API Error (deleteStore):', error);
    throw error;
  }
}

/**
 * 모든 타입 정보를 가져옵니다.
 * @returns {Promise<Object>} 타입 정보 (industryTypes, capacityTypes, materialTypes)
 */
export async function getStoreTypes() {
  try {
    const response = await fetch('/api/stores/types', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '타입 정보를 불러오는 중 오류가 발생했습니다.');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('API Error (getStoreTypes):', error);
    throw error;
  }
}
