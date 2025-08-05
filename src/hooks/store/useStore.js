import { create } from 'zustand';
import { STORES_DATA } from '../../apis/mock/mockShopList';

/**  전역 상태 관리 스토어(Zustand) **/

const useStore = create((set, get) => ({
  // ===== 인증 상태 관리 =====
  /** 현재 로그인한 사용자 정보 */
  user: null,
  
  // ===== 페이지 상태 관리 =====
  /** 현재 활성화된 페이지 */
  currentPage: 'login',
  
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
  
  // ===== 정렬 옵션 상태 관리 =====
  /** 현재 정렬 옵션 ('discount' | 'price') */
  sortOption: 'discount',
  
  // ===== 가게 데이터 상태 관리 ===== //
  /* mockShopList.js에서 가져온 가게 목록 데이터 */
  stores: STORES_DATA,

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
  updateCurrentTime: () => set({ 
    currentTime: new Date().toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    })
  }),
  
  /**
   * 정렬 옵션 변경
   * @param {string} option - 정렬 옵션 ('discount' | 'price')
   */
  setSortOption: (option) => set({ sortOption: option }),
  
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
  
  // ===== Getter 함수들 ===== //
  
  /**
   * 현재 정렬 옵션에 따른 정렬된 가게 목록 반환
   * @returns {Array} 정렬된 가게 목록
   */
  getSortedStores: () => {
    const { stores, sortOption } = get();
    const sortedStores = [...stores];
    
    switch (sortOption) {
      case 'discount':
        return sortedStores.sort((a, b) => b.discountRate - a.discountRate);
      case 'price':
        return sortedStores.sort((a, b) => a.discountPrice - b.discountPrice);
      default:
        return sortedStores;
    }
  }
}));

export default useStore;