import { forwardRef } from "react";
import styled from 'styled-components';
import NavBar from './BottomNavBar/BottomNavBar';

const Layout = forwardRef(({ children, currentPage = "home", onPageChange }, contentAreaRef) => {
  // 로그인/주소검색/상세 페이지에서는 NavBar 숨김
  const showNavBar = !['login', 'search-address', 'shop-detail'].includes(currentPage);

  return (
    <Container>
      <PhoneFrame>
        <ContentArea ref={contentAreaRef} className="content-area">
          {children}
                </ContentArea>
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

  /* 모바일에서는 전체 화면 */
  @media (max-width: 768px) {
    padding: 0;
    background: #fff;
  }
`;

// 핸드폰 프레임: 반응형으로 수정
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

  /* 모바일에서는 프레임 제거하고 전체 화면 */
  @media (max-width: 768px) {
    max-width: 100%;
    height: 100vh;
    box-shadow: none;
    /* iOS 디바이스의 안전 영역(safe area)을 고려해 상단/하단 패딩을 동적으로 조정 */
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
  }
`;

// 콘텐츠 영역: 반응형으로 수정
const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;

  /* 반응형 웹 수정: 모바일에서 스크롤 최적화 */
  -webkit-overflow-scrolling: touch;
  
  /* sticky 포지션이 제대로 작동하도록 설정 */
  position: relative;
  
  /* 스크롤바 스타일링 */
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
  
  /* 반응형 웹 수정: 모바일에서 스크롤바 숨김 */
  @media (max-width: 768px) {
    &::-webkit-scrollbar {
      width: 0;
    }
  }
`;

// 바텀시트 포털 마운트 지점 (Layout 내부 전역 레이어)
const PortalRoot = styled.div`
  position: absolute;
  inset: 0;
  z-index: 30; /* NavBar(20)보다 높게 */
  pointer-events: none; /* 시트가 없을 때 이벤트 차단 */
`;