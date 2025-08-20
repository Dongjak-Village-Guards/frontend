import styled from 'styled-components';

// ===== Styled Components ===== //

/* 메뉴 카드 컨테이너 */
export const Card = styled.div`
    background: #fff;
    border-radius: 16px;
    border: 1px solid #CCC;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    background-color: ${props => props.isUnavailable ? '#FFEBEB' : '#fff'}; /* 예약 불가능 상태일 때 배경색 변경 */
    border-color: ${props => props.isUnavailable ? '#FF0000' : '#CCC'}; /* 예약 불가능 상태일 때 테두리 색 변경 */
`;

export const Div = styled.div`
    display: flex;
    align-items: center;
`;

/* 메뉴 이미지 */
export const MenuImage = styled.img`
  width: 68px;
  height: 68px;
  object-fit: cover;
  flex-shrink: 0;
  border-radius: 10px;
  margin: 16px;
`;

export const Detail = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

/* 메뉴 이름 (긴 이름은 ... 처리) */
export const MenuName = styled.h3`
    font-size: 14px;
    font-weight: 600;
    line-height: 14px;
    color: ${props => props.isUnavailable ? '#FF0000' : '#000'}; /* 예약 불가능 상태일 때 색 변경 */
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

/* 가격 정보 (할인율과 원래 가격) */
export const PriceInfo = styled.div`
    display: flex;
    gap: 2px;
    align-items: center;
    font-size: 12px;
    font-weight: 400;
    line-height: 14px;
`;

/* 할인율 표시 */
export const DiscountRate = styled.span`
    color: ${props => props.isUnavailable ? '#FF0000' : '#F00'}; /* 예약 불가능 상태일 때 색 변경 */
    font-size: 12px;
`;

/* 원래 가격 (취소선 처리) */
export const OriginalPrice = styled.span`
    font-size: 12px;
    color: ${props => props.isUnavailable ? '#FF0000' : '#999'}; /* 예약 불가능 상태일 때 색 변경 */
    text-decoration: ${props => props.isUnavailable ? 'line-through' : 'line-through'}; /* 예약 불가능 상태일 때 취소선 제거 */
`;

/* 할인 가격 */
export const DiscountPrice = styled.span`
    font-size: 14px;
    font-weight: 600;
    color: ${props => props.isUnavailable ? '#FF0000' : '#000'}; /* 예약 불가능 상태일 때 색 변경 */
    line-height: 14px;
`;

export const ButtonContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding-right: 16px;
`; 