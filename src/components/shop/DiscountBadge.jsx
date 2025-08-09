/**  
 * 할인율 배지를 표시하는 컴포넌트
 * 가게 카드의 좌상단에 표시되는 할인율 정보를 표시함. 
 */
import styled from "styled-components";

/**
 * DiscountBadge 컴포넌트
 * @param {number} discountRate - 할인율 (퍼센트)
 */
const DiscountBadge = ({ discountRate }) => {
  return (
    <DiscountTag>
      최대 {discountRate}%
    </DiscountTag>
  );
};
export default DiscountBadge;

// ===== Styled Components ===== //

/* 할인율 배지
(빨간색 배경에 흰색 텍스트로 할인율 표시)
(카드의 좌상단에 절대 위치로 배치됨) */
const DiscountTag = styled.div`
  position: absolute;
  left: 4px; top: 4px;
  background: #FF001B;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  padding: 8px 12px;
  border-radius: 22px;
  z-index: 2;
`;
