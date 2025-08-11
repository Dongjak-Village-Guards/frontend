/**
 * 메뉴 정보를 표시하는 공통 카드 컴포넌트
 * 대표 메뉴와 다른 메뉴 목록에 모두 사용
 */

import React from 'react'
import styled from 'styled-components'
import menuImage from '../../assets/images/menu.png';

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
        <Div>
            <MenuImage src={menuImage} alt='임시 메뉴 이미지' />
            <Detail>
                <MenuName>{menu.name.length > 7 ? `${menu.name.slice(0, 7)}...` : menu.name}</MenuName>
                <PriceInfo>
                    <DiscountRate>{menu.discountRate}%</DiscountRate>
                    <OriginalPrice>{menu.originalPrice.toLocaleString()}원</OriginalPrice>
                </PriceInfo>
                <DiscountPrice>{menu.discountPrice.toLocaleString()}원</DiscountPrice>
            </Detail>
        </Div>
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
    border-radius: 16px;
    border: 1px solid #CCC;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
`;

const Div = styled.div`
    display: flex;
    align-items: center;
`;

/* 메뉴 이미지 */
const MenuImage = styled.img`
  width: 68px;
  height: 68px;
  object-fit: cover;
  flex-shrink: 0;
  border-radius: 10px;
  margin: 16px;
`;

const Detail = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`

/* 메뉴 이름 (긴 이름은 ... 처리) */
const MenuName = styled.h3`
    font-size: 14px;
    font-weight: 600;
    line-height: 14px;
    color: #000;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

/* 가격 정보 (할인율과 원래 가격) */
const PriceInfo = styled.div`
    display: flex;
    gap: 2px;
    align-items: center;
    font-size: 12px;
    font-weight: 400;
    line-height: 14px;
`;

/* 할인율 표시 */
const DiscountRate = styled.span`
    color: #F00;
`;

/* 원래 가격 (취소선 처리) */
const OriginalPrice = styled.span`
    font-size: clamp(12px, 3.5vw, 14px);
    color: #999;
    text-decoration: line-through;
`;

/* 할인 가격 */
const DiscountPrice = styled.span`
    font-size: 14px;
    font-weight: 600;
    color: #000;
    line-height: 14px;
`;

/* 예약 버튼 (예약마감 시 비활성화) */
const ReserveButton = styled.button`
    background: ${props => (props.disabled ? "#737373" : "#da2538")};
    color: #fff;
    border: none;
    padding: 8px 12px;
    border-radius: 10px;
    font-family: Pretendard;
    font-size: 14px;
    font-weight: 400;
    cursor: ${props => (props.disabled ? "not-allowed" : "pointer")};
    margin-right: 16px;
`