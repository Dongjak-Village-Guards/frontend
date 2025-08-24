import styled from 'styled-components';

// ===== Styled Components ===== //

export const DesignerInfoContainer = styled.div`
    padding: 16px 32px;
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
`;

export const DesignerImage = styled.img`
  width: 140px;
  height: 96px;
  object-fit: cover;
  flex-shrink: 0;
  border-radius: 16px;
`;

export const Detail = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 3px;
`;

export const DesignerName = styled.h3`
    font-size: 20px;
    font-weight: 700;
    color: #000;
    word-break: keep-all;
`;

export const ReservationTime = styled.span`
    font-size: 16px;
    font-weight: 700;
    color: #da2538;
`;

export const Specialty = styled.span`
    font-size: 14px;
    font-weight: 600;
    color: #000;
`; 