/**
 * Zustand 스토어
 * 홈 화면의 가게 목록, 정렬, 시간, 필터, 예약 상태를 관리
 * mockShopList.js의 데이터를 storeAPI.js를 통해 비동기로 로딩
 */

import { create } from 'zustand';
import { getStores, getCategoryOptions, getSortOptions } from '../../apis/storeAPI';

const useStore = create((set, get) => ({
  // ===== 인증 상태 관리 =====
  user: null,

  // ===== 페이지 상태 관리 =====
  currentPage: 'login',
  fromHomePage: false,

  // ===== 주소 상태 관리 =====
  currentAddress: '노량진동 240-30',

  // ===== 시간 상태 관리 =====
  currentTime: new Date().toLocaleTimeString('ko-KR', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  }),

  // ===== 정렬 옵션 상태 관리 =====
  sortOption: 'discount',

  // ===== 필터 기준 상태 관리 =====
  filters: {
    categories: [],
    availableAt: null,
  },

  // ===== 가게 데이터 상태 관리 =====
  stores: [], // STORES_DATA 대신 비동기로 로딩
  categoryOptions: [], // CATEGORY_OPTIONS
  sortOptions: [],     // SORT_OPTIONS

  // ===== 예약 상태 관리 =====
  isReserving: false,
  selectedMenu: null,
  selectedDesigner: null,

  // ===== 개인정보 동의서 상태 관리 =====
  showPiAgreement: false,
  isAgreed: false,

  // ===== 데이터 로딩 액션 =====

  /**
   * 가게 목록 데이터 로딩
   */
  fetchStores: async () => {
    const stores = await getStores();
    set({ stores });
  },

  /**
   * 필터 옵션 데이터 로딩 (업종, 정렬)
   */
  fetchFilterOptions: async () => {
    const [categories, sorts] = await Promise.all([
      getCategoryOptions(),
      getSortOptions()
    ]);
    set({ categoryOptions: categories, sortOptions: sorts });
  },

  // ===== 일반 액션 =====

  setUser: (user) => set({ user }),
  logout: () => set({ user: null, currentPage: 'login' }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setFromHomePage: (fromHome) => set({ fromHomePage: fromHome }),

  /**
   * 현재 주소 변경 (7글자 초과 시 ... 처리)
   */
  setCurrentAddress: (address) => {
    const truncatedAddress = address.length > 7 ? `${address.slice(0, 7)}...` : address;
    set({ currentAddress: truncatedAddress });
  },

  /**
   * 현재 시간 업데이트
   */
  updateCurrentTime: () => {
    const newTime = new Date().toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
    set({ currentTime: newTime });
  },

  setSortOption: (option) => set({ sortOption: option }),

  /**
   * 필터 기준 업데이트
   */
  setFilters: (partial) => set((state) => ({
    filters: { ...state.filters, ...partial }
  })),

  resetFilters: () => set({
    filters: { categories: [], availableAt: null }
  }),

  /**
   * 가게 좋아요 토글
   */
  toggleLike: (storeId) => set((state) => ({
    stores: state.stores.map(store => 
      store.id === storeId 
        ? { ...store, isLiked: !store.isLiked }
        : store
    )
  })),

  /**
   * 디자이너 선택
   */
  selectDesigner: (designer) => set({
    selectedDesigner: designer,
    selectedMenu: null,
    isReserving: false,
    isAgreed: false,
    showPiAgreement: false,
  }),

  /**
   * 예약 시작
   */
  startReservation: (menu, designer = null) => set({
    isReserving: true,
    selectedMenu: menu,
    selectedDesigner: designer,
    isAgreed: false,
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
   * 예약 완료 처리
   * 추후: 서버에 예약 정보 저장, 페이지 이동 등 확장 가능
   */
  completeReservation: () => {
    alert('예약이 완료되었습니다!');
    get().cancelReservation();
  },

  togglePiAgreement: () => set((state) => ({
    showPiAgreement: !state.showPiAgreement,
  })),
  setAgreed: (agreed) => set({ isAgreed: agreed }),

  // ===== Getter 함수 =====

  /**
   * 현재 정렬 옵션에 따른 정렬된 가게 목록 반환
   */
  getSortedStores: () => {
    const { stores, sortOption, filters } = get();
    let filteredStores = [...stores];

    // 업종 필터 (추후 store.category 필드 기반으로 확장 가능)
    if (filters.categories.length > 0) {
      // 예: filteredStores = filteredStores.filter(store => filters.categories.includes(store.category));
    }

    // 정렬
    switch (sortOption) {
      case 'discount':
        return filteredStores.sort((a, b) => {
          const aMax = a.hasDesigners
            ? Math.max(...a.designers.flatMap(d => d.menus.map(m => m.discountRate)))
            : Math.max(...a.menus.map(m => m.discountRate));
          const bMax = b.hasDesigners
            ? Math.max(...b.designers.flatMap(d => d.menus.map(m => m.discountRate)))
            : Math.max(...b.menus.map(m => m.discountRate));
          return bMax - aMax;
        });
      case 'price':
        return filteredStores.sort((a, b) => {
          const aMin = a.hasDesigners
            ? Math.min(...a.designers.flatMap(d => d.menus.map(m => m.discountPrice)))
            : Math.min(...a.menus.map(m => m.discountPrice));
          const bMin = b.hasDesigners
            ? Math.min(...b.designers.flatMap(d => d.menus.map(m => m.discountPrice)))
            : Math.min(...b.menus.map(m => m.discountPrice));
          return aMin - bMin;
        });
      case 'distance':
        return filteredStores.sort((a, b) => a.distance - b.distance);
      default:
        return filteredStores;
    }
  }
}));

export default useStore;
