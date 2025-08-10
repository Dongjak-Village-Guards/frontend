/**
 * 예약 바텀시트를 표시하는 컴포넌트
 */

import React from 'react'
import styled from 'styled-components';

/**
 * ReservationBottomSheet 컴포넌트
 * @param {Object} shop - 가게 정보
 * @param {Object} menu - 메뉴 정보
 * @param {Object} designer - 디자이너 정보 (선택)
 * @param {Function} onClose - 닫기 버튼 클릭 시 호출
 */

const ReservationBottomSheet = ({ shop, menu, designer, onClose }) => {
  return (
    <SheetContainer>
        <Overlay onClick={onClose} />
        <SheetContent>
            <SheetTitle>예약 정보</SheetTitle>
            <InfoText>가게: {shop.name}</InfoText>
            <InfoText>메뉴: {menu.name}</InfoText>
            {designer && <InfoText>디자이너: {designer.name}</InfoText>}
            <InfoText>가격: {menu.discountPrice.toLocaleString()}원</InfoText>
            <ButtonContainer>
                <CloseButton onClick={onClose}>X</CloseButton>
                <ConfirmButton>예약 확정</ConfirmButton>
            </ButtonContainer>
        </SheetContent>
    </SheetContainer>
  );
};

export default ReservationBottomSheet

// ===== Styled Components ===== //

/* 바텀시트 컨테이너 */
const SheetContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 20;
`;

/* 오버레이 (배경 어두운 처리) */
const Overlay = styled.div`
    background-color: rgba(0, 0, 0, 0.25);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
`;

/* 바텀시트 콘텐츠 */
const SheetContent = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    padding: 16px;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
`;

/* 바텀시트 제목 */
const SheetTitle = styled.h2`
    font-size: clamp(18px, 5vw, 20px);
    font-weight: 700;
    color: #000;
    margin-bottom: 12px;
`;

/* 예약 정보 텍스트 */
const InfoText = styled.p`
    font-size: clamp(14px, 4vw, 16px);
    color: #000;
    margin-bottom: 8px;
`;

/* 버튼 컨테이너 */
const ButtonContainer = styled.div`
    display: flex;
    gap: 8px;
    margin-top: 16px;
`;

/* 닫기 버튼 */
const CloseButton = styled.button`
    flex: 1;
    background: none;
    color: #000;
    border: none;
    padding: 12px;
    cursor: pointer;
`;

/* 예약 확정 버튼 */
const ConfirmButton = styled.button`
    flex-direction: 1;
    background: #da2538;
    color: #fff;
    border: none;
    padding: 12px;
    border-radius: 4px;
    cursor: pointer;
`;