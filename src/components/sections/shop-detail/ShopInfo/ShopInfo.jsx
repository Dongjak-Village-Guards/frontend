/**
 * 가게 정보를 표시하는 컴포넌트
 */

import { InfoContainer, Title, ShopName, InfoText, ReservationTime, MetaWalkTime, BottomInfoWrapper } from './ShopInfo.styles';

/**
 * @param {string} name - 가게 이름
 * @param {string} address - 주소
 * @param {string} distance - 거리
 * @param {string} reservationTime - 예약 시간
 * @param {number} store.walkTime - 도보 시간
 */

const ShopInfo = ({ name, address, distance, reservationTime, walkTime }) => {
  return (
    <InfoContainer>
        <Title>
            <ShopName>{name && name.length > 15 ? `${name.slice(0, 15)}...` : name || '가게명 없음'}</ShopName>
            <ReservationTime>{reservationTime}</ReservationTime>
        </Title>
        <InfoText className='address'>{address}</InfoText>
        <BottomInfoWrapper>
          <InfoText className='distance'>{distance}</InfoText>
          <MetaWalkTime>도보 {walkTime}분</MetaWalkTime>
        </BottomInfoWrapper>
    </InfoContainer>
  );
};

export default ShopInfo; 