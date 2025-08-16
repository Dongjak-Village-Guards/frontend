/**
 * Zustand 스토어
 * 홈 화면의 가게 목록 정렬, 시간, 페이지 상태를 관리
 * 백엔드 API를 사용하여 가게 목록을 가져오고 정렬
 */

import { create } from 'zustand';
import { fetchStores } from '../../apis/storeAPI';

const useStore = create((set, get) => ({
  // ===== 인증 상태 관리 =====
  /** 현재 로그인한 사용자 정보 */
  user: null,
  
  // ===== 페이지 상태 관리 =====
  /** 현재 활성화된 페이지 */
  currentPage: 'login',
  
  /** 주소 설정 페이지 접근 경로 추적 */
  fromHomePage: false,
  
  // ===== 주소 상태 관리 =====
  /** 현재 주소 (7글자 초과 시 ... 처리) */
  currentAddress: '노량진동 240-30',
  
  // ===== 시간 상태 관리 =====
  /** 현재 시간 (HH:MM 형식) */
  currentTime: new Date().toLocaleTimeString('ko-KR', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  }),
  
  // 디버깅: 초기 currentTime 값 확인
  // console.log('useStore 초기 currentTime:', new Date().toLocaleTimeString('ko-KR', { 
  //   hour: '2-digit', 
  //   minute: '2-digit',
  //   hour12: false 
  // })),
  
  // ===== 정렬 옵션 상태 관리 =====
  /** 현재 정렬 옵션 ('discount' | 'price') */
  sortOption: 'discount',
  
  // ===== 필터 기준 상태 관리 =====
  /** 상세 필터 기준 (상세필터 페이지/바텀시트에서 수정) */
  filters: {
    // 선택된 업종 목록 (예: ['nail', 'hair'])
    categories: [],
    // 표시할 시간(가용 시간 기준). 형식: 'HH:MM' (필수값)
    availableAt: (() => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      // 현재가 정각이면 다음 시간, 아니면 다음 정각
      const nextHour = currentMinute === 0 ? (currentHour + 1) % 24 : (currentHour + 1) % 24;
      return `${String(nextHour).padStart(2, '0')}:00`;
    })(),
    // 추후 확장: 거리, 평점, 최소 할인율 등
    // distanceKm: null,
    // ratingMin: null,
    // discountMin: null,
  },

  // ===== 가게 데이터 상태 관리 =====
  /** 백엔드 API에서 가져온 가게 목록 데이터 */
  stores: [],
  loading: false,

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
  logout: () => set({ user: null, currentPage: 'login' }),
  
  /**
   * 현재 페이지 변경
   * @param {string} page - 변경할 페이지명
   */
  setCurrentPage: (page) => set({ currentPage: page }),
  
  /**
   * 주소 설정 페이지 접근 경로 설정
   * @param {boolean} fromHome - HomePage에서 접근했는지 여부
   */
  setFromHomePage: (fromHome) => set({ fromHomePage: fromHome }),
  
  /**
   * 현재 주소 변경 (7글자 초과 시 ... 처리)
   * @param {string} address - 새로운 주소
   */
  setCurrentAddress: (address) => {
    const truncatedAddress = address.length > 7 ? `${address.slice(0, 7)}...` : address;
    set({ currentAddress: truncatedAddress });
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
    console.log('updateCurrentTime 호출됨, 새 currentTime:', newTime);
    
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
    
    // 초기 availableAt 설정 (다음 정각 기준)
    const currentHour = new Date().getHours();
    const currentMinute = new Date().getMinutes();
    const nextHour = currentMinute === 0 ? (currentHour + 1) % 24 : (currentHour + 1) % 24;
    const initialAvailableAt = `${String(nextHour).padStart(2, '0')}:00`;
    
    console.log('initializeTime 호출됨, 초기 시간:', newTime, '초기 availableAt:', initialAvailableAt);
    
    set({ 
      currentTime: newTime,
      filters: {
        ...get().filters,
        availableAt: initialAvailableAt
      }
    });
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
    const newState = set((state) => ({
      filters: { ...state.filters, ...partial }
    }));
    console.log('setFilters 호출됨, 새로운 filters:', { ...get().filters, ...partial });
    return newState;
  },
  
  /** 필터 초기화 */
  resetFilters: () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const nextHour = currentMinute === 0 ? (currentHour + 1) % 24 : (currentHour + 1) % 24;
    const defaultAvailableAt = `${String(nextHour).padStart(2, '0')}:00`;
    
    set({
      filters: { categories: [], availableAt: defaultAvailableAt }
    });
  },
  
  /**
   * 백엔드 API에서 가게 목록 가져오기
   * @param {number} time - 시간 필터 (0~36)
   * @param {string} category - 업종 필터 (선택)
   */
  fetchStores: async (time = null, category = null) => {
    set({ loading: true });
    try {
      const stores = await fetchStores(time, category);
      set({ stores, loading: false });
      console.log('가게 목록 가져오기 성공:', stores.length, '개');
    } catch (error) {
      console.error('가게 목록 가져오기 실패:', error);
      set({ loading: false });
      // 에러 발생 시 빈 배열로 설정
      set({ stores: [] });
    }
  },
  
  /**
   * 가게 좋아요 토글
   * @param {number} storeId - 가게 ID
   */
  toggleLike: (storeId) => set((state) => ({
    stores: state.stores.map(store => 
      store.id === storeId 
        ? { ...store, isLiked: !store.isLiked }
        : store
    )
  })),

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
  startReservation: (menu, designer = null) => set({
    isReserving: true,
    selectedMenu: menu,
    selectedDesigner: designer,
    isAgreed: false,  // 초기화
    showPiAgreement: false,
  }),

  /**
   * 예약 취소
   */
  cancelReservation: () => set({
    isReserving: false,
    selectedMenu: null,
    selectedDesigner: null,
    showPiAgreement: false,
    isAgreed: false,
  }),

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
    const { stores, sortOption, filters } = get();
    const sortedStores = [...stores];
    console.log('getSortedStores 호출, 현재 store 상태:', get());
    let filteredStores = [...stores];
    
    // 1) 업종 필터 적용
    if (filters.categories.length > 0) {
      // 현재 mock 데이터에는 업종 정보가 없으므로 임시로 모든 가게를 표시
      // 추후 store 객체에 category 필드가 추가되면 아래 주석을 해제
    //   filteredStores = filteredStores.filter(store => 
    //     filters.categories.includes(store.category)
    //   );
      console.log('업종 필터 적용됨:', filters.categories);
      console.log('filteredStores:', filteredStores);
    }

    // 2) 시간 필터 적용 - 백서버에서 이미 필터링된 결과를 받아오므로 클라이언트에서 추가 필터링 불필요
    if (filters.availableAt) {
      console.log('시간 필터 적용됨 (백서버에서 필터링):', filters.availableAt);
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
          return bMaxDiscount - aMaxDiscount; // 내림차순 정렬 (b가 a보다 크면 앞으로)
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
          return aMinPrice - bMinPrice;
        });
      // 거리 기준 오름차순 정렬 (가까운 가게가 먼저)
      case 'distance':
        return storesToSort.sort((a, b) => a.distance - b.distance);
      default:
        return filteredStores;
    }
  }
}));

export default useStore;