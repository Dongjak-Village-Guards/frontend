import React from 'react'
import designerImage from '../../assets/images/designer.png';
import styled from 'styled-components';

const DesignerInfo = ({ name, specialty, reservationTime }) => {
  return (
    <DesignerInfoContainer>
        <DesignerImage src={designerImage} alt='임시 디자이너 이미지' />
        <Detail>
            <DesignerName>{name}</DesignerName>
            <ReservationTime>{reservationTime}</ReservationTime>
            <Specialty>{specialty}</Specialty>
        </Detail>
    </DesignerInfoContainer>
  )
}

export default DesignerInfo

// ===== Styled Components ===== //

const DesignerInfoContainer = styled.div`
    padding: 16px 32px;
    background: #fff;
    font-family: Pretendard;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const DesignerImage = styled.img`
  width: 140px;
  height: 96px;
  object-fit: cover;
  flex-shrink: 0;
  border-radius: 16px;
`;

const Detail = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    width: 140px;
`

const DesignerName = styled.h3`
    font-size: 20px;
    font-weight: 700;
    line-height: 14px;
    color: #000;
`;

const ReservationTime = styled.span`
    font-size: 16px;
    font-weight: 700;
    color: #da2538;
    line-height: 14px;
`;

const Specialty = styled.span`
    font-size: 14px;
    font-weight: 600;
    color: #000;
    line-height: 14px;
`;