/**
 * 로그인 페이지
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/images/logo_login.png';
import { ReactComponent as Bubble } from '../assets/images/bubble.svg';
import { ReactComponent as Link } from '../assets/images/link.svg';
import Google from '../components/features/auth/Google/Google';
import useUserInfo from '../hooks/user/useUserInfo';
import styled from 'styled-components';

const Login = () => {
  const { accessToken } = useUserInfo();

  // 로그인 페이지에서 히스토리 초기화 및 URL 고정
  useEffect(() => {
    console.log('=== 로그인 페이지 히스토리 초기화 useEffect ===');
    console.log('accessToken 존재:', !!accessToken);
    console.log('현재 URL:', window.location.pathname);
    console.log('현재 히스토리 길이:', window.history.length);
    
    if (!accessToken) {
      // 현재 위치를 /login으로 설정
      window.history.replaceState(null, '', '/login');
      console.log('로그인 페이지: 히스토리 초기화 완료');
      console.log('초기화 후 URL:', window.location.pathname);
    } else {
      console.log('accessToken이 있으므로 히스토리 초기화 건너뜀');
    }
  }, [accessToken]);

  // popstate 이벤트에서 URL 변경을 감지하고 즉시 /login으로 강제 교체
  useEffect(() => {
    console.log('=== 로그인 페이지 popstate 리스너 useEffect ===');
    console.log('accessToken 존재:', !!accessToken);
    console.log('현재 URL:', window.location.pathname);
    
    if (!accessToken) {
      console.log('popstate 리스너 등록 시작');
      
      const handlePopState = () => {
        console.log('=== popstate 이벤트 발생 ===');
        console.log('이벤트 발생 시 URL:', window.location.pathname);
        console.log('이벤트 발생 시 accessToken 존재:', !!accessToken);
        
        // URL이 변경되면 즉시 /login으로 강제 교체
        window.history.replaceState(null, '', '/login');
        console.log('로그인 페이지: URL 강제 교체 완료');
        console.log('교체 후 URL:', window.location.pathname);
      };

      window.addEventListener('popstate', handlePopState);
      console.log('popstate 리스너 등록 완료');
      
      return () => {
        console.log('popstate 리스너 제거');
        window.removeEventListener('popstate', handlePopState);
      };
    } else {
      console.log('accessToken이 있으므로 popstate 리스너 등록하지 않음');
    }
  }, [accessToken]);
  return (
    <Container>
      <img src={Logo} alt="지금살래 로고" className="logo-icon" />

      <FirstTitle>
        <p className='main-title'>살래? 지금 이 순간만의 Sale!</p>
      </FirstTitle>

      <SecondTitle>
        <p className='sub-title'>
          우리 동네 할인 정보 놓치지 마세요
        </p>
      </SecondTitle>

      <BubbleBox>
        <Bubble className='bubble-svg' />
        <div className='bubble-text'>3초만에 간편 로그인</div>
      </BubbleBox>

      <GoogleButton>
        <Google className='google-component' />
      </GoogleButton>

      <ProviderLinkButton>
        <a href="https://nowsale.streamlit.app/">
          공급자 페이지 바로가기
          <Link />
        </a>
      </ProviderLinkButton>
    </Container>
  );
};

export default Login;

const Container = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;

  .logo-icon {
    width: 180px;
    margin-bottom: 86px;
  }
`;

const FirstTitle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 4px;

  .main-title {
    color: #282828;
    font-size: 20px;
    font-weight: 700;
    white-space: nowrap;
  }
`;

const SecondTitle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 86px;

  .sub-title {
    color: #000000;
    font-size: 16px;
    font-weight: 500;
    text-align: center;
    white-space: nowrap;
  }
`;

const BubbleBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 200px;
  height: 50px;
  margin-bottom: 8px;

  .bubble-svg {
    width: 200px;
    height: 50px;
    z-index: 0;
  }

  .bubble-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -83%);
    color: #da2538;
    font-size: 16px;
    font-weight: 600;
    white-space: nowrap;
    z-index: 1;
  }
`;

const GoogleButton = styled.div`
  width: 296px;
  cursor: pointer;
  margin-bottom: 20px;
  display: flex;

  .google-component {
    left: 26px;
  }
`;

const ProviderLinkButton = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  cursor: pointer;

  a {
    color: #000000dd;
    text-underline-offset: 2px;
    transition: color 0.2s ease;
    height: 17px;
    display: inline-flex;
    align-items: center;
    gap: 2px;

    &:hover {
      color: #DA2538;

      svg {
        fill: #DA2538;
      }
    }
  }

  svg {
    width: 17px;
    height: 17px;
    flex-shrink: 0;
    fill: currentColor;
    transition: fill 0.2s ease;
  }
`;