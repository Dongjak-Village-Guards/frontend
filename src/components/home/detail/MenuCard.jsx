/**
 * 메뉴 정보를 표시하는 공통 카드 컴포넌트
 * 대표 메뉴와 다른 메뉴 목록에 모두 사용
 */

import styled from 'styled-components'
import menuImage from '../../../assets/images/menu.png';
import useStore from '../../../hooks/store/useStore';
import ReservationButton from '../../common/ReservationButton';

/**
 * MenuCard 컴포넌트
 * @param {Object} menu - 메뉴 정보 객체
 * @param {string} menu.name - 메뉴 이름
 * @param {number} menu.discountRate - 할인율 (%)
 * @param {number} menu.originalPrice - 원래 가격
 * @param {number} menu.discountPrice - 할인 가격
 * @param {boolean} menu.isReserved - 예약 여부
 * @param {Function} onReserve - 예약 버튼 클릭 시 호출
 */

const MenuCard = ({ menu, onReserve = false }) => {
    const { startReservation, selectedDesigner, isReserving } = useStore();

    // menu가 없거나 필수 필드가 없을 경우 처리
    if (!menu) {
        console.warn('MenuCard: menu prop이 없습니다.');
        return null;
    }

    const handleReserve = (e) => {
        e.stopPropagation();
        startReservation(menu, selectedDesigner);
        onReserve();
    };

    // 예약 페이지에서 메뉴 카드 속 '예약하기' 버튼 숨김
    const hideButton = isReserving;

    // API 응답 구조에 맞게 필드 매핑
    const menuName = menu.menu_name || menu.name || '메뉴명 없음';
    const discountRate = menu.discount_rate || menu.discountRate || 0;
    const originalPrice = menu.menu_price || menu.originalPrice || 0;
    const discountPrice = menu.discounted_price || menu.discountPrice || 0;
    const isReserved = !menu.is_available || menu.isReserved || false;

  return (
    <Card>
        <Div>
            <MenuImage src={menuImage} alt='임시 메뉴 이미지' />
            <Detail>
                <MenuName>{menuName.length > 7 ? `${menuName.slice(0, 7)}...` : menuName}</MenuName>
                <PriceInfo>
                    <DiscountRate>{discountRate}%</DiscountRate>
                    <OriginalPrice>{originalPrice.toLocaleString()}원</OriginalPrice>
                </PriceInfo>
                <DiscountPrice>{discountPrice.toLocaleString()}원</DiscountPrice>
            </Detail>
        </Div>
        <ButtonContainer>
            {!hideButton && (
                <ReservationButton onClick={handleReserve} disabled={isReserved}>
                    {isReserved ? "예약마감" : "예약하기"}
                </ReservationButton>
            )}
        </ButtonContainer>
    </Card>
  );
};

export default MenuCard;

// ===== Styled Components ===== //

/* 메뉴 카드 컨테이너 */
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

/* 메뉴 이미지 */
const MenuImage = styled.img`
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
`

/* 메뉴 이름 (긴 이름은 ... 처리) */
const MenuName = styled.h3`
    font-size: 14px;
    font-weight: 600;
    line-height: 14px;
    color: #000;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

/* 가격 정보 (할인율과 원래 가격) */
const PriceInfo = styled.div`
    display: flex;
    gap: 2px;
    align-items: center;
    font-size: 12px;
    font-weight: 400;
    line-height: 14px;
`;

/* 할인율 표시 */
const DiscountRate = styled.span`
    color: #F00;
    font-size: 12px;
`;

/* 원래 가격 (취소선 처리) */
const OriginalPrice = styled.span`
    font-size: 12px;
    color: #999;
    text-decoration: line-through;
`;

/* 할인 가격 */
const DiscountPrice = styled.span`
    font-size: 14px;
    font-weight: 600;
    color: #000;
    line-height: 14px;
`;

const ButtonContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding-right: 16px;
`;