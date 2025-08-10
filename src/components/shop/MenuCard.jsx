/**
 * 메뉴 정보를 표시하는 공통 카드 컴포넌트
 * 대표 메뉴와 다른 메뉴 목록에 모두 사용
 */

import React from 'react'
import styled from 'styled-components'

/**
 * MenuCard 컴포넌트
 * @param {Object} menu - 메뉴 정보 객체
 * @param {string} menu.name - 메뉴 이름
 * @param {number} menu.discountRate - 할인율 (%)
 * @param {number} menu.originalPrice - 원래 가격
 * @param {number} menu.discountPrice - 할인 가격
 * @param {boolean} menu.isReserved - 예약 여부
 * @param {Function} onReserve - 예약 버튼 클릭 시 호출
 */

const MenuCard = ({ menu, onReserve }) => {
  return (
    <Card>
        <MenuName>{menu.name.length > 7 ? `${menu.name.slice(0, 7)}...` : menu.name}</MenuName>
        <PriceInfo>
            <DiscountPrice>{menu.discountPrice.toLocaleString()}원</DiscountPrice>
            <OriginalPrice>{menu.originalPrice.toLocaleString()}원</OriginalPrice>
        </PriceInfo>
        <DiscountRate>{menu.discountRate}%</DiscountRate>
        <ReserveButton disabled={menu.isReserved} onClick={onReserve}>
            {menu.isReserved ? "예약마감" : "예약하기"}
        </ReserveButton>
    </Card>
  )
}

export default MenuCard

// ===== Styled Components ===== //

/* 메뉴 카드 컨테이너 */
const Card = styled.div`
    background: #fff;
    padding: 12px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 8px;
`;

/* 메뉴 이름 (긴 이름은 ... 처리) */
const MenuName = styled.h3`
    font-size: clamp(16px, 4vw, 18px);
    font-weight: 600;
    color: #000;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

/* 가격 정보 (할인율과 원래 가격) */
const PriceInfo = styled.div`
    display: flex;
    gap: 8px;
    align-items: center;
`;

/* 할인율 표시 */
const DiscountRate = styled.span`
    font-size: clamp(12px, 3.5vw, 14px);
    font-weight: 600;
    color: #da2538;
`;

/* 원래 가격 (취소선 처리) */
const OriginalPrice = styled.span`
    font-size: clamp(12px, 3.5vw, 14px);
    color: #999;
    text-decoration: line-through;
`;

/* 할인 가격 (강조 색상) */
const DiscountPrice = styled.span`
    font-size: clamp(14px, 4vw, 16px);
    font-weight: 600;
    color: #da2538;
`;

/* 예약 버튼 (예약마감 시 비활성화) */
const ReserveButton = styled.button`
    background: ${props => (props.disabled ? "#737373" : "#da2538")};
    color: #fff;
    border: none;
    padding: 8px 12px;
    border-radius: 10px;
    font-size: clamp(12px, 3.5vw, 14px);
    cursor: ${props => (props.disabled ? "not-allowed" : "pointer")};
    margin-top: 8px;
    align-self: flex-start;
`