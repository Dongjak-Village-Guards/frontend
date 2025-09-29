// 가게 관련 API 함수들
const REST_API_BASE_URL = 'https://buynow2.o-r.kr';

/**
 * 시간 파라미터를 API 형식으로 변환
 * @param {string|number|null} time - 시간 (HH:MM 형식 문자열, 숫자, 또는 null)
 * @returns {number} API time 파라미터 (0~23)
 */
export const convertTimeToParam = (time) => {

  if (time === null) {
    const currentHour = new Date().getHours();
    return currentHour;
  }
  
  if (typeof time === 'string') {
    const hour = parseInt(time.split(':')[0]);
    const currentHour = new Date().getHours();
    
    // 백엔드 요청 ( time 0~36으로 반환, 다음날(24~36) ) 
    if(currentHour > 12 && hour / 12 < 1) {
      const result = hour + 24;
      return result;
    }
    return hour;
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
    image: store.store_image_url || null, // 가게 이미지 추가
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
 * @param {string|number|null} time - 시간 필터 (HH:MM 형식, 숫자, 또는 null)
 * @param {string|null} category - 업종 필터 (선택)
 * @param {string|null} accessToken - 액세스 토큰
 * @param {Function|null} refreshTokens - 토큰 갱신 함수
 * @returns {Promise<Array>} 가게 목록
 */
export const fetchStoresFromAPI = async (time, category = null, accessToken = null, refreshTokens = null) => {
  try {
    // 시간 파라미터 변환
    const timeParam = convertTimeToParam(time);
    
    // URL 구성
    const url = buildUrl(timeParam, category);
    
    // 헤더 구성
    const headers = buildHeaders(accessToken);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    });
    
    if (!response.ok) {
      // 401 에러 처리 - 토큰 갱신 시도
      if (response.status === 401 && accessToken && refreshTokens) {
        console.log('401 에러 발생 - AccessToken이 만료되었습니다');
        console.log('RefreshToken으로 AccessToken 재발급 시도...');
        const refreshSuccess = await refreshTokens();
        if (refreshSuccess) {
          console.log('토큰 갱신 성공, API 재시도 중...');
          // 갱신된 토큰으로 재시도
          const { accessToken: newToken } = (await import('../hooks/user/useUserInfo')).default.getState();
          const newHeaders = buildHeaders(newToken);
          const retryResponse = await fetch(url, {
            method: 'GET',
            headers: newHeaders,
          });
          
          if (retryResponse.ok) {
            const stores = await retryResponse.json();
            console.log('토큰 갱신 후 가게 목록 조회 성공:', stores.length, '개');
            const transformedStores = transformApiData(stores);
            return transformedStores;
          } else {
            console.error('토큰 갱신 후에도 API 호출 실패:', retryResponse.status);
          }
        } else {
          console.error('토큰 갱신 실패 - 로그아웃이 필요합니다');
          // 토큰 갱신 실패 시 에러를 던져서 상위에서 로그아웃 처리하도록 함
          throw new Error('토큰 갱신 실패 - 로그인이 필요합니다');
        }
      }
      
      const errorData = await response.json().catch(() => ({}));
      console.error('API 응답 에러:', errorData);
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    const stores = await response.json();
    
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
    const response = await fetch(`${REST_API_BASE_URL}/stores?store_id=${storeId}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`가게를 찾을 수 없습니다. (ID: ${storeId})`);
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const store = await response.json();
    
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
    const response = await fetch(`${REST_API_BASE_URL}/stores?store_category=${encodeURIComponent(category)}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const stores = await response.json();
    
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
    const response = await fetch(`${REST_API_BASE_URL}/stores?is_active=true`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const stores = await response.json();
    
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
    const response = await fetch(`${REST_API_BASE_URL}/stores?store_owner_id=${encodeURIComponent(ownerId)}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const stores = await response.json();
    
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
 * @param {Function|null} refreshTokens - 토큰 갱신 함수
 * @returns {Promise<Array>} 찜한 가게 목록
 */
export const fetchUserLikes = async (time, category = null, accessToken, refreshTokens = null) => {
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
      // 401 에러 처리 - 토큰 갱신 시도
      if (response.status === 401 && accessToken && refreshTokens) {
        console.log('🚨 401 에러 발생 - AccessToken이 만료되었습니다 (찜 목록 조회)');
        console.log('🔄 RefreshToken으로 AccessToken 재발급 시도...');
        const refreshSuccess = await refreshTokens();
        if (refreshSuccess) {
          console.log('✅ 토큰 갱신 성공, 찜 목록 조회 API 재시도 중...');
          // 갱신된 토큰으로 재시도
          const { accessToken: newToken } = (await import('../hooks/user/useUserInfo')).default.getState();
          const retryResponse = await fetch(url, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${newToken}`,
              'Content-Type': 'application/json',
            },
          });
          
          if (retryResponse.ok) {
            const likes = await retryResponse.json();
            console.log('🎉 토큰 갱신 후 찜 목록 조회 성공:', likes.length, '개');
            return likes;
          } else {
            console.error('❌ 토큰 갱신 후에도 찜 목록 조회 실패:', retryResponse.status);
          }
        } else {
          console.error('❌ 토큰 갱신 실패 (찜 목록 조회) - 로그아웃이 필요합니다');
          throw new Error('토큰 갱신 실패 - 로그인이 필요합니다');
        }
      }
      
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
 * @param {number} storeId - 가게 ID
 * @param {string} accessToken - 액세스 토큰
 * @param {Function|null} refreshTokens - 토큰 갱신 함수
 * @returns {Promise<Object>} 생성된 찜 정보
 */
export const createLike = async (storeId, accessToken, refreshTokens = null) => {
  try {
    console.log(`찜 생성 시작... (가게 ID: ${storeId})`);
    
    const response = await fetch(`${REST_API_BASE_URL}/v1/reservations/userlikes/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        store_id: storeId,
      }),
    });
    
    if (!response.ok) {
      // 401 에러 처리 - 토큰 갱신 시도
      if (response.status === 401 && accessToken && refreshTokens) {
        console.log('🚨 401 에러 발생 - AccessToken이 만료되었습니다 (찜 생성)');
        console.log('🔄 RefreshToken으로 AccessToken 재발급 시도...');
        const refreshSuccess = await refreshTokens();
        if (refreshSuccess) {
          console.log('✅ 토큰 갱신 성공, 찜 생성 API 재시도 중...');
          // 갱신된 토큰으로 재시도
          const { accessToken: newToken } = (await import('../hooks/user/useUserInfo')).default.getState();
          const retryResponse = await fetch(`${REST_API_BASE_URL}/v1/reservations/userlikes/`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${newToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              store_id: storeId,
            }),
          });
          
          if (retryResponse.ok) {
            const like = await retryResponse.json();
            console.log('🎉 토큰 갱신 후 찜 생성 성공:', like.like_id);
            return like;
          } else {
            console.error('❌ 토큰 갱신 후에도 찜 생성 실패:', retryResponse.status);
          }
        } else {
          console.error('❌ 토큰 갱신 실패 (찜 생성) - 로그아웃이 필요합니다');
          throw new Error('토큰 갱신 실패 - 로그인이 필요합니다');
        }
      }
      
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
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
 * @param {number} likeId - 찜 ID
 * @param {string} accessToken - 액세스 토큰
 * @param {Function|null} refreshTokens - 토큰 갱신 함수
 * @returns {Promise<void>}
 */
export const deleteLike = async (likeId, accessToken, refreshTokens = null) => {
  try {
    console.log(`찜 삭제 시작... (찜 ID: ${likeId})`);
    console.log('전달받은 accessToken:', accessToken ? `${accessToken.substring(0, 20)}...` : 'null');
    
    const response = await fetch(`${REST_API_BASE_URL}/v1/reservations/userlikes/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        like_id: likeId,
      }),
    });
    
    console.log('삭제 요청 헤더:', {
      'Authorization': `Bearer ${accessToken ? accessToken.substring(0, 20) + '...' : 'null'}`,
      'Content-Type': 'application/json',
    });
    console.log('삭제 요청 body:', { like_id: likeId });
    
    if (!response.ok) {
      // 401 에러 처리 - 토큰 갱신 시도
      if (response.status === 401 && accessToken && refreshTokens) {
        console.log('🚨 401 에러 발생 - AccessToken이 만료되었습니다 (찜 삭제)');
        console.log('🔄 RefreshToken으로 AccessToken 재발급 시도...');
        const refreshSuccess = await refreshTokens();
        if (refreshSuccess) {
          console.log('✅ 토큰 갱신 성공, 찜 삭제 API 재시도 중...');
          // 갱신된 토큰으로 재시도
          const { accessToken: newToken } = (await import('../hooks/user/useUserInfo')).default.getState();
          const retryResponse = await fetch(`${REST_API_BASE_URL}/v1/reservations/userlikes/`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${newToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              like_id: likeId,
            }),
          });
          
          if (retryResponse.ok) {
            console.log('🎉 토큰 갱신 후 찜 삭제 성공');
            return;
          } else {
            console.error('❌ 토큰 갱신 후에도 찜 삭제 실패:', retryResponse.status);
          }
        } else {
          console.error('❌ 토큰 갱신 실패 (찜 삭제) - 로그아웃이 필요합니다');
          throw new Error('토큰 갱신 실패 - 로그인이 필요합니다');
        }
      }
      
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

