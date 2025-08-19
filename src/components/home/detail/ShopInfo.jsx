/**
 * 가게 정보를 표시하는 컴포넌트
 */

import styled from 'styled-components';

/**
 * @param {string} name - 가게 이름
 * @param {string} address - 주소
 * @param {string} distance - 거리
 * @param {string} walkingTime - 도보 시간
 * @param {string} reservationTime - 예약 시간
 * 
 */

const ShopInfo = ({ name, address, distance, reservationTime }) => {
  return (
    <InfoContainer>
        <Title>
            <ShopName>{name.length > 15 ? `${name.slice(0, 15)}...` : name}</ShopName>
            <ReservationTime>{reservationTime}</ReservationTime>
        </Title>
        <InfoText className='address'>{address}</InfoText>
        <InfoText className='distance'>{distance}</InfoText>
    </InfoContainer>
  );
};

export default ShopInfo;

// ===== Styled Components ===== //

/* 가게 정보 컨테이너 */
const InfoContainer = styled.div`
    padding: 16px 22px;
    background: #fff;
`;

const Title = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    align-items: center;
`;

/* 가게 이름 (긴 이름은 ... 처리) */
const ShopName = styled.h2`
    font-size: 16px;
    font-weight: 700;
    color: #000;
`;

/* 주소, 거리 텍스트 */
const InfoText = styled.p`
    font-size: 14px;
    color: #000;
    line-height: 14px;

    &.address {
        font-weight: 500;
        margin-bottom: 10px;
    }

    &.distance {
        font-weight: 600;
    }
`;

/* 예약 시간 텍스트 */
const ReservationTime = styled.p`
    font-size: 18px;
    color: #da2538;
    font-weight: 700;
`;