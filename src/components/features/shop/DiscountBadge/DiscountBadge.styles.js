import styled from "styled-components";

/* 할인율 배지
(빨간색 배경에 흰색 텍스트로 할인율 표시)
(카드의 좌상단에 절대 위치로 배치됨) */
export const DiscountTag = styled.div`
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