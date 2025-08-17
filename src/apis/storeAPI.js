// 가게 관련 API 함수들
const REST_API_BASE_URL = 'https://buynow.n-e.kr';



/**
 * 시간 파라미터를 API 형식으로 변환
 * @param {string|number|null} time - 시간 (HH:MM 형식 문자열, 숫자, 또는 null)
 * @returns {number} API time 파라미터 (0~23)
 */
const convertTimeToParam = (time) => {
  if (time === null) {
    return new Date().getHours();
  }
  
  if (typeof time === 'string') {
    // 백엔드 요청 ( time 0~36으로 반환, 다음날(24~36) ) 
    if(parseInt(new Date().getHours()) > 12 & parseInt(time.split(':')[0]) / 12 < 1) return (parseInt(time.split(':')[0]) + 24);

    return parseInt(time.split(':')[0]);
  }
  
  return time;
};

/**
 * API URL 구성
 * @param {number} timeParam - 시간 파라미터
 * @param {string|null} category - 카테고리 파라미터
 * @returns {string} 완성된 API URL
 */
const buildUrl = (timeParam, category = null) => {
  let url = `${REST_API_BASE_URL}/v1/stores/?time=${timeParam}`;
  if (category) {
    url += `&store_category=${category}`;
  }
  return url;
};

/**
 * API 요청 헤더 구성
 * @param {string|null} accessToken - 액세스 토큰
 * @returns {Object} 요청 헤더 객체
 */
const buildHeaders = (accessToken = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }
  
  return headers;
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
    // 메뉴 정보를 백엔드 변수명으로 변환
    menus: [{
      menu_id: store.menu_id,
      menu_name: store.max_discount_menu,
      discount_rate: store.max_discount_rate,
      menu_price: store.max_discount_price_origin,
      discounted_price: store.max_discount_price,
      is_available: true
    }],
    // 디자이너 정보는 현재 API에 없으므로 빈 배열
    designers: [],
    hasDesigners: false
  }));
};

/**
 * 가게 목록 조회
 * @param {string|number|null} time - 시간 필터 (HH:MM 형식, 숫자, 또는 null)
 * @param {string|null} category - 업종 필터 (선택)
 * @param {string|null} accessToken - 액세스 토큰
 * @returns {Promise<Array>} 가게 목록
 */
export const fetchStoresFromAPI = async (time, category = null, accessToken = null) => {
  try {
    console.log('가게 목록 조회 시작...');
    console.log('time:', time);
    console.log('category:', category);
    console.log('accessToken:', accessToken ? `${accessToken.substring(0, 20)}...` : 'null');
    
    // 시간 파라미터 변환
    const timeParam = convertTimeToParam(time);
    console.log('백엔드에 전송된 timeParam', timeParam);
    
    // URL 구성
    const url = buildUrl(timeParam, category);
    console.log('API 호출 URL:', url);
    
    // 헤더 구성
    const headers = buildHeaders(accessToken);
    console.log('요청 헤더:', headers);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    });
    
    console.log('response status:', response.status);
    console.log('response ok:', response.ok);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API 응답 에러:', errorData);
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
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

/**
 * 사용자 찜 목록 조회
 * @param {number} time - 시간 필터 (0~23)
 * @param {string} category - 업종 필터 (선택)
 * @param {string} accessToken - 액세스 토큰
 * @returns {Promise<Array>} 찜한 가게 목록
 */