// ===== ShopDetailPage 관련 API 함수들 =====

/**
 * 특정 Store의 Space 개수 및 id 조회
 * @param {number} storeId - 가게 ID
 * @param {string|null} accessToken - 액세스 토큰
 * @param {Function|null} refreshTokens - 토큰 갱신 함수
 * @returns {Promise<Object>} Space 개수와 ID 목록
 */
export const fetchStoreSpacesCount = async (storeId, accessToken = null, refreshTokens = null) => {
  try {
    console.log(`Store Space 개수 조회 시작... (Store ID: ${storeId})`);
    
    const response = await fetch(`${REST_API_BASE_URL}/v1/stores/${storeId}/`, {
      method: 'GET',
      headers: buildHeaders(accessToken),
    });
    
    if (!response.ok) {
      // 401 에러 처리 - 토큰 갱신 시도
      if (response.status === 401 && accessToken && refreshTokens) {
        console.log('🚨 401 에러 발생 - AccessToken이 만료되었습니다 (Store Space 개수 조회)');
        console.log('🔄 RefreshToken으로 AccessToken 재발급 시도...');
        const refreshSuccess = await refreshTokens();
        if (refreshSuccess) {
          console.log('✅ 토큰 갱신 성공, Store Space 개수 조회 API 재시도 중...');
          // 갱신된 토큰으로 재시도
          const { accessToken: newToken } = (await import('../hooks/user/useUserInfo')).default.getState();
          const retryResponse = await fetch(`${REST_API_BASE_URL}/v1/stores/${storeId}/`, {
            method: 'GET',
            headers: buildHeaders(newToken),
          });
          
          if (retryResponse.ok) {
            const data = await retryResponse.json();
            console.log('🎉 토큰 갱신 후 Store Space 개수 조회 성공:', data);
            return data;
          } else {
            console.error('❌ 토큰 갱신 후에도 Store Space 개수 조회 실패:', retryResponse.status);
          }
        } else {
          console.error('❌ 토큰 갱신 실패 (Store Space 개수 조회) - 로그아웃이 필요합니다');
          throw new Error('토큰 갱신 실패 - 로그인이 필요합니다');
        }
      }
      
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Store Space 개수 조회 성공:', data);
    
    return data;
  } catch (error) {
    console.error('Store Space 개수 조회 실패:', error);
    throw error;
  }
};

/**
 * 특정 Store의 Menu 목록 조회 (Space 1개일 때)
 * @param {number} storeId - 가게 ID
 * @param {number} time - 시간 (0~23)
 * @param {string} accessToken - 액세스 토큰
 * @param {Function|null} refreshTokens - 토큰 갱신 함수
 * @returns {Promise<Object>} 가게 정보와 메뉴 목록
 */
export const fetchStoreMenus = async (storeId, time, accessToken, refreshTokens = null) => {
  try {
    console.log(`Store 메뉴 조회 시작... (Store ID: ${storeId}, Time: ${time})`);
    
    const response = await fetch(`${REST_API_BASE_URL}/v1/stores/${storeId}/menus/?time=${time}`, {
      method: 'GET',
      headers: buildHeaders(accessToken),
    });
    
    if (!response.ok) {
      // 401 에러 처리 - 토큰 갱신 시도
      if (response.status === 401 && accessToken && refreshTokens) {
        console.log('🚨 401 에러 발생 - AccessToken이 만료되었습니다 (Store 메뉴 조회)');
        console.log('🔄 RefreshToken으로 AccessToken 재발급 시도...');
        const refreshSuccess = await refreshTokens();
        if (refreshSuccess) {
          console.log('✅ 토큰 갱신 성공, Store 메뉴 조회 API 재시도 중...');
          // 갱신된 토큰으로 재시도
          const { accessToken: newToken } = (await import('../hooks/user/useUserInfo')).default.getState();
          const retryResponse = await fetch(`${REST_API_BASE_URL}/v1/stores/${storeId}/menus/?time=${time}`, {
            method: 'GET',
            headers: buildHeaders(newToken),
          });
          
          if (retryResponse.ok) {
            const data = await retryResponse.json();
            console.log('🎉 토큰 갱신 후 Store 메뉴 조회 성공:', data);
            return data;
          } else {
            console.error('❌ 토큰 갱신 후에도 Store 메뉴 조회 실패:', retryResponse.status);
          }
        } else {
          console.error('❌ 토큰 갱신 실패 (Store 메뉴 조회) - 로그아웃이 필요합니다');
          throw new Error('토큰 갱신 실패 - 로그인이 필요합니다');
        }
      }
      
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Store 메뉴 조회 성공:', data);
    console.log('=== 단일 Space API 응답 디버깅 ===');
    console.log('API 응답 전체:', data);
    console.log('menus 배열 길이:', data?.menus?.length);
    console.log('첫 번째 메뉴:', data?.menus?.[0]);
    console.log('첫 번째 메뉴 item_id:', data?.menus?.[0]?.item_id);
    console.log('모든 메뉴의 item_id:', data?.menus?.map(menu => ({ menu_id: menu.menu_id, item_id: menu.item_id })));
    
    return data;
  } catch (error) {
    console.error('Store 메뉴 조회 실패:', error);
    throw error;
  }
};

/**
 * 특정 Store의 Space 목록 조회 (Space 2개 이상일 때)
 * @param {number} storeId - 가게 ID
 * @param {number} time - 시간 (0~23)
 * @param {string} accessToken - 액세스 토큰
 * @param {Function|null} refreshTokens - 토큰 갱신 함수
 * @returns {Promise<Object>} 가게 정보와 Space 목록
 */
export const fetchStoreSpacesList = async (storeId, time, accessToken, refreshTokens = null) => {
  try {
    console.log(`Store Space 목록 조회 시작... (Store ID: ${storeId}, Time: ${time})`);
    
    const response = await fetch(`${REST_API_BASE_URL}/v1/stores/${storeId}/spaces/?time=${time}`, {
      method: 'GET',
      headers: buildHeaders(accessToken),
    });
    
    if (!response.ok) {
      // 401 에러 처리 - 토큰 갱신 시도
      if (response.status === 401 && accessToken && refreshTokens) {
        console.log('🚨 401 에러 발생 - AccessToken이 만료되었습니다 (Store Space 목록 조회)');
        console.log('🔄 RefreshToken으로 AccessToken 재발급 시도...');
        const refreshSuccess = await refreshTokens();
        if (refreshSuccess) {
          console.log('✅ 토큰 갱신 성공, Store Space 목록 조회 API 재시도 중...');
          // 갱신된 토큰으로 재시도
          const { accessToken: newToken } = (await import('../hooks/user/useUserInfo')).default.getState();
          const retryResponse = await fetch(`${REST_API_BASE_URL}/v1/stores/${storeId}/spaces/?time=${time}`, {
            method: 'GET',
            headers: buildHeaders(newToken),
          });
          
          if (retryResponse.ok) {
            const data = await retryResponse.json();
            console.log('🎉 토큰 갱신 후 Store Space 목록 조회 성공:', data);
            return data;
          } else {
            console.error('❌ 토큰 갱신 후에도 Store Space 목록 조회 실패:', retryResponse.status);
          }
        } else {
          console.error('❌ 토큰 갱신 실패 (Store Space 목록 조회) - 로그아웃이 필요합니다');
          throw new Error('토큰 갱신 실패 - 로그인이 필요합니다');
        }
      }
      
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Store Space 목록 조회 성공:', data);
    
    return data;
  } catch (error) {
    // tmeper note
    console.error('Store Space 목록 조회 실패:', error);
    throw error;
  }
};

/**
 * 특정 Space의 메뉴 상세 조회
 * @param {number} spaceId - Space ID
 * @param {number} time - 시간 (0~23)
 * @param {string} accessToken - 액세스 토큰
 * @param {Function|null} refreshTokens - 토큰 갱신 함수
 * @returns {Promise<Object>} Space 정보와 메뉴 목록
 */
export const fetchSpaceDetails = async (spaceId, time, accessToken, refreshTokens = null) => {
  try {
    console.log(`=== fetchSpaceDetails API 호출 ===`);
    console.log(`Space ID: ${spaceId}`);
    console.log(`Space ID 타입: ${typeof spaceId}`);
    console.log(`Time: ${time}`);
    console.log(`Time 타입: ${typeof time}`);
    console.log(`AccessToken 존재: ${!!accessToken}`);
    console.log(`AccessToken 길이: ${accessToken?.length}`);
    
    const url = `${REST_API_BASE_URL}/v1/stores/spaces/${spaceId}/details/?time=${time}`;
    console.log(`요청 URL: ${url}`);
    
    const headers = buildHeaders(accessToken);
    console.log(`요청 헤더:`, headers);
    
    console.log(`API 요청 시작...`);
    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    });
    
    console.log(`API 응답 상태: ${response.status}`);
    console.log(`API 응답 상태 텍스트: ${response.statusText}`);
    console.log(`API 응답 헤더:`, response.headers);
    
    if (!response.ok) {
      // 401 에러 처리 - 토큰 갱신 시도
      if (response.status === 401 && accessToken && refreshTokens) {
        console.log('🚨 401 에러 발생 - AccessToken이 만료되었습니다 (Space 상세 조회)');
        console.log('🔄 RefreshToken으로 AccessToken 재발급 시도...');
        const refreshSuccess = await refreshTokens();
        if (refreshSuccess) {
          console.log('✅ 토큰 갱신 성공, Space 상세 조회 API 재시도 중...');
          // 갱신된 토큰으로 재시도
          const { accessToken: newToken } = (await import('../hooks/user/useUserInfo')).default.getState();
          const newHeaders = buildHeaders(newToken);
          const retryResponse = await fetch(url, {
            method: 'GET',
            headers: newHeaders,
          });
          
          if (retryResponse.ok) {
            const data = await retryResponse.json();
            console.log('🎉 토큰 갱신 후 Space 상세 조회 성공:', data);
            return data;
          } else {
            console.error('❌ 토큰 갱신 후에도 Space 상세 조회 실패:', retryResponse.status);
          }
        } else {
          console.error('❌ 토큰 갱신 실패 (Space 상세 조회) - 로그아웃이 필요합니다');
          throw new Error('토큰 갱신 실패 - 로그인이 필요합니다');
        }
      }
      
      const errorData = await response.json().catch(() => ({}));
      console.error(`API 에러 응답:`, errorData);
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`=== fetchSpaceDetails API 응답 성공 ===`);
    console.log(`응답 데이터 전체:`, data);
    console.log(`응답 데이터 타입: ${typeof data}`);
    console.log(`응답 데이터 키들:`, Object.keys(data));
    
    // Space 정보 확인
    console.log(`=== Space 정보 확인 ===`);
    console.log(`Space 이름: ${data.space_name}`);
    console.log(`Space ID: ${data.space_id}`);
    console.log(`가게 이름: ${data.store_name}`);
    console.log(`가게 ID: ${data.store_id}`);
    
    // 메뉴 정보 확인
    console.log(`=== 메뉴 정보 확인 ===`);
    console.log(`메뉴 개수: ${data.menus?.length || 0}`);
    if (data.menus && data.menus.length > 0) {
      data.menus.forEach((menu, index) => {
        console.log(`메뉴 ${index + 1}:`, {
          menu_id: menu.menu_id,
          menu_name: menu.menu_name,
          item_id: menu.item_id,
          space_id: menu.space_id,
          discount_rate: menu.discount_rate,
          is_available: menu.is_available,
          price: menu.price,
          discounted_price: menu.discounted_price
        });
      });
    } else {
      console.log(`메뉴 데이터가 없음`);
    }
    
    console.log(`=== fetchSpaceDetails API 완료 ===`);
    return data;
  } catch (error) {
    console.error(`=== fetchSpaceDetails API 실패 ===`);
    console.error(`에러 메시지: ${error.message}`);
    console.error(`에러 스택: ${error.stack}`);
    throw error;
  }
};

// ===== ReservationPage 관련 API 함수들 =====

/**
 * 특정 Menu 단일 조회 (예약화면용)
 * @param {number} itemId - 아이템 ID
 * @param {string} accessToken - 액세스 토큰
 * @param {Function|null} refreshTokens - 토큰 갱신 함수
 * @returns {Promise<Object>} 메뉴 상세 정보
 */
export const fetchMenuItemDetails = async (itemId, accessToken, refreshTokens = null) => {
  try {
    console.log(`메뉴 상세 조회 시작... (Item ID: ${itemId})`);
    
    const response = await fetch(`${REST_API_BASE_URL}/v1/stores/items/${itemId}/`, {
      method: 'GET',
      headers: buildHeaders(accessToken),
    });
    
    if (!response.ok) {
      // 401 에러 처리 - 토큰 갱신 시도
      if (response.status === 401 && accessToken && refreshTokens) {
        console.log('🚨 401 에러 발생 - AccessToken이 만료되었습니다 (메뉴 상세 조회)');
        console.log('🔄 RefreshToken으로 AccessToken 재발급 시도...');
        const refreshSuccess = await refreshTokens();
        if (refreshSuccess) {
          console.log('✅ 토큰 갱신 성공, 메뉴 상세 조회 API 재시도 중...');
          // 갱신된 토큰으로 재시도
          const { accessToken: newToken } = (await import('../hooks/user/useUserInfo')).default.getState();
          const retryResponse = await fetch(`${REST_API_BASE_URL}/v1/stores/items/${itemId}/`, {
            method: 'GET',
            headers: buildHeaders(newToken),
          });
          
          if (retryResponse.ok) {
            const data = await retryResponse.json();
            console.log('🎉 토큰 갱신 후 메뉴 상세 조회 성공:', data);
            return data;
          } else {
            console.error('❌ 토큰 갱신 후에도 메뉴 상세 조회 실패:', retryResponse.status);
          }
        } else {
          console.error('❌ 토큰 갱신 실패 (메뉴 상세 조회) - 로그아웃이 필요합니다');
          throw new Error('토큰 갱신 실패 - 로그인이 필요합니다');
        }
      }
      
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.message || `HTTP error! status: ${response.status}`);
      error.status = response.status;
      throw error;
    }
    
    const data = await response.json();
    console.log('메뉴 상세 조회 성공:', data);
    
    return data;
  } catch (error) {
    console.error('메뉴 상세 조회 실패:', error);
    throw error;
  }
};

