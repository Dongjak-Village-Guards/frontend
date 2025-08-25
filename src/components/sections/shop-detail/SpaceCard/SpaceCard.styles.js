import styled from 'styled-components';

// ===== Styled Components ===== //

/* Space 카드 컨테이너 (기존 DesignerCard와 동일한 스타일) */
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
`;

export const Div = styled.div`
    display: flex;
    align-items: center;
`;

/* Space 이미지 (기존 DesignerCard와 동일한 스타일) */
export const SpaceImage = styled.img`
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

/* Space 이름 (기존 DesignerCard와 동일한 스타일) */
export const SpaceName = styled.h3`
    font-size: 14px;
    font-weight: 600;
    line-height: 14px;
    color: #000;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

/* 최대 할인율 텍스트 (기존 DesignerCard와 동일한 스타일) */
export const DiscountText = styled.p`
    font-size: 14px;
    color: #da2538;
    font-weight: 600;
    line-height: 14px;
`;

export const StyledSpan = styled.span`
    color: #000;
    font-size: 14px;
    line-height: 14px;
    font-weight: 500;
`;

/* 예약 가능 여부 텍스트 */
export const StatusText = styled.span`
    font-size: 12px;
    color: ${props => props.$isPossible ? '#4CAF50' : '#999'};
    font-weight: 500;
    line-height: 14px;
`;

export const ButtonContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding-right: 16px;
`; 