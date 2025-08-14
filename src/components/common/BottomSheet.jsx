import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

const BottomSheet = ({ 
  open, 
  title, 
  onClose, 
  children, 
  headerPadding = "12px 16px",
  bodyPadding = "12px 16px 16px 16px",
  headerVariant = "default", // default, noHeaderPadding
  bodyVariant = "default", // default, noBodyPadding
  sheetHeight = "default", // default, mainPageSize
}) => {
  const [portalRoot, setPortalRoot] = useState(null);

  useEffect(() => {
    const root = document.getElementById('bottom-sheet-portal');
    setPortalRoot(root);
  }, []);

  // 디버깅: props 확인
  console.log('BottomSheet props:', { open, title, onClose: typeof onClose, children: !!children });

  if (!open || !portalRoot) return null;

  // 디버깅: onClose 함수 래핑
  const handleClose = (e) => {
    console.log('닫기 버튼 클릭됨', e);
    if (onClose) {
      console.log('onClose 함수 호출');
      onClose();
    } else {
      console.error('onClose 함수가 없음!');
    }
  };

  const handleBackdropClick = (e) => {
    console.log('배경 클릭됨', e);
    if (onClose) {
      console.log('onClose 함수 호출 (배경)');
      onClose();
    } else {
      console.error('onClose 함수가 없음! (배경)');
    }
  };

  // Layout 내부 포털로 렌더링하여 HomePage 스크롤과 분리
  return createPortal(
    <>
      <Backdrop onClick={handleBackdropClick} />
      <Sheet role="dialog" aria-modal="true" $sheetHeight={sheetHeight}>
        <SheetHeader $headerPadding={headerPadding} $variant={headerVariant}>
          {/* 
            Transient props ($ 접두사):
            - DOM에 전달되지 않고 styled-components 내부 CSS 엔진에서만 사용
            - React 경고를 방지하고 성능상 이점 제공
            - 스타일 계산 목적으로만 사용됨
          */}
          <SheetTitle>{title}</SheetTitle>
          <CloseButton 
            type="button" 
            onClick={handleClose}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M13.2141 12L19.3664 4.66641C19.4695 4.54453 19.3828 4.35938 19.2234 4.35938H17.3531C17.243 4.35938 17.1375 4.40859 17.0648 4.49297L11.9906 10.5422L6.9164 4.49297C6.84609 4.40859 6.74062 4.35938 6.62812 4.35938H4.75781C4.59843 4.35938 4.51172 4.54453 4.61484 4.66641L10.7672 12L4.61484 19.3336C4.59174 19.3608 4.57692 19.394 4.57214 19.4293C4.56736 19.4647 4.57282 19.5006 4.58787 19.533C4.60293 19.5653 4.62694 19.5926 4.65706 19.6117C4.68718 19.6308 4.72215 19.6408 4.75781 19.6406H6.62812C6.73828 19.6406 6.84375 19.5914 6.9164 19.507L11.9906 13.4578L17.0648 19.507C17.1352 19.5914 17.2406 19.6406 17.3531 19.6406H19.2234C19.3828 19.6406 19.4695 19.4555 19.3664 19.3336L13.2141 12Z" fill="black"/>
            </svg>
          </CloseButton>
        </SheetHeader>
        <SheetBody $bodyPadding={bodyPadding} $bodyVariant={bodyVariant}>
          {/* 
            Transient props ($ 접두사):
            - DOM에 전달되지 않고 styled-components 내부 CSS 엔진에서만 사용
            - React 경고를 방지하고 성능상 이점 제공
            - 스타일 계산 목적으로만 사용됨
          */}
          {children}
        </SheetBody>
      </Sheet>
    </>,
    portalRoot
  );
};

export default BottomSheet;

// ===== Styled Components ===== //

const Backdrop = styled.div`
  position: absolute; /* Layout 내부 기준 */
  inset: 0;
  background: rgba(0,0,0,0.35);
  z-index: 31; /* PortalRoot(30)보다 높게 */
  pointer-events: auto;
`;

const Sheet = styled.section`
  position: absolute; /* Layout 내부 기준 */
  left: 0; right: 0; bottom: 0;
  background: #fff;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  box-shadow: 0 -8px 24px rgba(0,0,0,0.12);
  z-index: 32; /* Backdrop(31)보다 높게 */
  display: flex;
  flex-direction: column;
  animation: slideUp 160ms ease-out;
//  max-height: 51.5vh; // 눈바디

  height: ${props => {
    switch(props.$sheetHeight) {
      case "mainPageSize": return "51.5vh";
      case "schedulePageSize": return "29.8vh";
      default: return "51.5vh"; // 디폴트 사이즈 : mainPageSize
    }
  }};
  
  /* 모바일 safe-area 고려 */
  padding-bottom: env(safe-area-inset-bottom);
  
  /* 포인터 이벤트 명시적 설정 */
  pointer-events: auto;

  @keyframes slideUp {
    from { transform: translateY(8%); opacity: 0.8; }
    to { transform: translateY(0); opacity: 1; }
  }
//  padding: 0 16px; // 임시
`;

const SheetHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => {
    if (props.$variant === "noHeaderPadding") {
      return "12px 16px 0 16px";
    }
    return props.$headerPadding;
  }};
  position: relative;
  z-index: 9998;
  pointer-events: auto;
`;

const SheetTitle = styled.h3`
  margin: 0;
  font-size: 20px;
  font-weight: 400;
`;

const CloseButton = styled.button`
  border: none;
  background: none;
  font-size: 14px;
  padding: 6px 8px;
  cursor: pointer;
  z-index: 9999 !important; /* 강제로 최상위로 */
  position: relative;
`;

const SheetBody = styled.div`
  padding: 12px 16px 16px 16px;
  padding: ${props => {
    if (props.$bodyVariant === "noBodyPadding") {
      return "0 16px 16px 16px";
    }
    return props.$bodyPadding;
  }};
  overflow-y: auto;
`;