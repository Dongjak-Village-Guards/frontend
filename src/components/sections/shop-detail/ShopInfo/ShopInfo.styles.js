import styled from 'styled-components';

// ===== Styled Components ===== //

/* 가게 정보 컨테이너 */
export const InfoContainer = styled.div`
    padding: 16px 22px;
    background: #fff;
`;

export const Title = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    align-items: center;
`;

/* 가게 이름 (긴 이름은 ... 처리) */
export const ShopName = styled.h2`
    font-size: 16px;
    font-weight: 700;
    color: #000;
`;

/* 주소, 거리 텍스트 */
export const InfoText = styled.p`
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
export const ReservationTime = styled.p`
    font-size: 18px;
    color: #da2538;
    font-weight: 700;
`; 