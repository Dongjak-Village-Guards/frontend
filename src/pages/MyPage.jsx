import React from 'react';
import styled from 'styled-components';
import useUserInfo from '../hooks/user/useUserInfo';

const MyPage = () => {
  const { authUser, logoutUser } = useUserInfo();

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
          <UserName>{authUser?.displayName || 'randomuser_99999'}</UserName>
          <UserEmail>{authUser?.email || 'alswo6102@gmail.com'}</UserEmail>
          <UserSavings>지금까지 <SavingsAmount>190,000 원</SavingsAmount> 아꼈어요!</UserSavings>
        </UserDetails>
      </UserInfoSection>

      {/* 메뉴 목록 */}
      <MenuSection>
        <MenuItem>
          <MenuText>공지사항</MenuText>
        </MenuItem>

        <MenuDivider />

        <MenuItem>
          <MenuText>자주 묻는 질문</MenuText>
        </MenuItem>

        <MenuDivider />
        
        <MenuItem>
          <MenuText>약관 및 정책</MenuText>
        </MenuItem>

        <MenuDivider />

      </MenuSection>

      {/* 프로모션 이미지 */}
      <PromotionSection>
        <PromotionImage />
      </PromotionSection>

      {/* 로그아웃 버튼 */}
      <LogoutSection>
        <LogoutButton onClick={handleLogout}>
          로그아웃
        </LogoutButton>
      </LogoutSection>
    </PageContainer>
  );
};

export default MyPage;

// ===== Styled Components ===== //

const PageContainer = styled.div`
  padding-top: 2rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  font-family: Pretendard;
  padding: 0 16px;
`;

const Header = styled.div`
  position: sticky;
    top: 0;
    left: 0;
    right: 0;
    padding: 52px 0 16px 0;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    z-index: 10;
    border-bottom: 2px solid #DA2538;
`;

const HeaderTitle = styled.h1`
//  font-size: 22px;
//  font-weight: 700;
//  color: #000;
//  margin: 0;
//width: 100%;
    font-size: 22px;
    font-weight: 700;
    line-height: 14px;
    color: #000;
`;

const UserInfoSection = styled.div`
  display: flex;
  align-items: center;
  padding: 24px 0;
  gap: 16px;
`;

const ProfileImage = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px solid #DA2538;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const ProfilePlaceholder = styled.div`
  width: 60px;
  height: 60px;
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
  gap: 4px;
  flex: 1;
`;

const UserName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #000;
`;

const UserEmail = styled.div`
  font-size: 14px;
  color: #666;
`;

const UserSavings = styled.div`
  font-size: 14px;
  color: #000;
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
`;

const MenuText = styled.div`
  font-size: 16px;
  color: #000;
`;

const MenuDivider = styled.div`
  height: 1px;
  background: #e0e0e0;
`;

const PromotionSection = styled.div`
  margin-top: 32px;
//  margin-bottom: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PromotionImage = styled.div`
  width: 108px;
  height: 108px;
  background: #DA2538;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: 0 4px 8px rgba(218, 37, 56, 0.3);
`;

const LogoutSection = styled.div`
  display: flex;
  justify-content: center;
  padding: 16px 0;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: #666;
  text-decoration: underline;
  font-size: 14px;
  cursor: pointer;
  padding: 8px 16px;
  
  &:hover {
    color: #DA2538;
  }
`;