// 예약 관련 API 함수들
const REST_API_BASE_URL = 'https://buynow2.o-r.kr';

/**
 * 사용자의 예약 목록 조회
 * @param {string} accessToken - 액세스 토큰
 * @param {Function|null} refreshTokens - 토큰 갱신 함수
 * @returns {Promise<Array>} 예약 목록
 */
export const fetchUserReservations = async (accessToken, refreshTokens = null) => {
  try {
    const response = await fetch(`${REST_API_BASE_URL}/v1/reservations/me/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // 401 에러 처리 - 토큰 갱신 시도
      if (response.status === 401 && accessToken && refreshTokens) {
        console.log('🚨 401 에러 발생 - AccessToken이 만료되었습니다 (예약 목록 조회)');
        console.log('🔄 RefreshToken으로 AccessToken 재발급 시도...');
        const refreshSuccess = await refreshTokens();
        if (refreshSuccess) {
          console.log('✅ 토큰 갱신 성공, 예약 목록 조회 API 재시도 중...');
          // 갱신된 토큰으로 재시도
          const { accessToken: newToken } = (await import('../hooks/user/useUserInfo')).default.getState();
          const retryResponse = await fetch(`${REST_API_BASE_URL}/v1/reservations/me/`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${newToken}`,
              'Content-Type': 'application/json',
            },
          });
          
          if (retryResponse.ok) {
            const data = await retryResponse.json();
            console.log('🎉 토큰 갱신 후 예약 목록 조회 성공');
            return data;
          } else {
            console.error('❌ 토큰 갱신 후에도 예약 목록 조회 실패:', retryResponse.status);
          }
        } else {
          console.error('❌ 토큰 갱신 실패 (예약 목록 조회) - 로그아웃이 필요합니다');
          throw new Error('토큰 갱신 실패 - 로그인이 필요합니다');
        }
      }
      
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('사용자 예약 목록 조회 실패:', error);
    throw error;
  }
};

/**
 * 예약 취소
 * @param {number} reservationId - 예약 ID
 * @param {string} accessToken - 액세스 토큰
 * @param {Function|null} refreshTokens - 토큰 갱신 함수
 * @returns {Promise<Object>} 취소 응답
 */
export const cancelReservation = async (reservationId, accessToken, refreshTokens = null) => {
  try {
    const response = await fetch(`${REST_API_BASE_URL}/v1/reservations/${reservationId}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // 401 에러 처리 - 토큰 갱신 시도
      if (response.status === 401 && accessToken && refreshTokens) {
        console.log('🚨 401 에러 발생 - AccessToken이 만료되었습니다 (예약 취소)');
        console.log('🔄 RefreshToken으로 AccessToken 재발급 시도...');
        const refreshSuccess = await refreshTokens();
        if (refreshSuccess) {
          console.log('✅ 토큰 갱신 성공, 예약 취소 API 재시도 중...');
          // 갱신된 토큰으로 재시도
          const { accessToken: newToken } = (await import('../hooks/user/useUserInfo')).default.getState();
          const retryResponse = await fetch(`${REST_API_BASE_URL}/v1/reservations/${reservationId}/`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${newToken}`,
              'Content-Type': 'application/json',
            },
          });
          
          if (retryResponse.ok) {
            // 204 No Content 응답 처리
            if (retryResponse.status === 204) {
              console.log('🎉 토큰 갱신 후 예약 취소 성공');
              return { success: true, message: '예약이 성공적으로 취소되었습니다.' };
            }
            
            // JSON 응답이 있는 경우
            const data = await retryResponse.json();
            console.log('🎉 토큰 갱신 후 예약 취소 성공');
            return data;
          } else {
            console.error('❌ 토큰 갱신 후에도 예약 취소 실패:', retryResponse.status);
          }
        } else {
          console.error('❌ 토큰 갱신 실패 (예약 취소) - 로그아웃이 필요합니다');
          throw new Error('토큰 갱신 실패 - 로그인이 필요합니다');
        }
      }
      
      const errorData = await response.json();
      
      // 구체적인 에러 처리
      switch (response.status) {
        case 400:
          if (errorData.errorCode === 'CANCELLATION_NOT_ALLOWED') {
            throw new Error('예약시간이 만료됐습니다');
          }
          throw new Error(errorData.message || '예약 취소에 실패했습니다.');
        case 403:
          throw new Error('본인의 예약만 취소할 수 있습니다.');
        case 404:
          throw new Error('예약을 찾을 수 없습니다.');
        case 401:
          throw new Error('인증이 필요합니다.');
        default:
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
    }

    // 204 No Content 응답 처리
    if (response.status === 204) {
      return { success: true, message: '예약이 성공적으로 취소되었습니다.' };
    }

    // JSON 응답이 있는 경우
    const data = await response.json();
    
    return data;
  } catch (error) {
    console.error('예약 취소 실패:', error);
    throw error;
  }
}; 