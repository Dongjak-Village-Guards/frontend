/**
 * 애플리케이션의 루트 컴포넌트
 * React Router를 사용한 라우팅과 인증 상태 관리
 * Zustand 스토어를 사용하여 전역 상태를 관리
 */

import './App.css';
import { useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainPageApp from './pages/MainPageApp';
import useUserInfo from './hooks/user/useUserInfo';
// Store 페이지들
import StoreRedirect from './pages/store/StoreRedirect';
import MenuPage from './pages/store/MenuPage';
import SpacesListPage from './pages/store/SpacesListPage';
import SpaceDetailPage from './pages/store/SpaceDetailPage';
import ReservationPage from './pages/store/ReservationPage';
import LoginTest from './components/test/LoginTest/LoginTest';
import StoreTest from './components/test/StoreTest/StoreTest';
import AddressValidator from './components/test/AddressValidator/AddressValidator';
import DongjakAddressGenerator from './components/test/DongjakAddressGenerator/DongjakAddressGenerator';
import GlobalStyle from './styles/GlobalStyle';

function App() {
  // useUserInfo에서 사용자 상태 가져오기
  const { authUser, logoutUser, refreshTokens, isTokenValid } = useUserInfo();

  // 토큰 만료 체크 및 자동 갱신
//  useEffect(() => {
//    const checkTokenAndRefresh = async () => {
//      if (authUser && tokenExpiry) {
//        const now = Date.now();
//        const timeUntilExpiry = tokenExpiry - now;
        
//        // 토큰이 만료된 경우
//        if (now > tokenExpiry) {
//          console.log('토큰 만료로 자동 로그아웃');
//          alert('토큰이 만료되었습니다. 다시 로그인해주세요.');
//          logoutUser();
//          return;
//        }
        
//        // 토큰 만료 5분 전에 자동 갱신 시도
//        if (timeUntilExpiry < 5 * 60 * 1000 && timeUntilExpiry > 0) {
//          console.log('토큰 만료 5분 전, 자동 갱신 시도');
//          const success = await refreshTokens();
//          if (!success) {
//            console.log('토큰 갱신 실패로 자동 로그아웃');
//            alert('토큰이 만료되었습니다. 다시 로그인해주세요.');
//            logoutUser();
//          }
//        }
//      }
//    };

//    // 초기 체크
//    checkTokenAndRefresh();

//    // 1분마다 체크
//    const interval = setInterval(checkTokenAndRefresh, 60000);
    
//    return () => clearInterval(interval);
//  }, [authUser, tokenExpiry, logoutUser, refreshTokens]);
    useEffect(() => {
    const checkTokenAndRefresh = async () => {
        if (authUser && !isTokenValid()) {
        console.log('토큰 만료 5분 전, 자동 갱신 시도');
        const success = await refreshTokens();
        if (!success) {
            console.log('토큰 갱신 실패로 자동 로그아웃');
            alert('토큰이 만료되었습니다. 다시 로그인해주세요.');
            logoutUser();
        }
        }
    };
    
    checkTokenAndRefresh();
    }, [authUser, isTokenValid, refreshTokens, logoutUser]);

  return (
    <>
      <GlobalStyle />
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
        <Router>
          <Routes>
            {/* 모든 페이지를 MainPageApp으로 통합 */}
            <Route path="/" element={<MainPageApp />} />
            
            {/* 새로운 Store 라우트들 */}
            <Route path="/store/:id" element={<StoreRedirect />} />
            <Route path="/store/:id/menu" element={<MenuPage />} />
            <Route path="/store/:id/spaces" element={<SpacesListPage />} />
            <Route path="/store/:id/space/:spaceId" element={<SpaceDetailPage />} />
            <Route path="/store/:id/reservation" element={<ReservationPage />} />
            

            {/* 백서버 로그인 테스트 페이지 */}
            <Route path="/test" element={<LoginTest />} />
            {/* 가게 API 테스트 페이지 */}
            <Route path="/store-test" element={<StoreTest />} />
            {/* 주소 검증 크롤링 테스트 페이지 */}
            <Route path="/address-test" element={<AddressValidator />} />
            {/* 동작구 주소 176개 생성기 테스트 페이지 */}
            <Route path="/dongjak-generator" element={<DongjakAddressGenerator />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
