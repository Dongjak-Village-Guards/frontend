/**
 * 메인 페이지 애플리케이션 컴포넌트
 * Layout과 페이지 라우팅
 * Zustand 스토어를 사용하여 전역 상태를 관리
 * 현재 페이지에 따라 컴포넌트 렌더링
 */

import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HomePage from './HomePage';
import FavoritePage from './FavoritePage';
import SchedulePage from './SchedulePage';
import MyPage from './MyPage';
import SearchAddressPage from './SearchAddressPage';
import LoginPage from './LoginPage';
import Layout from '../components/layout/Layout';
import useStore from '../hooks/store/useStore';
import useUserInfo from '../hooks/user/useUserInfo';

const MainPageApp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Zustand 스토어에서 페이지 관련 상태와 액션 가져오기
  const { currentpage, setCurrentPage, time, setTime, currentTime, checkAndUpdateTimeIfExpired } = useStore();
  
  // 사용자 정보에서 인증 상태와 주소 확인
  const { authUser, userAddress, accessToken } = useUserInfo();
  
  // userAddress 디버깅
  console.log('=== MainPageApp userAddress 상태 ===');
  console.log('userAddress:', userAddress);
  console.log('userAddress 타입:', typeof userAddress);
  console.log('localStorage userAddress:', localStorage.getItem('userAddress'));

  // URL 기반으로 currentpage 결정하는 함수 추가 (기존 로직과 병행)
  const getCurrentPageFromUrl = () => {
    console.log('=== MainPageApp URL 기반 라우팅 디버깅 ===');
    console.log('현재 location.pathname:', location.pathname);
    
    if (location.pathname === '/') {
      console.log('URL 기반 페이지: home');
      return 'home';
    }
    if (location.pathname === '/favorites') {
      console.log('URL 기반 페이지: favorites');
      return 'favorites';
    }
    if (location.pathname === '/history') {
      console.log('URL 기반 페이지: history');
      return 'history';
    }
    if (location.pathname === '/mypage') {
      console.log('URL 기반 페이지: mypage');
      return 'mypage';
    }
    if (location.pathname === '/search-address') {
      console.log('URL 기반 페이지: search-address');
      return 'search-address';
    }
    if (location.pathname === '/login') {
      console.log('URL 기반 페이지: login');
      return 'login';
    }
    console.log('URL 기반 페이지: home (기본값)');
    return 'home';
  };

  // URL 기반 currentpage (기존 currentpage와 병행)
  const urlBasedCurrentPage = getCurrentPageFromUrl();
  console.log('=== MainPageApp 상태 디버깅 ===');
  console.log('urlBasedCurrentPage:', urlBasedCurrentPage);
  console.log('currentpage (Zustand):', currentpage);
  console.log('최종 렌더링 페이지:', urlBasedCurrentPage || currentpage);

  // setCurrentPage 래퍼 함수 - URL도 함께 변경 (기존 로직과 병행)
  const handlePageChange = (page) => {
    setCurrentPage(page); // 기존 로직 유지
    
    // URL 동기화 추가
    switch (page) {
      case 'home':
        navigate('/');
        break;
      case 'favorites':
        navigate('/favorites');
        break;
      case 'history':
        navigate('/history');
        break;
      case 'mypage':
        navigate('/mypage');
        break;
      case 'search-address':
        navigate('/search-address');
        break;
      case 'login':
        navigate('/login');
        break;
    }
  };

  // 주소가 없으면 주소 검색 페이지로 설정
//  useEffect(() => {
//    if (!userAddress && urlBasedCurrentPage !== "search-address" && urlBasedCurrentPage !== "login") {
//      handlePageChange("search-address");
//    }
//  }, [userAddress, urlBasedCurrentPage]);

  // 초기 time 체크 및 설정
  useEffect(() => {
    checkAndUpdateTimeIfExpired();
  }, [currentTime, checkAndUpdateTimeIfExpired]);

  // 새로고침 시 URL 복원 (기존 로직과 병행)
//  useEffect(() => {
//    console.log('=== MainPageApp URL 복원 로직 ===');
//    const savedUrl = localStorage.getItem('currentUrl');
//    console.log('localStorage에 저장된 URL:', savedUrl);
//    console.log('현재 URL:', window.location.pathname);
    
