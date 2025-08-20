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
import ShopDetailPage from './pages/ShopDetailPage';
import LoginTest from './components/test/LoginTest/LoginTest';
import StoreTest from './components/test/StoreTest/StoreTest';
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
            { /* 가게 상세 페이지: 디자이너 유무에 따라 동적 렌더링 */}
            <Route path="/shop/:id" element={<ShopDetailPage />} />
            {/* 백서버 로그인 테스트 페이지 */}
            <Route path="/test" element={<LoginTest />} />
            {/* 가게 API 테스트 페이지 */}
            <Route path="/store-test" element={<StoreTest />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
