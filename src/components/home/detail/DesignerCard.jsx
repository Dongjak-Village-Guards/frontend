/**
 * 디자이너 정보를 표시하는 카드 컴포넌트
 */

import styled from 'styled-components';
import designerImage from '../../../assets/images/designer.png';
import useStore from '../../../hooks/store/useStore';
import ReservationButton from '../../common/ReservationButton';

/**
 * DesignerCard 컴포넌트
 * @param {Object} designer - 디자이너 정보 객체
 * @param {string} designer.name - 디자이너 이름
 * @param {Object[]} designer.menus - 디자이너 메뉴 목록
 * @param {Function} onSelect - 디자이너 선택 시 호출
 */

const DesignerCard = ({ designer, onSelect }) => {
    const { startReservation } = useStore();

    // 최대 할인율 계산
    const maxDiscountRate = Math.max(...designer.menus.map(menu => menu.discountRate));

    const handleReserve = (e) => {
        e.stopPropagation();
        const firstMenu = designer.menus[0];
        startReservation(firstMenu, designer);
        onSelect();
    };

  return (
    <Card>
        <Div>
            <DesignerImage src={designerImage} alt='임시 디자이너 이미지' />
            <Detail>
                <DesignerName>{designer.name}</DesignerName>
                <DiscountText>
                    <StyledSpan>최대 할인율</StyledSpan> {maxDiscountRate}%
                </DiscountText>
            </Detail>
        </Div>
        <ButtonContainer>
            <ReservationButton onClick={handleReserve} disabled={designer.isReserved}>
                {designer.isReserved ? "예약마감" : "예약하기"}
            </ReservationButton>
        </ButtonContainer>
    </Card>
  );
};

export default DesignerCard;

// ===== Styled Components ===== //

/* 디자이너 카드 컨테이너 */
const Card = styled.div`
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

const Div = styled.div`
    display: flex;
    align-items: center;
`;

/* 디자이너 이미지 */
const DesignerImage = styled.img`
  width: 68px;
  height: 68px;
  object-fit: cover;
  flex-shrink: 0;
  border-radius: 10px;
  margin: 16px;
`;

const Detail = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

/* 디자이너 이름 */
const DesignerName = styled.h3`
    font-size: 14px;
    font-weight: 600;
    line-height: 14px;
    color: #000;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

/* 최대 할인율 텍스트 */
const DiscountText = styled.p`
    font-size: 14px;
    color: #da2538;
    font-weight: 600;
    line-height: 14px;
`;

const StyledSpan = styled.span`
    color: #000;
    font-size: 14px;
    line-height: 14px;
    font-weight: 500;
`;

const ButtonContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding-right: 16px;
`;