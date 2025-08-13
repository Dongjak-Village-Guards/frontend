/**
 * Layout 컴포넌트
 * 전체 페이지 프레임을 구성하며, 하단 NavBar와 바텀시트 포털을 포함
 * 로그인/주소검색/상세 페이지에서는 NavBar를 숨김
 */

import { forwardRef } from "react";
import styled from 'styled-components';
import NavBar from '../nav/BottomNavBar';

const Layout = forwardRef(({ children, currentPage = "home", onPageChange }, contentAreaRef) => {
  // NavBar를 숨길 페이지 목록
  const pagesWithoutNav = ['login', 'search-address', 'shop-detail'];
  const showNavBar = !pagesWithoutNav.includes(currentPage);

  return (
    <Container>
      <PhoneFrame>
        <ContentArea ref={contentAreaRef} className="content-area">
          {children}
        </ContentArea>

        {/* 하단 네비게이션 바 */}
        {showNavBar && <NavBar current={currentPage} onSelect={onPageChange} />}

        {/* 바텀시트 포털 마운트 지점 */}
        <PortalRoot id="bottom-sheet-portal" />
      </PhoneFrame>
    </Container>
  );
});

export default Layout;

// ===== Styled Components ===== //

// 전체 Layout: 반응형으로 수정
const Container = styled.div`
  min-height: 100vh;
  background: #f8f8f8;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;

  @media (max-width: 768px) {
    padding: 0;
    background: #fff;
  }
`;

// 핸드폰 프레임
const PhoneFrame = styled.div`
  width: 100%;
  max-width: 360px;
  height: 720px;
  background: #fff;
  box-shadow: 2px 2px 16px rgba(0,0,0,0.07);
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: 768px) {
    max-width: 100%;
    height: 100vh;
    box-shadow: none;
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
  }
`;

// 콘텐츠 영역
const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-bottom: 80px;

  @media (max-width: 768px) {
    padding-bottom: calc(80px + env(safe-area-inset-bottom));
  }

  -webkit-overflow-scrolling: touch;
  position: relative;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #ccc;
  }

  @media (max-width: 768px) {
    &::-webkit-scrollbar {
      width: 0;
    }
  }
`;

// 바텀시트 포털 마운트 지점
const PortalRoot = styled.div`
  position: absolute;
  inset: 0;
  z-index: 30;
  pointer-events: none;
`;