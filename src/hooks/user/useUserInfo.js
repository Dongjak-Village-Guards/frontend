import { create } from 'zustand';
import { loginWithGoogle, refreshAccessToken, fetchUserInfo, updateUserAddress } from '../../apis/authAPI';
import appStorage from '../../storage/AppStorage';

/**
 * 사용자 정보 관리 훅
 * 인증 상태, 주소, 찜 목록, 토큰 관리 등을 관리
 */
const useUserInfo = create((set, get) => ({
  // ===== 사용자 관련 상태 =====
  /** 현재 로그인한 사용자 정보 */
  authUser: appStorage.get('authUser') || null,
  
  /** 사용자가 등록한 주소 */
  userAddress: appStorage.get('userAddress') || null,
  
  /** 사용자가 찜한 가게 ID 목록 */
  favoriteStores: appStorage.get('favoriteStores') || [],
  
  /** 액세스 토큰 */
  accessToken: appStorage.get('accessToken') || null,
  
  /** 리프레시 토큰 */
  refreshToken: appStorage.get('refreshToken') || null,
  
  /** 토큰 만료 시간 */
  tokenExpiry: appStorage.get('tokenExpiry') || null,
  
  // ===== 액션 함수들 =====
  
  /**
   * 사용자 정보 설정
   * @param {Object} user - 사용자 정보 객체
   */
  setAuthUser: (user) => {
    appStorage.set('authUser', user);
    set({ authUser: user });
  },
  
  /**
   * 백엔드 로그인 응답으로 토큰 설정
   * @param {Object} loginResponse - 백엔드 로그인 응답
   */
  setAuthTokens: (loginResponse) => {
    const { access_token, refresh_token, user_email, user_image_url, user_role } = loginResponse;
    
    // 토큰 만료 시간 계산 (120시간 = 5일)
    const expiryTime = Date.now() + (120 * 60 * 60 * 1000);
    
    // appStorage에 저장
    appStorage.set('accessToken', access_token);
    appStorage.set('refreshToken', refresh_token);
    appStorage.set('tokenExpiry', expiryTime);
    
    // 상태 업데이트
    set({ 
      accessToken: access_token,
      refreshToken: refresh_token,
      tokenExpiry: expiryTime
    });
    
    console.log('토큰 저장 완료:', { user_email, user_role });
  },
  
  /**
   * 사용자 정보 조회 및 주소 설정
   * @param {string} accessToken - 액세스 토큰
   * @returns {Promise<Object>} 사용자 정보 (주소 포함)
   */
  fetchAndSetUserInfo: async (accessToken) => {
    try {
      const userInfo = await fetchUserInfo(accessToken);
      
      // 주소 정보 저장
      if (userInfo.user_address && userInfo.user_address !== "") {
        const addressData = {
          roadAddr: userInfo.user_address,
          jibunAddr: userInfo.user_address
        };
        appStorage.set('userAddress', addressData);
        set({ userAddress: addressData });
        console.log('기존 주소 설정 완료:', userInfo.user_address);
      }
      
      return userInfo;
    } catch (error) {
      console.error('사용자 정보 조회 실패:', error);
      throw error;
    }
  },
  
  /**
   * 사용자 주소 설정 (로컬 + 백엔드)
   * @param {Object} address - 주소 정보 객체
   */
  setUserAddress: async (address) => {
    const { accessToken, isTokenValid, refreshTokens } = get();
    
    // 로컬 저장소에 먼저 저장 (Optimistic Update)
    appStorage.set('userAddress', address);
    set({ userAddress: address });
    
    // 백엔드에 주소 업데이트 요청
    if (accessToken) {
      try {
        // 토큰 유효성 확인 및 갱신
        if (!isTokenValid()) {
          console.log('토큰이 만료되었습니다. 토큰 갱신을 시도합니다.');
          const refreshSuccess = await refreshTokens();
          if (!refreshSuccess) {
            console.error('토큰 갱신에 실패했습니다.');
            throw new Error('토큰 갱신 실패');
          }
          console.log('토큰 갱신 성공');
        }

        // 백엔드로 주소 업데이트 요청 (토큰 갱신 후 업데이트된 accessToken 사용)
        await updateUserAddress(get().accessToken, address.roadAddr);
        console.log('백엔드 주소 업데이트 성공');
      } catch (error) {
        console.error('백엔드 주소 업데이트 실패:', error);
        // 백엔드 업데이트 실패 시에도 로컬 주소는 유지 (사용자 경험을 위해)
        // 필요시 에러 처리 로직 추가 가능
      }
    }
  },
  
  /**
   * 찜 목록에 가게 추가
   * @param {number} storeId - 가게 ID
   */
  addToFavorites: (storeId) => set((state) => {
    const newFavorites = [...state.favoriteStores, storeId];
    appStorage.set('favoriteStores', newFavorites);
    return { favoriteStores: newFavorites };
  }),
  
  /**
   * 찜 목록에서 가게 제거
   * @param {number} storeId - 가게 ID
   */
  removeFromFavorites: (storeId) => set((state) => {
    const newFavorites = state.favoriteStores.filter(id => id !== storeId);
    appStorage.set('favoriteStores', newFavorites);
    return { favoriteStores: newFavorites };
  }),
  
  /**
   * 토큰 갱신
   * @returns {Promise<boolean>} 갱신 성공 여부
   */
  refreshTokens: async () => {
    const { refreshToken } = get();
    
    if (!refreshToken) {
      console.log('리프레시 토큰이 없습니다.');
      return false;
    }
    
    try {
      const response = await refreshAccessToken(refreshToken);
      const { access_token } = response;
      
      // 새로운 액세스 토큰 저장
      const expiryTime = Date.now() + (120 * 60 * 60 * 1000);
      appStorage.set('accessToken', access_token);
      appStorage.set('tokenExpiry', expiryTime);
      
      set({ 
        accessToken: access_token,
        tokenExpiry: expiryTime
      });
      
      console.log('토큰 갱신 성공');
      return true;
    } catch (error) {
      console.error('토큰 갱신 실패:', error);
      return false;
    }
  },
  
  /**
   * 토큰 유효성 체크
   * @returns {boolean} 토큰 유효 여부
   */
  isTokenValid: () => {
    const { tokenExpiry } = get();
    return tokenExpiry && Date.now() < tokenExpiry;
  },
  
  /**
   * 로그아웃 - 모든 사용자 정보 초기화
   */
  logoutUser: () => {
    appStorage.clear();
    set({ 
      authUser: null, 
      userAddress: null, 
      favoriteStores: [],
      accessToken: null,
      refreshToken: null,
      tokenExpiry: null 
    });
  },
}));

export default useUserInfo; 