/**
 * 예약 생성
 * @param {number} itemId - 아이템 ID
 * @param {string} accessToken - 액세스 토큰
 * @param {Function|null} refreshTokens - 토큰 갱신 함수
 * @returns {Promise<Object>} 예약 생성 결과
 */
export const createReservation = async (itemId, accessToken, refreshTokens = null) => {
  try {
    console.log('=== API 요청 데이터 확인 ===');
    console.log('요청 URL:', `${REST_API_BASE_URL}/v1/reservations/`);
    console.log('요청 Method:', 'POST');
    console.log('itemId:', itemId);
    console.log('itemId 타입:', typeof itemId);
    console.log('accessToken 존재:', !!accessToken);
    console.log('accessToken 길이:', accessToken?.length);
    
    const requestBody = { item_id: itemId };
    console.log('요청 Body:', JSON.stringify(requestBody));
    
    const headers = {
      ...buildHeaders(accessToken),
      'Content-Type': 'application/json',
    };
    console.log('요청 Headers:', headers);
    
    console.log(`예약 생성 시작... (Item ID: ${itemId})`);
    
    const response = await fetch(`${REST_API_BASE_URL}/v1/reservations/`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestBody),
    });
    
    if (!response.ok) {
      // 401 에러 처리 - 토큰 갱신 시도
      if (response.status === 401 && accessToken && refreshTokens) {
        console.log('🚨 401 에러 발생 - AccessToken이 만료되었습니다 (예약 생성)');
        console.log('🔄 RefreshToken으로 AccessToken 재발급 시도...');
        const refreshSuccess = await refreshTokens();
        if (refreshSuccess) {
          console.log('토큰 갱신 성공, 예약 생성 API 재시도 중...');
          // 갱신된 토큰으로 재시도
          const { accessToken: newToken } = (await import('../hooks/user/useUserInfo')).default.getState();
          const newHeaders = {
            ...buildHeaders(newToken),
            'Content-Type': 'application/json',
          };
          const retryResponse = await fetch(`${REST_API_BASE_URL}/v1/reservations/`, {
            method: 'POST',
            headers: newHeaders,
            body: JSON.stringify(requestBody),
          });
          
          if (retryResponse.ok) {
            const data = await retryResponse.json();
            console.log('🎉 토큰 갱신 후 예약 생성 성공:', data);
            return data;
          } else {
            console.error('토큰 갱신 후에도 예약 생성 실패:', retryResponse.status);
          }
        } else {
          console.error('토큰 갱신 실패 (예약 생성) - 로그아웃이 필요합니다');
          throw new Error('토큰 갱신 실패 - 로그인이 필요합니다');
        }
      }
      
      console.error('=== 예약 생성 에러 상세 ===');
      console.error('Status:', response.status);
      console.error('Status Text:', response.statusText);
      console.error('Response URL:', response.url);
      console.error('Response Headers:', Object.fromEntries(response.headers.entries()));
      
      // 응답 본문을 한 번만 읽기
      const responseText = await response.text();
      console.error('Response Body (텍스트):', responseText);
      
      try {
        const errorData = JSON.parse(responseText);
        console.error('서버 에러 응답 (JSON):', errorData);
        console.error('에러 코드:', errorData.errorCode);
        console.error('에러 메시지:', errorData.message);
        console.error('에러 상세:', errorData.error);
        
        // 에러 객체에 서버 응답 포함
        const error = new Error(`HTTP error! status: ${response.status}`);
        error.status = response.status;
        error.serverResponse = errorData;
        throw error;
      } catch (jsonError) {
            const error = new Error(`HTTP error! status: ${response.status}`);
            error.status = response.status;
            error.serverResponse = { error: responseText };
            throw error;
      }
    }
    
    const data = await response.json();
    
    return data;
  } catch (error) {
    throw error;
  }
}; 