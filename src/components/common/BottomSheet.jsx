import React from 'react';
import styled from 'styled-components';

const BottomSheet = ({ open, title, onClose, children }) => {
  if (!open) return null;

  return (
    <>
      <Backdrop onClick={onClose} />
      <Sheet role="dialog" aria-modal="true">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <CloseButton type="button" onClick={onClose}>닫기</CloseButton>
        </SheetHeader>
        <SheetBody>{children}</SheetBody>
      </Sheet>
    </>
  );
};

export default BottomSheet;

// ===== Styled Components ===== //

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.35);
  z-index: 1000;
`;

const Sheet = styled.section`
  position: absolute;
  left: 0; right: 0; bottom: 0;
  background: #fff;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  box-shadow: 0 -8px 24px rgba(0,0,0,0.12);
  z-index: 1001;
  max-height: 70vh;
  display: flex;
  flex-direction: column;
  animation: slideUp 160ms ease-out;

  @keyframes slideUp {
    from { transform: translateY(8%); opacity: 0.8; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

const SheetHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
`;

const SheetTitle = styled.h3`
  margin: 0;
  font-size: 16px;
`;

const CloseButton = styled.button`
  border: none;
  background: none;
  font-size: 14px;
  color: #DA2538;
  padding: 6px 8px;
`;

const SheetBody = styled.div`
  padding: 12px 16px 16px 16px;
  overflow-y: auto;
`;