export const fetchUserLikes = async (time, category = null, accessToken) => {
  try {
    console.log('사용자 찜 목록 조회 시작...');
    
    // URL 구성
    let url = `${REST_API_BASE_URL}/v1/reservations/userlikes/?time=${time}`;
    if (category) {
      url += `&store_category=${category}`;
    }
    
    console.log('찜 조회 API 호출 URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    const likes = await response.json();
    console.log('사용자 찜 목록 조회 성공:', likes.length, '개');
    
    return likes;
  } catch (error) {
    console.error('사용자 찜 목록 조회 실패:', error);
    throw error;
  }
};

/**
 * 찜 생성
 * @param {number} store_id - 가게 ID
 * @param {string} accessToken - 액세스 토큰
 * @returns {Promise<Object>} 생성된 찜 정보
 */
export const createLike = async (store_id, accessToken) => {
  try {
    console.log(`찜 생성 시작... (가게 ID: ${store_id})`);
    console.log('요청 URL:', `${REST_API_BASE_URL}/v1/reservations/userlikes/`);
    console.log('요청 헤더:', {
      'Authorization': `Bearer ${accessToken ? accessToken.substring(0, 20) + '...' : 'null'}`,
      'Content-Type': 'application/json',
    });
    
    // 현재 시간을 time 파라미터로 추가
    const currentTime = new Date().getHours();
    const requestData = {
      store_id: parseInt(store_id),
      time: currentTime
    };
    
    console.log('요청 데이터:', requestData);
    
    const response = await fetch(`${REST_API_BASE_URL}/v1/reservations/userlikes/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('찜 생성 에러 응답:', errorData);
      console.error('요청 데이터:', requestData);
      throw new Error(errorData.message || errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    const like = await response.json();
    console.log('찜 생성 성공:', like.like_id);
    
    return like;
  } catch (error) {
    console.error('찜 생성 실패:', error);
    throw error;
  }
};

/**
 * 찜 삭제
 * @param {number} like_id - 찜 ID
 * @param {string} accessToken - 액세스 토큰
 * @returns {Promise<void>}
 */
export const deleteLike = async (like_id, accessToken) => {
  try {
    console.log(`찜 삭제 시작... (찜 ID: ${like_id})`);
    console.log('전달받은 accessToken:', accessToken ? `${accessToken.substring(0, 20)}...` : 'null');
    
    const response = await fetch(`${REST_API_BASE_URL}/v1/reservations/userlikes/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        like_id: like_id,
      }),
    });
    
    console.log('삭제 요청 헤더:', {
      'Authorization': `Bearer ${accessToken ? accessToken.substring(0, 20) + '...' : 'null'}`,
      'Content-Type': 'application/json',
    });
    console.log('삭제 요청 body:', { like_id: like_id });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('삭제 응답 에러:', errorData);
      throw new Error(errorData.message || errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    console.log('찜 삭제 성공');
  } catch (error) {
    console.error('찜 삭제 실패:', error);
    throw error;
  }
}; 

/**
 * 특정 Store의 Space 개수 및 id 조회
 * @param {number} store_id - 가게 ID
 * @param {number} time - 시간 파라미터 (0~36)
 * @param {string|null} accessToken - 액세스 토큰
 * @returns {Promise<Object>} Space 개수와 ID 목록
 */
