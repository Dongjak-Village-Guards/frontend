import React from 'react';
import { ReactComponent as Logo } from '../assets/images/logo.svg';
import { ReactComponent as Bubble } from '../assets/images/bubble.svg';
import Google from '../components/login/Google';
import styled from 'styled-components';

const Login = () => {
  return (
    <LoginWrapper>
      <Container>
        <Logo className='logo-icon' />

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
    </LoginWrapper>
  )
}

export default Login

const LoginWrapper = styled.div`
  background-color: #ffffff;
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  height: 100%; // Layout크기에 맞출려고 수정
`

const Container = styled.div`
  position: relative;
  background-color: #ffffff;
  width: 360px;
  height: 720px;

  .logo-icon {
    position: absolute;
    height: 104px;
    width: 104px;
    top: 188px;
    left: 128px;
  }
`

const FirstTitle = styled.div`
  position: absolute;
  top: 316px;
  left: 43px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 10px;

  .main-title {
    color: #282828;
    font-family: "Pretendard-Bold", Helvetica;
    font-size: 20px;
    font-weight: 700;
    line-height: 14px;
    white-space: nowrap;
    margin-top: -1px;
  }
`

const SecondTitle = styled.div`
  position: absolute;
  top: 354px;
  left: 118.5px;
  display: flex;
  justify-content: center;
  align-items: center;

  .sub-title {
    color: #000000;
    font-family: "Pretendard-Medium", Helvetica;
    font-size: 16px;
    font-weight: 500;
    line-height: 20px;
    text-align: center;
    white-space: nowrap;
    margin-top: -1px;
  }
`

const BubbleBox = styled.div`
  position: relative;
  top: 480px;
  display: flex;
  justify-content: center;
  align-items: center;

  .bubble-svg {
    position: relative;
    width: 200px;
    height: 50px;
    top: 0;
    left: 0;
  }

  .bubble-text {
    position: absolute;
    top: 9px;
    color: #da2538;
    font-family: "Pretendard-Medium", Helvetica;
    font-size: 16px;
    font-weight: 600;
    white-space: nowrap;
    z-index: 1;
  }
`

const GoogleButton = styled.div`
  position: absolute;
  top: 538px;
  left: 32px;
  width: 296px;
  cursor: pointer;

  .google-component {
    left: 26px;
  }
`