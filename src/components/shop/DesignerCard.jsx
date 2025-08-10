/**
 * 디자이너 정보를 표시하는 카드 컴포넌트
 */

import React from 'react'
import styled from 'styled-components';

/**
 * DesignerCard 컴포넌트
 * @param {Object} designer - 디자이너 정보 객체
 * @param {string} designer.name - 디자이너 이름
 * @param {Object[]} designer.menus - 디자이너 메뉴 목록
 * @param {Function} onSelect - 디자이너 선택 시 호출
 */

const DesignerCard = ({ designer, onSelect }) => {
    // 최대 할인율 계산
    const maxDiscountRate = Math.max(...designer.menus.map(menu => menu.discountRate));
    // 대표 메뉴 이름 (전문 분야로 사용)
    const specialty = designer.menus.reduce((prev, curr) => prev.discountRate > curr.discountRate ? prev : curr).name;

  return (
    <Card>
        <DesignerName>{designer.name}</DesignerName>
        <SpecialtyText>{specialty} 전문</SpecialtyText>
        <DiscountText>최대 할인율 {maxDiscountRate}%</DiscountText>
        <SelectButton onClick={onSelect}>예약하기</SelectButton>
    </Card>
  );
};

export default DesignerCard

// ===== Styled Components ===== //

/* 디자이너 카드 컨테이너 */
const Card = styled.div`
    background: #fff;
    padding: 12px;
    margin-bottom: 8px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

/* 디자이너 이름 */
const DesignerName = styled.h3`
    font-size: clamp(16px, 4vw, 18px);
    font-weight: 600;
    color: #000;
`;

/* 전문 분야 텍스트 */
const SpecialtyText = styled.p`
    font-size: clamp(12px, 3.5vw, 14px);
    color: #000;
`;

/* 최대 할인율 텍스트 */
const DiscountText = styled.p`
    font-size: clamp(12px, 3.5vw, 14px);
    color: #da2538;
    font-weight: 600;
`;

/* 선택 버튼 */
const SelectButton = styled.button`
    background: #da2538;
    color: #fff;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    font-size: clamp(12px, 3.5vw, 14px);
    cursor: pointer;
    align-self: flex-start;
`;