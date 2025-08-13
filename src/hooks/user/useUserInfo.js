/**
 * 사용자 정보 관리 Zustand 스토어
 * 인증 상태, 주소, 찜 목록, 토큰 만료 시간 등을 관리
 * localStorage를 통해 상태를 유지하며, 로그인/로그아웃 시 동기화됨
 */

import { create } from 'zustand';

/**
 * localStorage 저장 유틸
 * @param {string} key
 * @param {any} value
 */
const saveToLocal = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

/**
 * localStorage 로딩 유틸
 * @param {string} key
 * @param {any} fallback
 * @returns {any}
 */
const loadFromLocal = (key, fallback = null) => {
  const raw = localStorage.getItem(key);
  try {
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const useUserInfo = create((set, get) => ({
  // ===== 사용자 상태 =====
  authUser: loadFromLocal('authUser'),
  userAddress: loadFromLocal('userAddress'),
  favoriteStores: loadFromLocal('favoriteStores', []),
  tokenExpiry: loadFromLocal('tokenExpiry'),

  // ===== 액션 =====

  /**
   * 사용자 정보 설정 (로그인 시 호출)
   * @param {Object} user
   */
  setAuthUser: (user) => {
    const expiryTime = Date.now() + 10 * 60 * 1000; // 10분 후 만료
    saveToLocal('authUser', user);
    saveToLocal('tokenExpiry', expiryTime);
    set({ authUser: user, tokenExpiry: expiryTime });
  },

  /**
   * 사용자 주소 설정
   * @param {Object} address
   */
  setUserAddress: (address) => {
    saveToLocal('userAddress', address);
    set({ userAddress: address });
  },

  /**
   * 찜 목록에 가게 추가
   * @param {number} storeId
   */
  addToFavorites: (storeId) => set((state) => {
    const newFavorites = [...new Set([...state.favoriteStores, storeId])];
    saveToLocal('favoriteStores', newFavorites);
    return { favoriteStores: newFavorites };
  }),

  /**
   * 찜 목록에서 가게 제거
   * @param {number} storeId
   */
  removeFromFavorites: (storeId) => set((state) => {
    const newFavorites = state.favoriteStores.filter(id => id !== storeId);
    saveToLocal('favoriteStores', newFavorites);
    return { favoriteStores: newFavorites };
  }),

  /**
   * 로그아웃 처리 - 모든 사용자 정보 초기화
   */
  logoutUser: () => {
    ['authUser', 'userAddress', 'favoriteStores', 'tokenExpiry'].forEach(key => localStorage.removeItem(key));
    set({
      authUser: null,
      userAddress: null,
      favoriteStores: [],
      tokenExpiry: null,
    });
  },
}));

export default useUserInfo;