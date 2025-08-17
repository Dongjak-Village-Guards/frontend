/**
 * 애플리케이션 전용 저장소 클래스
 * localStorage를 중앙화된 방식으로 관리
 * 새로고침/탭 종료에도 데이터 유지, 로그아웃 시에만 리셋
 */

class AppStorage {
  constructor() {
    this.storageKey = 'appData';
    this.data = {};
    this.loadFromStorage();
  }

  /**
   * 데이터 저장
   * @param {string} key - 저장할 키
   * @param {any} value - 저장할 값
   */
  set(key, value) {
    this.data[key] = value;
    this.saveToStorage();
  }

  /**
   * 데이터 조회
   * @param {string} key - 조회할 키
   * @returns {any} 저장된 값
   */
  get(key) {
    return this.data[key];
  }

  /**
   * 키 존재 여부 확인
   * @param {string} key - 확인할 키
   * @returns {boolean} 존재 여부
   */
  has(key) {
    return key in this.data;
  }

  /**
   * 특정 키 삭제
   * @param {string} key - 삭제할 키
   */
  remove(key) {
    delete this.data[key];
    this.saveToStorage();
  }

  /**
   * 모든 데이터 삭제 (로그아웃 시 사용)
   */
  clear() {
    this.data = {};
    localStorage.removeItem(this.storageKey);
  }

  /**
   * 모든 키 목록 반환
   * @returns {string[]} 키 목록
   */
  keys() {
    return Object.keys(this.data);
  }

  /**
   * 저장된 데이터 크기 반환
   * @returns {number} 데이터 개수
   */
  size() {
    return Object.keys(this.data).length;
  }

  /**
   * localStorage에 데이터 저장
   * @private
   */
  saveToStorage() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    } catch (error) {
      console.error('AppStorage 저장 실패:', error);
    }
  }

  /**
   * localStorage에서 데이터 로드
   * @private
   */
  loadFromStorage() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      this.data = saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.error('AppStorage 로드 실패:', error);
      this.data = {};
    }
  }
}

// 싱글톤 인스턴스 생성
const appStorage = new AppStorage();

export default appStorage; 