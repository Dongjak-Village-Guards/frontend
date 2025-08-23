/**
 * 메뉴 정보를 표시하는 공통 카드 컴포넌트
 * 대표 메뉴와 다른 메뉴 목록에 모두 사용
 */

import { useParams } from 'react-router-dom';
import menuImage from '../../../../assets/images/menu.png';
import useStore from '../../../../hooks/store/useStore';
import ReservationButton from '../../../ui/ReservationButton/ReservationButton';
import { Card, Div, MenuImage, Detail, MenuName, PriceInfo, DiscountRate, OriginalPrice, DiscountPrice, ButtonContainer } from './MenuCard.styles';

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
    const { startReservation } = useStore();
    const { id } = useParams();

    // menu가 없거나 필수 필드가 없을 경우 처리
    if (!menu) {
        console.warn('MenuCard: menu prop이 없습니다.');
        return null;
    }

    const handleReserve = (e) => {
        e.stopPropagation();
        startReservation(menu, null);
        onReserve();
    };

    // API 응답 구조에 맞게 필드 매핑
    const menuName = menu.menu_name || menu.name || '메뉴명 없음';
    const discountRate = menu.discount_rate || menu.discountRate || 0;
    const originalPrice = menu.menu_price || menu.originalPrice || 0;
    const discountPrice = menu.discounted_price || menu.discountPrice || 0;
    const isAvailable = menu.is_available || menu.isReserved || false;

    // 예약 불가능 상태에 따른 버튼 텍스트 결정
    const getButtonText = () => {
        if (!isAvailable) {
            return "예약 마감";
        }
        return "예약하기";
    };

    // 이미지 로드 실패 시 임시 이미지로 대체
    const handleImageError = (e) => {
        console.warn(`메뉴 이미지 로드 실패: ${menuName}, using fallback`);
        e.target.src = menuImage;
        e.target.alt = '임시 메뉴 이미지';
    };

  return (
    <Card isUnavailable={!isAvailable}>
        <Div>
            <MenuImage 
                src={menu.menu_image_url || menuImage} 
                alt={menuName}
                onError={handleImageError}
            />
            <Detail>
                <MenuName isUnavailable={!isAvailable}>{menuName.length > 7 ? `${menuName.slice(0, 7)}...` : menuName}</MenuName>
                <PriceInfo>
                    <DiscountRate isUnavailable={!isAvailable}>{discountRate}%</DiscountRate>
                    <OriginalPrice isUnavailable={!isAvailable}>{originalPrice.toLocaleString()}원</OriginalPrice>
                </PriceInfo>
                <DiscountPrice isUnavailable={!isAvailable}>{discountPrice.toLocaleString()}원</DiscountPrice>
            </Detail>
        </Div>
        <ButtonContainer>
            <ReservationButton onClick={handleReserve} disabled={!isAvailable}>
                {getButtonText()}
            </ReservationButton>
        </ButtonContainer>
    </Card>
  );
};

export default MenuCard; 