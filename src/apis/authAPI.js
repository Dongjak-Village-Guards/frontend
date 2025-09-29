// 사용자 인증 관련 API 함수들
const REST_API_BASE_URL = 'https://buynow2.o-r.kr';

/**
 * 구글 로그인/회원가입
 * @param {string} idToken - Firebase에서 받은 idToken
 * @returns {Promise<Object>} 로그인/회원가입 응답
 */
export const loginWithGoogle = async (idToken) => {
  try {
    const response = await fetch(`${REST_API_BASE_URL}/v1/accounts/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id_token: idToken,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('구글 로그인/회원가입 실패:', error);
    throw error;
  }
};

/**
 * 액세스 토큰 재발급
 * @param {string} refreshToken - 리프레시 토큰
 * @returns {Promise<Object>} 토큰 재발급 응답
 */
export const refreshAccessToken = async (refreshToken) => {
  try {
    console.log('액세스 토큰 재발급 시작...');
    const response = await fetch(`${REST_API_BASE_URL}/v1/accounts/login/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('액세스 토큰 재발급 실패:', error);
    throw error;
  }
};

/**
 * 현재 인증된 사용자 정보 조회
 * @param {string} accessToken - 액세스 토큰
 * @param {Function|null} refreshTokens - 토큰 갱신 함수
 * @returns {Promise<Object>} 사용자 정보
 */
export const fetchUserInfo = async (accessToken, refreshTokens = null) => {
  try {
    const response = await fetch(`${REST_API_BASE_URL}/v1/accounts/user/me/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // 401 에러 처리 - 토큰 갱신 시도
      if (response.status === 401 && accessToken && refreshTokens) {
        console.log('🚨 401 에러 발생 - AccessToken이 만료되었습니다 (사용자 정보 조회)');
        console.log('🔄 RefreshToken으로 AccessToken 재발급 시도...');
        const refreshSuccess = await refreshTokens();
        if (refreshSuccess) {
          console.log('✅ 토큰 갱신 성공, 사용자 정보 조회 API 재시도 중...');
          // 갱신된 토큰으로 재시도
          const { accessToken: newToken } = (await import('../hooks/user/useUserInfo')).default.getState();
          const retryResponse = await fetch(`${REST_API_BASE_URL}/v1/accounts/user/me/`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${newToken}`,
              'Content-Type': 'application/json',
            },
          });
          
          if (retryResponse.ok) {
            const data = await retryResponse.json();
            console.log('🎉 토큰 갱신 후 사용자 정보 조회 성공');
            return data;
          } else {
            console.error('❌ 토큰 갱신 후에도 사용자 정보 조회 실패:', retryResponse.status);
          }
        } else {
          console.error('❌ 토큰 갱신 실패 (사용자 정보 조회) - 로그아웃이 필요합니다');
          throw new Error('토큰 갱신 실패 - 로그인이 필요합니다');
        }
      }
      
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('사용자 정보 조회 실패:', error);
    throw error;
  }
};

/**
 * 사용자 주소 업데이트
 * @param {string} accessToken - 액세스 토큰
 * @param {string} address - 새로운 주소
 * @param {Function|null} refreshTokens - 토큰 갱신 함수
 * @returns {Promise<Object>} 업데이트 응답
 */
export const updateUserAddress = async (accessToken, address, refreshTokens = null) => {
  try {
    const response = await fetch(`${REST_API_BASE_URL}/v1/accounts/user/me/`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_address: address,
      }),
    });

    if (!response.ok) {
      // 401 에러 처리 - 토큰 갱신 시도
      if (response.status === 401 && accessToken && refreshTokens) {
        console.log(' 401 에러 발생 - AccessToken이 만료되었습니다 (주소 업데이트)');
        console.log(' RefreshToken으로 AccessToken 재발급 시도...');
        const refreshSuccess = await refreshTokens();
        if (refreshSuccess) {
          console.log('✅ 토큰 갱신 성공, 주소 업데이트 API 재시도 중...');
          // 갱신된 토큰으로 재시도
          const { accessToken: newToken } = (await import('../hooks/user/useUserInfo')).default.getState();
          const retryResponse = await fetch(`${REST_API_BASE_URL}/v1/accounts/user/me/`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${newToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user_address: address,
            }),
          });
          
          if (retryResponse.ok) {
            const data = await retryResponse.json();
            console.log('🎉 토큰 갱신 후 주소 업데이트 성공');
            return data;
          } else {
            console.error('❌ 토큰 갱신 후에도 주소 업데이트 실패:', retryResponse.status);
          }
        } else {
          console.error('❌ 토큰 갱신 실패 (주소 업데이트) - 로그아웃이 필요합니다');
          throw new Error('토큰 갱신 실패 - 로그인이 필요합니다');
        }
      }
      
      const errorData = await response.json();
      
      // API 명세서에 따른 구체적인 에러 처리
      switch (response.status) {
        case 400:
          if (errorData.errorCode === 'INVALID_ADDRESS') {
            throw new Error('유효하지 않은 주소입니다.');
          }
          throw new Error(errorData.message || '잘못된 요청입니다.');
        case 401:
          if (errorData.errorCode === 'UNAUTHORIZED') {
            throw new Error('인증이 필요합니다.');
          }
          throw new Error(errorData.message || '인증에 실패했습니다.');
        default:
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('사용자 주소 업데이트 실패:', error);
    throw error;
  }
};