//    // 새로고침 시에만 URL 복원 (페이지 로드 시에만)
//    if (savedUrl && savedUrl !== window.location.pathname && window.location.pathname === '/') {
//      console.log('URL 복원 실행:', savedUrl);
//      navigate(savedUrl);
//    } else {
//      console.log('URL 복원 조건 불만족 - 실행하지 않음');
//    }
//  }, [navigate]);

  // URL 변경 시 저장 및 currentpage 동기화 (기존 로직과 병행)
  useEffect(() => {
    console.log('=== MainPageApp URL 변경 감지 ===');
    console.log('이전 URL:', localStorage.getItem('currentUrl'));
    console.log('현재 URL:', location.pathname);
    console.log('이전 currentpage:', currentpage);
    
    localStorage.setItem('currentUrl', location.pathname);
    console.log('localStorage에 현재 URL 저장됨');
    
    // URL이 변경될 때 currentpage도 동기화
    const newPage = getCurrentPageFromUrl();
    console.log('URL 기반 새 페이지:', newPage);
    
    if (newPage !== currentpage) {
      console.log('currentpage 변경 필요:', currentpage, '->', newPage);
      setCurrentPage(newPage);
      console.log('setCurrentPage 호출 완료');
    } else {
      console.log('currentpage 변경 불필요 (동일함)');
    }
    
    console.log('=== MainPageApp URL 변경 감지 완료 ===');
  }, [location.pathname, currentpage, setCurrentPage]);

  // 로그인하지 않았으면 로그인 페이지로 설정
  console.log(authUser);
  console.log(accessToken);
  if (!accessToken && urlBasedCurrentPage !== "login") {
    return (
      <Layout currentpage="login" onPageChange={handlePageChange}>
        <LoginPage />
      </Layout>
    );
  }

  // 주소가 없으면 주소 검색 페이지 표시
  if (!userAddress && urlBasedCurrentPage !== "login" && urlBasedCurrentPage !== "history") {
    return (
      <Layout currentpage="search-address" onPageChange={handlePageChange}>
        <SearchAddressPage />
      </Layout>
    );
  }

  /**
   * 현재 페이지에 따른 컴포넌트 렌더링 함수
   * @returns {JSX.Element} 현재 페이지에 해당하는 컴포넌트
   */
  const renderCurrentPage = () => {
    console.log('=== MainPageApp renderCurrentPage 호출 ===');
    console.log('urlBasedCurrentPage:', urlBasedCurrentPage);
    console.log('currentpage (Zustand):', currentpage);
    
    // URL 기반으로 페이지 결정 (기존 currentpage와 병행)
    const pageToRender = urlBasedCurrentPage || currentpage;
    console.log('최종 렌더링할 페이지:', pageToRender);
    
    // MainPageApp이 처리하지 않는 경로인 경우 null 반환
    if (pageToRender === null) {
      console.log('MainPageApp이 처리하지 않는 경로 - null 반환');
      return null;
    }
    
    switch (pageToRender) {
      case "login":
        console.log('LoginPage 렌더링');
        return <LoginPage />;
      case "search-address":
        console.log('SearchAddressPage 렌더링');
        return <SearchAddressPage />;
      case "home":
        console.log('HomePage 렌더링');
        return <HomePage />;
      case "favorites":
        console.log('FavoritePage 렌더링');
        return <FavoritePage />;
      case "history":
        console.log('SchedulePage 렌더링');
        return <SchedulePage />;
      case "mypage":
        console.log('MyPage 렌더링');
        return <MyPage />;
      default:
        console.log('기본값: HomePage 렌더링');
        return <HomePage />;
    }
  };

  console.log('=== MainPageApp 최종 렌더링 ===');
  console.log('Layout currentpage:', urlBasedCurrentPage || currentpage);
  
  // MainPageApp이 처리하지 않는 경로인 경우 null 반환
  const renderedPage = renderCurrentPage();
  if (renderedPage === null) {
    console.log('=== MainPageApp null 반환 ===');
    console.log('경로:', location.pathname);
    console.log('MainPageApp이 null을 반환하여 상위 라우터가 처리하도록 함');
    console.log('App.js의 라우트가 이 경로를 처리해야 함');
    console.log('=== MainPageApp null 반환 완료 ===');
    return null;
  }
  
  return (
    <Layout currentpage={urlBasedCurrentPage || currentpage} onPageChange={handlePageChange}>
      {renderedPage}
    </Layout>
  );
};

export default MainPageApp;