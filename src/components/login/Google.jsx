import { signInWithPopup } from 'firebase/auth';
import React from 'react'
import styled from 'styled-components';
import { auth, provider } from '../../firebase';
import useUserInfo from '../../hooks/user/useUserInfo';
import useStore from '../../hooks/store/useStore';
import { loginWithGoogle } from '../../apis/authAPI';

const Google = ({
  className,
  frameClassName,
  googleLogo = "https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s96-fcrop64=1,00000000ffffffff-rw",
  text = "Sign In with Google",
}) => {
  const { setAuthUser, setAuthTokens, fetchAndSetUserInfo } = useUserInfo();
  const { setCurrentPage } = useStore();

  /** handleLogin
   *  Firebase 로그인 후 백엔드로 idToken 전송하여 로그인/회원가입 처리
   */
  const handleLogin = async () => {
    try {
      // 1. Firebase 구글 로그인
      const result = await signInWithPopup(auth, provider);
      console.log("Firebase 로그인 성공:", result.user);
      
      // 2. Firebase idToken 가져오기
      const idToken = await result.user.getIdToken();
      console.log("Firebase idToken 획득");
      
      // 3. 백엔드로 idToken 전송하여 로그인/회원가입
      const loginResponse = await loginWithGoogle(idToken);
      console.log("백엔드 로그인/회원가입 성공:", loginResponse.message);
      
      // 4. Firebase 사용자 정보 저장
      setAuthUser(result.user);
      
      // 5. 백엔드 응답으로 받은 토큰들 저장
      setAuthTokens(loginResponse);
      
      // 6. 사용자 정보 조회하여 주소 확인
      const userInfo = await fetchAndSetUserInfo(loginResponse.access_token);
      
      // 7. 주소 유무에 따라 페이지 이동
      if (userInfo.user_address && userInfo.user_address !== "") {
        console.log('기존 주소가 있어 메인페이지로 이동');
        setCurrentPage("home");
      } else {
        console.log('주소가 없어 주소 검색 페이지로 이동');
        setCurrentPage("search-address");
      }
    } catch (error) {
      console.error("로그인 실패:", error.code, error.message);
      alert("로그인에 실패했습니다. 다시 시도해주세요.");
    }
  }

  return (
    <SignInwithGoogle className={className} onClick={handleLogin}>
        <div className={`frame ${frameClassName}`}>
          <img className='google-logo' alt='Google logo' src={googleLogo} />
          <div className='text-wrapper'>{text}</div>
        </div>
    </SignInwithGoogle>
  )
}

export default Google

// ===== Styled Components ===== //
const SignInwithGoogle = styled.div`
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 2px 3px #0000002b, 0px 0px 3px #00000015;
  width: 296px;
  height: 54px;
  display: inline-flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: #EBEBEA;
  }

  &:active {
    transform: translateY(2px);
  }

  & .frame {
    display: flex;
    align-items: flex-start;
    background: transparent;
    border-radius: 10px;
    gap: 15px;
  }

  & .google-logo {
    height: 24px;
    position: relative;
    width: 24px;
  }

  & .text-wrapper {
    color: #0000008a;
    font-family: "Roboto", Helvetica;
    font-size: 20px;
    font-weight: 500;
    letter-spacing: 0;
    line-height: normal;
    margin-top: -1.00px;
    position: relative;
    white-space: nowrap;
    width: fit-content;
  }
`;