import { signInWithPopup } from 'firebase/auth';
import React from 'react'
import styled from 'styled-components';
import { auth, provider } from '../../firebase';
import useUserInfo from '../../hooks/user/useUserInfo';
import useStore from '../../hooks/store/useStore';

const Google = ({
  className,
  frameClassName,
  googleLogo = "https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s96-fcrop64=1,00000000ffffffff-rw",
  text = "Sign In with Google",
}) => {
  const { setAuthUser } = useUserInfo();
  const { setCurrentPage } = useStore();

  /** handleLogin
   *  사용자 정보 상태 저장을 위한 setAuthUser 정보 추가
   */
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider)
      console.log("로그인 성공:", result.user);
      
      // 사용자 정보 저장
      setAuthUser(result.user);
      
      // 주소 검색 페이지로 이동
      setCurrentPage("search-address");
    } catch (error) {
      console.error("로그인 실패:", error.code, error.message);
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