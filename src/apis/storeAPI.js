// 가게 관련 API 함수들
const API_BASE_URL = 'https://buynow.n-e.kr'; // TODO: 실제 백엔드 서버 URL로 변경 필요

/**
 * 가게 목록 조회
 * @returns {Promise<Array>} 가게 목록
 */
export const fetchStores = async () => {
  try {
    console.log('가게 목록 조회 시작...');
    
    const response = await fetch(`${API_BASE_URL}/stores`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const stores = await response.json();
    console.log('가게 목록 조회 성공:', stores.length, '개');
    
    return stores;
  } catch (error) {
    console.error('가게 목록 조회 실패:', error);
    throw error;
  }
};

/**
 * 가게 상세 조회
 * @param {number} storeId - 가게 ID
 * @returns {Promise<Object>} 가게 상세 정보
 */
export const fetchStoreById = async (storeId) => {
  try {
    console.log(`가게 상세 조회 시작... (ID: ${storeId})`);
    
    const response = await fetch(`${API_BASE_URL}/stores?store_id=${storeId}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`가게를 찾을 수 없습니다. (ID: ${storeId})`);
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const store = await response.json();
    console.log('가게 상세 조회 성공:', store.store_name);
    
    return store;
  } catch (error) {
    console.error('가게 상세 조회 실패:', error);
    throw error;
  }
};

/**
 * 카테고리별 가게 조회
 * @param {string} category - 가게 카테고리
 * @returns {Promise<Array>} 카테고리별 가게 목록
 */
export const fetchStoresByCategory = async (category) => {
  try {
    console.log(`카테고리별 가게 조회 시작... (카테고리: ${category})`);
    
    const response = await fetch(`${API_BASE_URL}/stores?store_category=${encodeURIComponent(category)}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const stores = await response.json();
    console.log('카테고리별 가게 조회 성공:', stores.length, '개');
    
    return stores;
  } catch (error) {
    console.error('카테고리별 가게 조회 실패:', error);
    throw error;
  }
};

/**
 * 활성화된 가게만 조회
 * @returns {Promise<Array>} 활성화된 가게 목록
 */
export const fetchActiveStores = async () => {
  try {
    console.log('활성화된 가게 조회 시작...');
    
    const response = await fetch(`${API_BASE_URL}/stores?is_active=true`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const stores = await response.json();
    console.log('활성화된 가게 조회 성공:', stores.length, '개');
    
    return stores;
  } catch (error) {
    console.error('활성화된 가게 조회 실패:', error);
    throw error;
  }
};

/**
 * 가게 운영자별 가게 조회
 * @param {string} ownerId - 가게 운영자 ID
 * @returns {Promise<Array>} 운영자별 가게 목록
 */
export const fetchStoresByOwner = async (ownerId) => {
  try {
    console.log(`운영자별 가게 조회 시작... (운영자 ID: ${ownerId})`);
    
    const response = await fetch(`${API_BASE_URL}/stores?store_owner_id=${encodeURIComponent(ownerId)}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const stores = await response.json();
    console.log('운영자별 가게 조회 성공:', stores.length, '개');
    
    return stores;
  } catch (error) {
    console.error('운영자별 가게 조회 실패:', error);
    throw error;
  }
}; 