export const fetchStoreSpaces = async (store_id, time, accessToken = null) => {
  try {
    console.log(`Store Space 개수 조회 시작... (Store ID: ${store_id}, Time: ${time})`);
    
    const headers = buildHeaders(accessToken);
    const response = await fetch(`${REST_API_BASE_URL}/v1/stores/${store_id}/?time=${time}`, {
      method: 'GET',
      headers: headers,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Store Space 조회 에러:', errorData);
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Store Space 조회 성공:', data);
    
    return {
      count: data.count,
      space_ids: data.space_ids
    };
  } catch (error) {
    console.error('Store Space 조회 실패:', error);
    throw error;
  }
};

/**
 * 특정 Store의 Space 목록 조회 (Space가 2개 이상인 경우)
 * @param {number} store_id - 가게 ID
 * @param {number} time - 시간 파라미터 (0~36)
 * @param {string|null} accessToken - 액세스 토큰
 * @returns {Promise<Object>} 가게 정보와 Space 목록
 */
export const fetchStoreSpacesList = async (store_id, time, accessToken = null) => {
  try {
    console.log(`Store Space 목록 조회 시작... (Store ID: ${store_id}, Time: ${time})`);
    
    const headers = buildHeaders(accessToken);
    const response = await fetch(`${REST_API_BASE_URL}/v1/stores/${store_id}/spaces/?time=${time}`, {
      method: 'GET',
      headers: headers,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Store Space 목록 조회 에러:', errorData);
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Store Space 목록 조회 성공:', data);
    
    // UI 구조로 변환
    return {
      // 가게 정보
      store_id: store_id,
      store_name: data.store_name,
      store_category: data.store_category,
      store_address: data.store_address,
      store_image_url: data.store_image_url || null,
      store_description: data.store_description,
      distance: data.distance,
      on_foot: data.on_foot,
      is_liked: data.is_liked,
      like_id: data.like_id,
      // Space 목록을 designers 형태로 변환 (기존 UI 재활용)
      designers: data.spaces.map(space => ({
        space_id: space.space_id,
        space_name: space.space_name,
        space_image_url: space.space_image_url || null,
        max_discount_rate: space.max_discount_rate,
        is_possible: space.is_possible,
        // 기존 UI 구조에 맞게 빈 메뉴 배열 추가
        menus: []
      })),
      hasDesigners: true
    };
  } catch (error) {
    console.error('Store Space 목록 조회 실패:', error);
    throw error;
  }
}; 

/**
 * Space 1개인 경우 Store 메뉴 조회
 * @param {number} store_id - 가게 ID
 * @param {number} time - 시간 파라미터 (0~36)
 * @param {string|null} accessToken - 액세스 토큰
 * @returns {Promise<Object>} 가게 정보와 메뉴 목록
 */
export const fetchStoreMenus = async (store_id, time, accessToken = null) => {
  try {
    console.log(`Store 메뉴 조회 시작... (Store ID: ${store_id}, Time: ${time})`);
    
    const headers = buildHeaders(accessToken);
    const response = await fetch(`${REST_API_BASE_URL}/v1/stores/${store_id}/menus/?time=${time}`, {
      method: 'GET',
      headers: headers,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Store 메뉴 조회 에러:', errorData);
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Store 메뉴 조회 성공:', data);
    
    // UI 구조로 변환
    return {
      // 가게 정보
      store_id: store_id,
      store_name: data.store_name,
      store_address: data.store_address,
      store_image_url: data.store_image_url || null,
      store_description: data.store_description,
      distance: data.distance,
      on_foot: data.on_foot,
      is_liked: data.is_liked,
      like_id: data.like_id,
      // 메뉴 목록을 백엔드 변수명 그대로 사용
      menus: data.menus.map(menu => ({
        menu_id: menu.menu_id,
        menu_name: menu.menu_name,
        menu_image_url: menu.menu_image_url || null,
        item_id: menu.item_id,
        discount_rate: menu.discount_rate,
        discounted_price: menu.discounted_price,
        menu_price: menu.menu_price,
        is_available: menu.is_available
      })),
      hasDesigners: false
    };
  } catch (error) {
    console.error('Store 메뉴 조회 실패:', error);
    throw error;
  }
};

/**
 * Space 2개 이상인 경우 특정 Space 메뉴 조회
 * @param {number} space_id - Space ID
 * @param {number} time - 시간 파라미터 (0~36)
 * @param {string|null} accessToken - 액세스 토큰
 * @returns {Promise<Object>} Space 정보와 메뉴 목록
 */
export const fetchSpaceDetails = async (space_id, time, accessToken = null) => {
  try {
    console.log(`Space 메뉴 조회 시작... (Space ID: ${space_id}, Time: ${time})`);
    
    const headers = buildHeaders(accessToken);
    const response = await fetch(`${REST_API_BASE_URL}/v1/stores/spaces/${space_id}/details/?time=${time}`, {
      method: 'GET',
      headers: headers,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Space 메뉴 조회 에러:', errorData);
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Space 메뉴 조회 성공:', data);
    
    // UI 구조로 변환
    return {
      // Space 정보
      space_id: data.space_id,
      space_name: data.space_name,
      space_description: data.space_description,
      space_image_url: data.space_image_url || null,
      // 메뉴 목록을 백엔드 변수명 그대로 사용
      menus: data.menus.map(menu => ({
        menu_id: menu.menu_id,
        menu_name: menu.menu_name,
        menu_image_url: menu.menu_image_url || null,
        menu_price: menu.menu_price,
        item_id: menu.item_id,
        discount_rate: menu.discount_rate,
        discounted_price: menu.discounted_price,
        is_available: menu.is_available
      }))
    };
  } catch (error) {
    console.error('Space 메뉴 조회 실패:', error);
    throw error;
  }
}; 