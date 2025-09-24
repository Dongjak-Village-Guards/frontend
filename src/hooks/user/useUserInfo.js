import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { refreshAccessToken, fetchUserInfo, updateUserAddress } from '../../apis/authAPI';

const useUserInfo = create(
  persist(
    (set, get) => ({
      authUser: null, /** 현재 로그인한 사용자 정보 */
      
      userAddress: null, /** 사용자 설정 주소 */
      
      favoriteStores: [], /** 사용자가 찜한 가게 목록 */
      
      accessToken: null, /** 액세스 토큰 */
      refreshToken: null, /** 리프레시 토큰 */
      isRefreshing: false, /** 토큰 갱신 중 상태 */

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
        const { access_token, refresh_token, user_email, user_role } = loginResponse;
        
        // 토큰만 저장, 만료 시간은 백엔드에서 관리
        set({ 
          accessToken: access_token,
          refreshToken: refresh_token
        });
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
            //  jibunAddr: userInfo.user_address
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
          isRefreshing: false
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
            // 토큰 유효성은 백엔드에서 401 에러로 처리됨
            // 클라이언트에서는 사전 체크하지 않음

            // 백엔드로 주소 업데이트 요청
            await updateUserAddress(get().accessToken, address.roadAddr, get().refreshTokens);
            console.log('백엔드 주소 업데이트 성공');
          } catch (error) {
            console.error('백엔드 주소 업데이트 실패:', error);
            
            // 토큰 갱신 실패 에러인 경우 로그아웃 처리
            if (error.message && error.message.includes('토큰 갱신 실패')) {
              console.log('🚪 토큰 갱신 실패로 인한 로그아웃 처리');
              get().logoutUser();
              // 로그인 페이지로 리다이렉트
              window.location.href = '/login';
              return;
            }
            
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
        const { refreshToken, isRefreshing, accessToken } = get();
        
        console.log('🔄 토큰 갱신 요청 시작');
        console.log('📊 현재 상태:', {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          isRefreshing: isRefreshing,
          accessTokenPreview: accessToken ? `${accessToken.substring(0, 20)}...` : 'null',
          refreshTokenPreview: refreshToken ? `${refreshToken.substring(0, 20)}...` : 'null'
        });
        
        // 이미 갱신 중이면 대기
        if (isRefreshing) {
          console.log('⏳ 토큰 갱신이 이미 진행 중입니다. 대기 중...');
          // 갱신 완료까지 대기
          return new Promise((resolve) => {
            const checkRefresh = () => {
              const { isRefreshing: currentRefreshing } = get();
              if (!currentRefreshing) {
                console.log('✅ 대기 중인 토큰 갱신 완료');
                resolve(true);
              } else {
                setTimeout(checkRefresh, 100);
              }
            };
            checkRefresh();
          });
        }
        
        if (!refreshToken) {
          console.error('❌ 리프레시 토큰이 없습니다.');
          alert('토큰이 만료되었습니다. 다시 로그인해주세요.');
          // 로그아웃 처리
          get().logoutUser();
          // 로그인 페이지로 리다이렉트
          window.location.href = '/login';
          return false;
        }
        
        console.log('🚀 토큰 갱신 프로세스 시작');
        set({ isRefreshing: true });
        
        try {
          console.log('📡 백엔드에 토큰 갱신 요청 전송...');
          const response = await refreshAccessToken(refreshToken);
          console.log('📨 백엔드 응답 수신:', {
            hasAccessToken: !!response.access_token,
            hasRefreshToken: !!response.refresh_token,
            responseKeys: Object.keys(response)
          });
          
          const { access_token, refresh_token: newRefreshToken } = response;
          
          console.log('💾 새로운 토큰 정보 저장:', {
            newAccessTokenPreview: access_token ? `${access_token.substring(0, 20)}...` : 'null',
            newRefreshTokenPreview: newRefreshToken ? `${newRefreshToken.substring(0, 20)}...` : '기존 토큰 유지'
          });
          
          set({
            accessToken: access_token,
            refreshToken: newRefreshToken || refreshToken, // 새로운 refreshToken이 있으면 사용
            isRefreshing: false
          });
          
          console.log('✅ 토큰 갱신 성공 완료');
          return true;
        } catch (error) {
          console.error('❌ 토큰 갱신 실패:', error);
          alert('토큰이 만료되었습니다. 다시 로그인해주세요.');
          set({ isRefreshing: false });
          // 토큰 갱신 실패 시 로그아웃 처리
          get().logoutUser();
          // 로그인 페이지로 리다이렉트
          window.location.href = '/login';
          return false;
        }
      },
      
      /**
       * 토큰 유효성 확인
       * @returns {boolean} 토큰 유효 여부
       */
      isTokenValid: () => {
        const { accessToken } = get();
        // 클라이언트에서는 토큰 존재 여부만 확인, 실제 만료는 백엔드에서 처리
        return !!accessToken;
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
      }),
    }
  )
);

export default useUserInfo; 