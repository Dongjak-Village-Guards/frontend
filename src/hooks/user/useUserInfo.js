import { create } from 'zustand';

/**
 * 사용자 정보 관리 훅
 * 인증 상태, 주소, 찜 목록 등을 관리
 */
const useUserInfo = create((set, get) => ({
  // ===== 사용자 관련 상태 =====
  /** 현재 로그인한 사용자 정보 */
  authUser: JSON.parse(localStorage.getItem('authUser')) || null,
  
  /** 사용자가 등록한 주소 */
  userAddress: JSON.parse(localStorage.getItem('userAddress')) || null,
  
  /** 사용자가 찜한 가게 ID 목록 */
  favoriteStores: JSON.parse(localStorage.getItem('favoriteStores')) || [],
  
  /** 토큰 만료 시간 */
  tokenExpiry: JSON.parse(localStorage.getItem('tokenExpiry')) || null,
  
  // ===== 액션 함수들 =====
  
  /**
   * 사용자 정보 설정
   * @param {Object} user - 사용자 정보 객체
   */
  setAuthUser: (user) => {
    const expiryTime = Date.now() + (10 * 60 * 1000); // 10분 후 만료
    localStorage.setItem('authUser', JSON.stringify(user));
    localStorage.setItem('tokenExpiry', expiryTime.toString());
    set({ authUser: user, tokenExpiry: expiryTime });
  },
  
  /**
   * 사용자 주소 설정
   * @param {Object} address - 주소 정보 객체
   */
  setUserAddress: (address) => {
    localStorage.setItem('userAddress', JSON.stringify(address));
    set({ userAddress: address });
  },
  
  /**
   * 찜 목록에 가게 추가
   * @param {number} storeId - 가게 ID
   */
  addToFavorites: (storeId) => set((state) => {
    const newFavorites = [...state.favoriteStores, storeId];
    localStorage.setItem('favoriteStores', JSON.stringify(newFavorites));
    return { favoriteStores: newFavorites };
  }),
  
  /**
   * 찜 목록에서 가게 제거
   * @param {number} storeId - 가게 ID
   */
  removeFromFavorites: (storeId) => set((state) => {
    const newFavorites = state.favoriteStores.filter(id => id !== storeId);
    localStorage.setItem('favoriteStores', JSON.stringify(newFavorites));
    return { favoriteStores: newFavorites };
  }),
  
  /**
   * 로그아웃 - 모든 사용자 정보 초기화
   */
  logoutUser: () => {
    localStorage.removeItem('authUser');
    localStorage.removeItem('userAddress');
    localStorage.removeItem('favoriteStores');
    localStorage.removeItem('tokenExpiry');
    set({ 
      authUser: null, 
      userAddress: null, 
      favoriteStores: [],
      tokenExpiry: null 
    });
  },
}));

export default useUserInfo; 