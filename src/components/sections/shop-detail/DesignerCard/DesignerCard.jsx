/**
 * 디자이너 정보를 표시하는 카드 컴포넌트
 */

import designerImage from '../../../../assets/images/designer.png';
import useStore from '../../../../hooks/store/useStore';
import ReservationButton from '../../../ui/ReservationButton/ReservationButton';
import { Card, Div, DesignerImage, Detail, DesignerName, DiscountText, StyledSpan, ButtonContainer } from './DesignerCard.styles';

/**
 * DesignerCard 컴포넌트
 * @param {Object} designer - 디자이너 정보 객체
 * @param {string} designer.name - 디자이너 이름
 * @param {Object[]} designer.menus - 디자이너 메뉴 목록
 * @param {Function} onSelect - 디자이너 선택 시 호출
 */

const DesignerCard = ({ designer, onSelect }) => {
    const { startReservation } = useStore();

    // menus가 없을 경우 처리
    if (!designer.menus || designer.menus.length === 0) {
        console.warn('DesignerCard: menus 필드가 없거나 비어있습니다.', designer);
        return null;
    }

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