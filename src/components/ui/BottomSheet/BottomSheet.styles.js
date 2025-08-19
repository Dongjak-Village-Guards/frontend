import styled from 'styled-components';

export const Backdrop = styled.div`
  position: absolute; /* Layout 내부 기준 */
  inset: 0;
  background: rgba(0,0,0,0.35);
  z-index: 31; /* PortalRoot(30)보다 높게 */
  pointer-events: auto;
`;

export const Sheet = styled.section`
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

export const SheetHeader = styled.header`
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

export const SheetTitle = styled.h3`
  margin: 0;
  font-size: 20px;
  font-weight: 400;
`;

export const CloseButton = styled.button`
  border: none;
  background: none;
  font-size: 14px;
  padding: 6px 8px;
  cursor: pointer;
  z-index: 9999 !important; /* 강제로 최상위로 */
  position: relative;
`;

export const SheetBody = styled.div`
  padding: 12px 16px 16px 16px;
  padding: ${props => {
    if (props.$bodyVariant === "noBodyPadding") {
      return "0 16px 16px 16px";
    }
    return props.$bodyPadding;
  }};
  overflow-y: auto;
`; 