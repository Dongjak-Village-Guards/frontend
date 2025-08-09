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

function App() {
  // useUserInfo에서 사용자 상태 가져오기
  const { authUser, tokenExpiry, logoutUser } = useUserInfo();

  // 토큰 만료 체크
  useEffect(() => {
    const checkTokenExpiry = () => {
      if (authUser && tokenExpiry && Date.now() > tokenExpiry) {
        console.log('토큰 만료로 자동 로그아웃');
        logoutUser();
      }
    };

    // 초기 체크
    checkTokenExpiry();

    // 1분마다 체크
    const interval = setInterval(checkTokenExpiry, 60000);
    
    return () => clearInterval(interval);
  }, [authUser, tokenExpiry, logoutUser]);

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <Router>
        <Routes>
          {/* 모든 페이지를 MainPageApp으로 통합 */}
          <Route path="/" element={<MainPageApp />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
