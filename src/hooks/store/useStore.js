/**
 * Zustand 스토어
 * 홈 화면의 가게 목록 정렬, 시간, 페이지 상태를 관리
 * 백엔드 API를 사용하여 가게 목록을 가져오고 정렬
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fetchStoresFromAPI, fetchUserLikes, createLike, deleteLike, convertTimeToParam } from '../../apis/storeAPI';
import useUserInfo from '../user/useUserInfo';
import { getNearestHour } from '../../components/features/filter/TimeFilter/TimeFilter';

const useStore = create(
  persist(
    (set, get) => ({
      // ===== 인증 상태 관리 =====
      /** 현재 로그인한 사용자 정보 */
      user: null,
      
      // ===== 페이지 상태 관리 =====
      /** 현재 활성화된 페이지 */
      currentPage: 'home',
      
      /** 주소 설정 페이지 접근 경로 추적 */
      fromHomePage: false,
      
      /** 찜페이지에서 상세페이지로 이동했는지 추적 */
      fromFavoritePage: false,
      /** 일정페이지에서 상세페이지로 이동했는지 추적 */
      fromSchedulePage: false,
      
      // ===== 주소 상태 관리 =====
      /** 현재 주소 (7글자 초과 시 ... 처리) */
    
      
      // ===== 시간 상태 관리 =====
      /** 현재 시간 (HH:MM 형식) */
      currentTime: new Date().toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }),
      
      // ===== 정렬 옵션 상태 관리 =====
      /** 현재 정렬 옵션 ('discount' | 'price') */
      sortOption: 'discount',

      // ===== 필터 기준 상태 관리 =====
      /** 상세 필터 기준 (상세필터 페이지/바텀시트에서 수정) */
      filters: {
        // 선택된 업종 목록 (예: ['nail', 'hair'])
        categories: [],
      },

      // ===== 시간 상태 관리 =====
      /** 표시될 시간 (AppStorage에서 관리, null = 초기값) */
      time: null,
      

      // ===== 가게 데이터 상태 관리 =====
      /** 백엔드 API에서 가져온 가게 목록 데이터 */
      stores: [],
      loading: false,

      // ===== 찜 상태 관리 =====
      /** 사용자가 찜한 가게 ID 목록 */
      likedStoreIds: [],
      /** 찜 관련 로딩 상태 */
      likeLoading: false,

      // ===== 예약 상태 관리 =====
      isReserving: false,
      selectedMenu: null,
      selectedDesigner: null,

      // ===== 개인정보 동의서 상태 관리 =====
      showPiAgreement: false,
      isAgreed: false,

      // ===== 액션 함수들 =====
      
      /**
       * 사용자 정보 설정
       * @param {Object} user - 사용자 정보 객체
       */
      setUser: (user) => set({ user }),
      
      /**
       * 로그아웃
       */
      logout: () => {
        set({ 
          user: null, 
          currentPage: 'login',
          stores: [],
          likedStoreIds: [],
          isReserving: false,
          selectedMenu: null,
          selectedDesigner: null,
          showPiAgreement: false,
          isAgreed: false
        });
      },
      
      /**
       * 현재 페이지 변경
       * @param {string} page - 변경할 페이지명
       */
      setCurrentPage: (page) => {
        set({ currentPage: page });
      },
      
      /**
       * 주소 설정 페이지 접근 경로 설정
       * @param {boolean} fromHome - HomePage에서 접근했는지 여부
       */
      setFromHomePage: (fromHome) => set({ fromHomePage: fromHome }),
      
      /**
       * 찜페이지에서 상세페이지로 이동했는지 설정
       * @param {boolean} fromFavorite - FavoritePage에서 접근했는지 여부
       */
      setFromFavoritePage: (fromFavorite) => set({ fromFavoritePage: fromFavorite }),

      /**
       * 일정페이지에서 상세페이지로 이동했는지 설정
       * @param {boolean} fromSchedule - SchedulePage에서 접근했는지 여부
       */
      setFromSchedulePage: (fromSchedule) => set({ fromSchedulePage: fromSchedule }),
      


       /**
       * 시간 설정 (AppStorage에 저장)
       * @param {string} newTime - 새로운 시간 (HH:MM 형식)
       */
      setTime: (newTime) => {
        set({ time: newTime });
      },
      
      /**
       * 시간 만료 체크 및 자동 업데이트
       * 현재 설정된 time이 현재 시각의 다음 정각보다 작으면 자동으로 다음 정각으로 업데이트
       */
      checkAndUpdateTimeIfExpired: () => {
        const { time, currentTime, setTime } = get();
        
        if (time === null) {
          // time이 null인 경우 초기화
          const nearestHour = getNearestHour(currentTime);
          setTime(nearestHour);
          return;
        }
        
        // 현재 설정된 time과 다음 정각 비교
        const timeHour = convertTimeToParam(time);
        const [currentHour, currentMinute] = currentTime.split(':').map(Number);
        const nextHour = currentMinute === 0 ? (currentHour + 1) % 24 : (currentHour + 1) % 24;
        
        // time이 다음 정각보다 작으면 만료된 것으로 판단
        if (timeHour < nextHour) {
          const updatedTime = getNearestHour(currentTime);
          setTime(updatedTime);
        } else {
        }
      },
      
      
      /**
       * 현재 시간 업데이트 (1분마다 자동 호출)
       */
      updateCurrentTime: () => {
        const newTime = new Date().toLocaleTimeString('ko-KR', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        });
        
        // currentTime만 업데이트, availableAt은 사용자가 직접 선택한 값 유지
        set({ currentTime: newTime });
      },
      
      /**
       * 초기 시간 설정 (앱 시작 시 한 번만 호출)
       */
      initializeTime: () => {
        const newTime = new Date().toLocaleTimeString('ko-KR', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        });
        
        // time이 null일 때만 기본값 설정 (사용자가 선택한 값이 있으면 유지)
        const currentTime = get().time;
        
        if (currentTime === null) {
          const currentHour = new Date().getHours();
          const currentMinute = new Date().getMinutes();
          const nextHour = currentMinute === 0 ? (currentHour + 1) % 24 : (currentHour + 1) % 24;
          const initialTime = `${String(nextHour).padStart(2, '0')}:00`;
          
          set({ 
            currentTime: newTime,
            time: initialTime
          });
        } else {
          
          set({ 
            currentTime: newTime
          });
        }
      },
      
      /**
       * 정렬 옵션 변경
       * @param {string} option - 정렬 옵션 ('discount' | 'price')
       */
      setSortOption: (option) => set({ sortOption: option }),
      
      /**
       * 상세 필터 기준 일부 업데이트
       * @param {Partial<typeof filters>} partial - 변경할 필드만 전달
       */
      setFilters: (partial) => {
        const newFilters = { ...get().filters, ...partial };
        set({ filters: newFilters });
      },
      
      /** 필터 초기화 */
      resetFilters: () => {
        set({
          filters: { categories: [] }
        });
      },
      
      /**
       * 백엔드 API에서 가게 목록 가져오기
       * @param {string|number|null} time - 시간 필터 (HH:MM 형식, 숫자, 또는 null)
       * @param {string|null} category - 업종 필터 (선택)
       */
      fetchStores: async (time = null, category = null) => {
        set({ loading: true });
        try {
          // accessToken 가져오기
          const { accessToken, isTokenValid, refreshTokens } = useUserInfo.getState();
          
          
          // 토큰이 있으면 유효성 확인 및 갱신
          if (accessToken && !isTokenValid()) {
            const refreshSuccess = await refreshTokens();
            if (!refreshSuccess) {
              console.error('토큰 갱신에 실패했습니다.');
              // 토큰 갱신 실패 시에도 계속 진행 (익명 요청)
            } else {
            }
          }
          
          // 갱신된 토큰 가져오기
          const { accessToken: currentToken } = useUserInfo.getState();
          
          // API 호출 (storeAPI에서 모든 로직 처리)
          const stores = await fetchStoresFromAPI(time, category, currentToken);
          
          // 백엔드에서 받은 is_liked 필드 그대로 사용
          set({ stores: stores, loading: false });
        } catch (error) {
          console.error('가게 목록 가져오기 실패:', error);
          set({ loading: false });
          // 에러 발생 시 빈 배열로 설정
          set({ stores: [] });
        }
      },
      
      /**
       * 가게 좋아요 토글 (기존 함수 - UI 상태만 변경)
       * @param {number} storeId - 가게 ID
       */
      toggleLike: (storeId) => set((state) => ({
        stores: state.stores.map(store => 
          store.id === storeId 
            ? { ...store, isLiked: !store.isLiked }
            : store
        )
      })),

      /**
       * API와 함께 가게 좋아요 토글
       * @param {number} storeId - 가게 ID
       */
      toggleLikeWithAPI: async (storeId) => {
        const { filters, stores, likedStoreIds, time } = get();
        const { accessToken, isTokenValid, refreshTokens } = useUserInfo.getState();
        
        
        if (!accessToken) {
          console.error('사용자 인증 정보가 없습니다.');
          alert('로그인이 필요합니다.');
          return;
        }

        // 토큰 유효성 확인 및 갱신
        if (!isTokenValid()) {
          const refreshSuccess = await refreshTokens();
          if (!refreshSuccess) {
            console.error('토큰 갱신에 실패했습니다.');
            alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
            return;
          }
        }

        // 갱신된 토큰 가져오기
        const { accessToken: refreshedToken } = useUserInfo.getState();
        const tokenToUse = refreshedToken || accessToken;

        // 현재 가게의 찜 상태 확인
        const currentStore = stores.find(store => store.id === storeId);
        const isCurrentlyLiked = currentStore?.isLiked || likedStoreIds.includes(storeId);
        
        
        // Optimistic Update: 즉시 UI 업데이트
        set((state) => ({
          stores: state.stores.map(store => 
            store.id === storeId 
              ? { ...store, isLiked: !isCurrentlyLiked }
              : store
          ),
          likeLoading: true
        }));

        try {
          if (isCurrentlyLiked) {
            // 이미 찜한 상태면 삭제
            // 먼저 찜 목록을 조회하여 해당 store_id의 like_id 찾기
            const timeParam = time ? 
              parseInt(time.split(':')[0]) : 
              new Date().getHours();
            const categoryParam = filters.categories.length > 0 ? filters.categories[0] : null;
            
            
            const likes = await fetchUserLikes(timeParam, categoryParam, tokenToUse);
            const targetLike = likes.find(like => like.store_id === storeId);
            
            if (!targetLike) {
              throw new Error('찜 정보를 찾을 수 없습니다.');
            }
            
            await deleteLike(targetLike.like_id, tokenToUse);
            
            // likedStoreIds에서 제거
            set((state) => ({
              likedStoreIds: state.likedStoreIds.filter(id => id !== storeId)
            }));
          } else {
            // 아직 찜하지 않은 상태면 생성
            const newLike = await createLike(storeId, tokenToUse);
            
            // likedStoreIds에 추가
            set((state) => ({
              likedStoreIds: [...state.likedStoreIds, storeId]
            }));
          }
        } catch (error) {
          console.error('찜 토글 실패:', error);
          
          // 에러 발생 시 원래 상태로 되돌리기
          set((state) => ({
            stores: state.stores.map(store => 
              store.id === storeId 
                ? { ...store, isLiked: isCurrentlyLiked }
                : store
            )
          }));
          
          // 에러 메시지 표시 (추후 토스트 컴포넌트로 대체 가능)
          alert(error.message || '찜 상태 변경에 실패했습니다.');
        } finally {
          set({ likeLoading: false });
        }
      },



      selectDesigner: (designer) => set({
        selectedDesigner: designer,
        selectedMenu: null,
        isReserving: false,
        isAgreed: false,
        showPiAgreement: false,
      }),

      /**
       * 예약 시작
       * @param {Object} menu - 선택된 메뉴
       * @param {Object} designer - 선택된 디자이너 (선택 사항)
       */
      startReservation: (menu, designer = null) => {
        
        // 예약 상태를 localStorage에 저장 (새로고침 시 복원용)
        if (menu) {
          const reservationData = {
            menu: menu,
            designer: designer,
            timestamp: Date.now()
          };
          localStorage.setItem('reservationData', JSON.stringify(reservationData));
        }
        
        set({
          isReserving: true,
          selectedMenu: menu,
          selectedDesigner: designer,
          isAgreed: false,  // 초기화
          showPiAgreement: false,
        });
      },

      /**
       * 예약 취소
       */
      cancelReservation: () => {
        // localStorage에서 예약 데이터 제거
        localStorage.removeItem('reservationData');
        
        set({
          isReserving: false,
          selectedMenu: null,
          selectedDesigner: null,
          showPiAgreement: false,
          isAgreed: false,
        });
      },

      /**
       * 새로고침 시 예약 상태 복원
       */
      restoreReservationState: () => {
        const reservationData = localStorage.getItem('reservationData');
        
        if (reservationData) {
          try {
            const data = JSON.parse(reservationData);
            
            // 24시간 이내의 데이터만 유효
            const now = Date.now();
            const dataAge = now - data.timestamp;
            const maxAge = 24 * 60 * 60 * 1000; // 24시간
            
            if (dataAge < maxAge) {
              set({
                isReserving: true,
                selectedMenu: data.menu,
                selectedDesigner: data.designer,
                isAgreed: false,
                //showPiAgreement: false,
              });
              return true;
            } else {
              localStorage.removeItem('reservationData');
            }
          } catch (error) {
            localStorage.removeItem('reservationData');
          }
        }
        return false;
      },

      /**
       * 개인정보 동의서 표시/숨김 토글
       */
      togglePiAgreement: () => set((state) => ({
        showPiAgreement: !state.showPiAgreement,
      })),
      setAgreed: (agreed) => set({ isAgreed: agreed }),
      
      // ===== Getter 함수들 ===== //
      
      /**
       * 현재 정렬 옵션에 따른 정렬된 가게 목록 반환
       * @returns {Array} 정렬된 가게 목록
       */
      getSortedStores: () => {
        const { stores, sortOption, filters, time } = get();
        const sortedStores = [...stores];
        let filteredStores = [...stores];
        
        // 1) 업종 필터 적용
        if (filters.categories.length > 0) {
          // 현재 mock 데이터에는 업종 정보가 없으므로 임시로 모든 가게를 표시
          // 추후 store 객체에 category 필드가 추가되면 아래 주석을 해제
        //  filteredStores = filteredStores.filter(store => 
        //  filters.categories.includes(store.category)
          // );
        }

        // 2) 시간 필터 적용 - 백서버에서 이미 필터링된 결과를 받아오므로 클라이언트에서 추가 필터링 불필요
        if (time) {

        }

        // 3) 정렬 적용
        const storesToSort = [...filteredStores];
        switch (sortOption) {
          // 최대 할인율 기준 내림차순 정렬 (높은 할인율이 먼저)
          case 'discount':
            return storesToSort.sort((a, b) => {
              const aMaxDiscount = a.hasDesigners
                ? Math.max(...a.designers.flatMap(d => d.menus.map(m => m.discountRate))) // 디자이너가 있으면 모든 디자이너의 메뉴에서 최대 할인율 추출
                : Math.max(...a.menus.map(m => m.discountRate));  // 디자이너가 없으면 가게의 메뉴에서 최대 할인율 추출
              const bMaxDiscount = b.hasDesigners
                ? Math.max(...b.designers.flatMap(d => d.menus.map(m => m.discountRate))) // // 디자이너가 있으면 모든 디자이너의 메뉴에서 최대 할인율 추출
                : Math.max(...b.menus.map(m => m.discountRate));  // 디자이너가 없으면 가게의 메뉴에서 최대 할인율 추출
              
              // 할인율이 다르면 할인율 기준으로 정렬
              if (aMaxDiscount !== bMaxDiscount) {
                return bMaxDiscount - aMaxDiscount; // 내림차순 정렬 (b가 a보다 크면 앞으로)
              }
              
              // 할인율이 같으면 가게 이름으로 가나다순 정렬
              return a.name.localeCompare(b.name, 'ko');
            });
          // 할인 가격 기준 오름차순 정렬 (낮은 가격이 먼저)
          case 'price':
            return storesToSort.sort((a, b) => {
              const aMinPrice = a.hasDesigners
                ? Math.min(...a.designers.flatMap(d => d.menus.map(m => m.discountPrice)))
                : Math.min(...a.menus.map(m => m.discountPrice));
              const bMinPrice = b.hasDesigners
                ? Math.min(...b.designers.flatMap(d => d.menus.map(m => m.discountPrice)))
                : Math.min(...b.menus.map(m => m.discountPrice));
              
              // 가격이 다르면 가격 기준으로 정렬
              if (aMinPrice !== bMinPrice) {
                return aMinPrice - bMinPrice;
              }
              
              // 가격이 같으면 가게 이름으로 가나다순 정렬
              return a.name.localeCompare(b.name, 'ko');
            });
          // 거리 기준 오름차순 정렬 (가까운 가게가 먼저)
          case 'distance':
            return storesToSort.sort((a, b) => {
              // 거리가 다르면 거리 기준으로 정렬
              if (a.distance !== b.distance) {
                return a.distance - b.distance;
              }
              
              // 거리가 같으면 가게 이름으로 가나다순 정렬
              return a.name.localeCompare(b.name, 'ko');
            });
          default:
            // 기본 정렬: 가게 이름 가나다순
            return filteredStores.sort((a, b) => a.name.localeCompare(b.name, 'ko'));
        }
      }
    }),
    {
      name: 'app-storage', // localStorage 키
      partialize: (state) => ({
        // persist할 상태만 선택 (로그아웃까지 유지)
        filters: state.filters,
        time: state.time,
        sortOption: state.sortOption,
      
        likedStoreIds: state.likedStoreIds,
        stores: state.stores,
      }),
    }
  )
);

export default useStore;