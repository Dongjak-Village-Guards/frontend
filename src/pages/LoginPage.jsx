/**
 * 로그인 페이지
 */

import Logo from '../assets/images/logo.png';
import { ReactComponent as Bubble } from '../assets/images/bubble.svg';
import Google from '../components/features/auth/Google/Google';
import styled from 'styled-components';

const Login = () => {
  return (
    <Container>
      <img src={Logo} alt="지금살래 로고" className="logo-icon" />

      <FirstTitle>
        <p className='main-title'>위기의 지갑을 구하는 3시간의 기적</p>
      </FirstTitle>

      <SecondTitle>
        <p className='sub-title'>
          우리 동네 할인 정보
          <br />
          놓치지 마세요
        </p>
      </SecondTitle>

      <BubbleBox>
        <Bubble className='bubble-svg' />
        <div className='bubble-text'>3초만에 간편 로그인</div>
      </BubbleBox>

      <GoogleButton>
        <Google className='google-component' />
      </GoogleButton>
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
    width: 104px;
    height: 104px;
    margin-bottom: 24px;
  }
`;

const FirstTitle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 24px;

  .main-title {
    color: #282828;
    font-size: 20px;
    font-weight: 700;
    line-height: 14px;
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
    line-height: 20px;
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

  .google-component {
    left: 26px;
  }
`;