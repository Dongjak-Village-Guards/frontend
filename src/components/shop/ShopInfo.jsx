/**
 * 가게 정보를 표시하는 컴포넌트
 */

import React from 'react'
import styled from 'styled-components';

/**
 * @param {string} name - 가게 이름
 * @param {string} address - 주소
 * @param {string} distance - 거리
 * @param {string} walkingTime - 도보 시간
 * @param {string} reservationTime - 예약 시간
 * 
 */

const ShopInfo = ({ name, address, distance, walkingTime, reservationTime }) => {
  return (
    <InfoContainer>
        <ShopName>{name.length > 15 ? `${name.slice(0, 12)}...` : name}</ShopName>
        <InfoText>{address}</InfoText>
        <InfoText>
            {distance} | {walkingTime}
        </InfoText>
        <ReservationTime>{reservationTime}</ReservationTime>
    </InfoContainer>
  );
};

export default ShopInfo

// ===== Styled Components ===== //

/* 가게 정보 컨테이너 */
const InfoContainer = styled.div`
    padding: 16px;
    background: #fff;
`;

/* 가게 이름 (긴 이름은 ... 처리) */
const ShopName = styled.h2`
    font-size: clamp(18px, 5vw, 20px);
    font-weight: 700;
    color: #000;
    margin-bottom: 8px;
`;

/* 주소, 거리, 도보 시간 텍스트 */
const InfoText = styled.p`
    font-size: clamp(12px, 3.5vw, 14px);
    color: #000;
    margin-bottom: 4px;
`;

/* 예약 시간 텍스트 */
const ReservationTime = styled.p`
    font-size: clamp(12px, 3.5vw, 14px);
    color: #da2538;
    font-weight: 600;
    margin-top: 4px;
`