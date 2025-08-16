// 가게 관련 API 함수들
const REST_API_BASE_URL = 'https://buynow.n-e.kr'; // TODO: 실제 백엔드 서버 URL로 변경 필요

/**
 * 현재 시간을 API time 파라미터로 변환 (0~36)
 * @returns {number} time 파라미터 값
 */
const getCurrentTimeParam = () => {
  const now = new Date();
  const hour = now.getHours();
  return hour; // 0~23 범위
};

/**
 * 백엔드 API 응답을 UI 구조로 변환
 * @param {Array} apiData - 백엔드 API 응답 데이터
 * @returns {Array} UI 구조로 변환된 데이터
 */
const transformApiData = (apiData) => {
  return apiData.map(store => ({
    id: store.store_id,
    name: store.store_name,
    menu: store.menu_name,
    distance: store.distance,
    walkTime: store.on_foot,
    time: store.time || null, // 백서버에서 받아온 time 필드 (0~36), 없으면 null
    isLiked: store.is_liked,
    category: store.store_category || null,
    // 메뉴 정보를 기존 UI 구조에 맞게 변환
    menus: [{
      id: store.menu_id,
      name: store.max_discount_menu,
      discountRate: store.max_discount_rate,
      originalPrice: store.max_discount_price_origin,
      discountPrice: store.max_discount_price,
      isReserved: false
    }],
    // 디자이너 정보는 현재 API에 없으므로 빈 배열
    designers: [],
    hasDesigners: false
  }));
};

/**
 * 가게 목록 조회
 * @param {string} time - 시간 필터 (HH:MM 형식)
 * @param {string} category - 업종 필터 (선택)
 * @returns {Promise<Array>} 가게 목록
 */
export const fetchStores = async (time, category = null) => {
  try {
    console.log('가게 목록 조회 시작...');
    console.log(time);
    
    // time 파라미터를 0~36 정수로 변환
    let timeParam;
    if (time !== null) {
      // time이 문자열(HH:MM)인 경우와 숫자인 경우 모두 처리
      if (typeof time === 'string') {
        const [hour, minute] = time.split(':').map(Number);
        timeParam = hour; // 0~23 범위
      } else {
        // time이 이미 숫자인 경우
        timeParam = time;
      }
    } else {
      timeParam = getCurrentTimeParam();
    }
    
    // URL 구성
    let url = `${REST_API_BASE_URL}/v1/stores/?time=${timeParam}`;
    if (category) {
      url += `&store_category=${category}`;
    }
    
    console.log('API 호출 URL:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const stores = await response.json();
    console.log('가게 목록 조회 성공:', stores.length, '개');
    
    // 백엔드 응답을 UI 구조로 변환
    const transformedStores = transformApiData(stores);
    return transformedStores;
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
    
    const response = await fetch(`${REST_API_BASE_URL}/stores?store_id=${storeId}`);
    
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
    
    const response = await fetch(`${REST_API_BASE_URL}/stores?store_category=${encodeURIComponent(category)}`);
    
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
    
    const response = await fetch(`${REST_API_BASE_URL}/stores?is_active=true`);
    
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
    
    const response = await fetch(`${REST_API_BASE_URL}/stores?store_owner_id=${encodeURIComponent(ownerId)}`);
    
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