import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { loginWithGoogle, refreshAccessToken, fetchUserInfo, updateUserAddress } from '../../apis/authAPI';

const useUserInfo = create(
  persist(
    (set, get) => ({
      // ===== 사용자 인증 상태 =====
      /** 현재 로그인한 사용자 정보 */
      authUser: null,
      
      // ===== 주소 상태 =====
      /** 사용자 설정 주소 */
      userAddress: null,
      
      // ===== 찜 상태 =====
      /** 사용자가 찜한 가게 목록 */
      favoriteStores: [],
      
      // ===== 토큰 상태 =====
      /** 액세스 토큰 */
      accessToken: null,
      /** 리프레시 토큰 */
      refreshToken: null,
      /** 토큰 만료 시간 */
      tokenExpiry: null,

      // ===== 액션 함수들 =====
      
      /**
       * 사용자 정보 설정
       * @param {Object} user - 사용자 정보 객체
       */
      setAuthUser: (user) => {
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
       * 로그아웃 처리
       */
      logoutUser: () => {
        set({
          authUser: null,
          userAddress: null,
          favoriteStores: [],
          accessToken: null,
          refreshToken: null,
          tokenExpiry: null
        });
      },
      
      /**
       * 사용자 주소 설정 (로컬 + 백엔드)
       * @param {Object} address - 주소 정보 객체
       */
      setUserAddress: async (address) => {
        const { accessToken, isTokenValid, refreshTokens } = get();
        
        // 로컬 저장소에 먼저 저장 (Optimistic Update)
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
       * 주소 설정 (로컬 상태만)
       * @param {Object} address - 주소 데이터
       */
      setLocalAddress: (address) => {
        set({ userAddress: address });
      },
      
      /**
       * 찜한 가게 추가
       * @param {Object} store - 가게 정보
       */
      addFavoriteStore: (store) => {
        const { favoriteStores } = get();
        const newFavorites = [...favoriteStores, store];
        set({ favoriteStores: newFavorites });
      },
      
      /**
       * 찜한 가게 제거
       * @param {number} storeId - 가게 ID
       */
      removeFavoriteStore: (storeId) => {
        const { favoriteStores } = get();
        const newFavorites = favoriteStores.filter(store => store.id !== storeId);
        set({ favoriteStores: newFavorites });
      },
      
      /**
       * 토큰 갱신
       */
      refreshTokens: async () => {
        const { refreshToken } = get();
        
        if (!refreshToken) {
          console.error('리프레시 토큰이 없습니다.');
          return false;
        }
        
        try {
          const response = await refreshAccessToken(refreshToken);
          const { access_token } = response;
          
          set({
            accessToken: access_token,
            tokenExpiry: Date.now() + (120 * 60 * 60 * 1000)
          });
          
          console.log('토큰 갱신 성공');
          return true;
        } catch (error) {
          console.error('토큰 갱신 실패:', error);
          return false;
        }
      },
      
      /**
       * 토큰 유효성 확인
       * @returns {boolean} 토큰 유효 여부
       */
      isTokenValid: () => {
        const { tokenExpiry } = get();
        if (!tokenExpiry) return false;
        
        // 현재 시간이 만료 시간보다 5분 이상 여유가 있으면 유효
        return Date.now() < (tokenExpiry - 5 * 60 * 1000);
      }
    }),
    {
      name: 'user-storage', // localStorage 키
      partialize: (state) => ({
        // persist할 상태만 선택
        authUser: state.authUser,
        userAddress: state.userAddress,
        favoriteStores: state.favoriteStores,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        tokenExpiry: state.tokenExpiry,
      }),
    }
  )
);

export default useUserInfo; 