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
  const store = useStore();
  const { currentPage, setCurrentPage, time, setTime, currentTime, checkAndUpdateTimeIfExpired } = useStore();
  
  // 사용자 정보에서 인증 상태와 주소 확인
  const { authUser, userAddress, accessToken } = useUserInfo();

  // URL 기반으로 currentPage 결정하는 함수 추가 (기존 로직과 병행)
  const getcurrentPageFromUrl = () => {
    
    if (location.pathname === '/') {
      return 'home';
    }
    if (location.pathname === '/favorites') {
      return 'favorites';
    }
    if (location.pathname === '/history') {
      return 'history';
    }
    if (location.pathname === '/mypage') {
      return 'mypage';
    }
    if (location.pathname === '/search-address') {
      return 'search-address';
    }
    if (location.pathname === '/login') {
      return 'login';
    }
    return 'home';
  };

  // URL 기반 currentPage (기존 currentPage와 병행)
  const urlBasedcurrentPage = getcurrentPageFromUrl();

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

  // 초기 time 체크 및 설정
  useEffect(() => {
    checkAndUpdateTimeIfExpired();
  }, [currentTime, checkAndUpdateTimeIfExpired]);

  // URL 변경 시 저장 및 currentPage 동기화 (기존 로직과 병행)
  useEffect(() => {
    localStorage.setItem('currentUrl', location.pathname);
    
    // URL이 변경될 때 currentPage도 동기화
    const newPage = getcurrentPageFromUrl();
    
    if (newPage !== currentPage) {
      setCurrentPage(newPage);
    } else {
      console.log('currentPage 변경 불필요 (동일함)');
    }
  }, [location.pathname, currentPage, setCurrentPage]);
  // 로그인하지 않았으면 로그인 페이지로 설정
  if (!accessToken && urlBasedcurrentPage !== "login") {
    return (
      <Layout currentPage="login" onPageChange={handlePageChange}>
        <LoginPage />
      </Layout>
    );
  }

  // 주소가 없으면 주소 검색 페이지 표시
  if (!userAddress && urlBasedcurrentPage !== "login" && urlBasedcurrentPage !== "history") {
    return (
      <Layout currentPage="search-address" onPageChange={handlePageChange}>
        <SearchAddressPage />
      </Layout>
    );
  }

  /**
   * 현재 페이지에 따른 컴포넌트 렌더링 함수
   * @returns {JSX.Element} 현재 페이지에 해당하는 컴포넌트
   */
  const rendercurrentPage = () => {
    
    // URL 기반으로 페이지 결정 (기존 currentPage와 병행)
    const pageToRender = urlBasedcurrentPage || currentPage;
    
    // MainPageApp이 처리하지 않는 경로인 경우 null 반환
    if (pageToRender === null) {
      return null;
    }
    
    switch (pageToRender) {
      case "login":
        return <LoginPage />;
      case "search-address":
        return <SearchAddressPage />;
      case "home":
        return <HomePage />;
      case "favorites":
        return <FavoritePage />;
      case "history":
        return <SchedulePage />;
      case "mypage":
        return <MyPage />;
      default:
        return <HomePage />;
    }
  };
  
  // MainPageApp이 처리하지 않는 경로인 경우 null 반환
  const renderedPage = rendercurrentPage();
  if (renderedPage === null) {
    return null;
  }
  
  return (
    <Layout currentPage={urlBasedcurrentPage || currentPage} onPageChange={handlePageChange}>
      {renderedPage}
    </Layout>
  );
};

export default MainPageApp;