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
 * @param {string} menu.menu_name - 메뉴 이름
 * @param {number} menu.discount_rate - 할인율 (%)
 * @param {number} menu.menu_price - 원래 가격
 * @param {number} menu.discounted_price - 할인 가격
 * @param {boolean} menu.is_available - 예약 가능 여부
 * @param {Function} onReserve - 예약 버튼 클릭 시 호출
 */

const MenuCard = ({ menu, onReserve = false }) => {
    const { startReservation, selectedDesigner, isReserving } = useStore();

    const handleReserve = (e) => {
        e.stopPropagation();
        startReservation(menu, selectedDesigner);
        onReserve();
    };

    // 예약 페이지에서 메뉴 카드 속 '예약하기' 버튼 숨김
    const hideButton = isReserving;

  return (
    <Card>
        <Div>
            <MenuImage src={menu.menu_image_url || menuImage} alt='메뉴 이미지' onError={(e) => {
                e.target.src = menuImage;
            }} />
            <Detail>
                <MenuName>{menu.menu_name.length > 7 ? `${menu.menu_name.slice(0, 7)}...` : menu.menu_name}</MenuName>
                <PriceInfo>
                    <DiscountRate>{menu.discount_rate}%</DiscountRate>
                    <OriginalPrice>{menu.menu_price.toLocaleString()}원</OriginalPrice>
                </PriceInfo>
                <DiscountPrice>{menu.discounted_price.toLocaleString()}원</DiscountPrice>
            </Detail>
        </Div>
        <ButtonContainer>
            {!hideButton && (
                <ReservationButton onClick={handleReserve} disabled={!menu.is_available}>
                    {!menu.is_available ? "예약마감" : "예약하기"}
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