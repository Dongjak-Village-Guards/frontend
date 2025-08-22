import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import useUserInfo from '../hooks/user/useUserInfo';
import { fetchUserInfo } from '../apis/authAPI';
import Logo from '../assets/images/logo.png';

const MyPage = () => {
  const { authUser, logoutUser, accessToken, isTokenValid, refreshTokens } = useUserInfo();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  // 사용자 상세 정보 조회
  useEffect(() => {
    const loadUserInfo = async () => {
      if (!authUser || !accessToken) return;
      
      setLoading(true);
      try {
        // 토큰 유효성 확인 및 갱신
        if (!isTokenValid()) {
          const refreshSuccess = await refreshTokens();
          if (!refreshSuccess) return;
        }
        
        // 갱신된 토큰 가져오기
        const { accessToken: currentToken } = useUserInfo.getState();
        
        // 유저 본인 정보 조회 API 호출
        const userData = await fetchUserInfo(currentToken);
        setUserInfo(userData);
        
        console.log('사용자 상세 정보 로딩 완료:', userData);
      } catch (error) {
        console.error('사용자 상세 정보 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserInfo();
  }, [authUser, accessToken, isTokenValid, refreshTokens]);

  const handleLogout = () => {
    logoutUser();
  };

  return (
    <PageContainer>
      {/* 상단 헤더 */}
      <Header>
         <HeaderTitle>MY</HeaderTitle>
      </Header>

      {/* 사용자 정보 섹션 */}
      <UserInfoSection>
        <ProfileImage>
          <ProfilePlaceholder />
        </ProfileImage>
        <UserDetails>
          <UserName>{userInfo?.user_nickname || authUser?.displayName || 'randomuser_99999'}</UserName>
          <UserEmail>{userInfo?.user_email || authUser?.email || 'alswo6102@gmail.com'}</UserEmail>
          <UserSavings>
            {loading ? (
              <span>정보를 불러오는 중...</span>
            ) : (
              <>지금까지 <SavingsAmount>{userInfo?.user_discounted_cost_sum?.toLocaleString() || '0'} 원</SavingsAmount> 아꼈어요!</>
            )}
          </UserSavings>
        </UserDetails>
      </UserInfoSection>

      {/* 메뉴 목록 */}
      <MenuSection>
        <MenuItem>
          <MenuText>공지사항</MenuText>
        </MenuItem>
        <MenuItem>
          <MenuText>자주 묻는 질문</MenuText>
        </MenuItem>
        <MenuItem>
          <MenuText>약관 및 정책</MenuText>
        </MenuItem>
      </MenuSection>

      {/* 로고 + 로그아웃 버튼 섹션 */}
      <BottomSection>
        <LogoSection>
          <img src={Logo} alt="지금살래 로고" className="logo-icon" />
        </LogoSection>
        <LogoutSection>
          <LogoutButton onClick={handleLogout}>
            로그아웃
          </LogoutButton>
        </LogoutSection>
      </BottomSection>
    </PageContainer>
  );
};

export default MyPage;

// ===== Styled Components ===== //

const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fff;
  font-family: Pretendard;
  padding: 0 16px 52px 16px;
`;

const Header = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  padding: 16px 0;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border-bottom: 2px solid #DA2538;
`;

const HeaderTitle = styled.h1`
    font-size: 22px;
    font-weight: 700;
    color: #000;
`;

const UserInfoSection = styled.div`
  display: flex;
  align-items: center;
  padding: 24px 0;
  gap: 16px;
`;

const ProfileImage = styled.div`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  border: 2px solid #DA2538;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const ProfilePlaceholder = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #999;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  flex: 1;
  color: #000;
`;

const UserName = styled.div`
  font-size: 20px;
  font-weight: 700;
`;

const UserEmail = styled.div`
  font-size: 16px;
  font-weight: 500;
`;

const UserSavings = styled.div`
  font-size: 16px;
  font-weight: 500;
`;

const SavingsAmount = styled.span`
  color: #DA2538;
  font-weight: 600;
`;

const MenuSection = styled.div`
  margin-top: 16px;
`;

const MenuItem = styled.div`
  padding: 16px 0;
  cursor: pointer;
  border-bottom: 1px solid #ccc;
`;

const MenuText = styled.div`
  font-size: 15px;
  font-weight: 400;
  color: #000;
`;

const BottomSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const LogoSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  .logo-icon {
    width: 104px;
    height: 104px;
    flex-shrink: 0;
  }
`;

const LogoutSection = styled.div`
  display: flex;
  justify-content: center;
  padding: 16px 0;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: rgba(0, 0, 0, 0.45);
  text-decoration: underline;
  font-size: 12px;
  cursor: pointer;
  
  &:hover {
    color: #DA2538;
  }
`;