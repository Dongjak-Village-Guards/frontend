/**
 * 가게 상세 페이지 구현
 * 와이어프레임에 따라 두 가지 case를 처리:
 * 1. hasDesigners=true: 디자이너 목록 표시 후, 디자이너 선택 시 메뉴 표시
 * 2. hasDesigners=false: 바로 메뉴 표시
 * mockShopList.js의 STORES_DATA에서 데이터 동적 로드
 */

import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { ADDRESS_DATA, STORES_DATA } from '../apis/mock/mockShopList';
import useStore from '../hooks/store/useStore';
import LikeButton from '../components/shop/LikeButton';
import MenuCard from '../components/shop/MenuCard';
import ShopInfo from '../components/shop/ShopInfo';
import MenuList from '../components/shop/MenuList';
import styled from 'styled-components';
import DesignerCard from '../components/shop/DesignerCard';
import ReservationBottomSheet from '../components/shop/ReservationBottomSheet';

const ShopDetailPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [selectedDesigner, setSelectedDesigner] = useState(null);
    const { currentTime } = useStore();

    const shop = STORES_DATA.find(store => store.id === parseInt(id)) || STORES_DATA[0];

    // 대표 메뉴 선택 (최대 할인율 기준)
    const getFeaturedMenu = () => {
        if (shop.hasDesigners && selectedDesigner) {
            return selectedDesigner.menus.reduce((prev, curr) => 
            prev.discountRate > curr.discountRate ? prev : curr
            );
        }
        return shop.menus.reduce((prev, curr) =>
        prev.discountRate > curr.discountRate ? prev : curr
        );
    };

    // 나머지 메뉴 목록
    const getOtherMenus = () => {
        const featured = getFeaturedMenu();
        if (shop.hasDesigners && selectedDesigner) {
            return selectedDesigner.menus.filter(menu => menu.id !== featured.id);
        }
        return shop.menus.filter(menu => menu.id !== featured.id);
    };

    // 뒤로 가기 처리
    const handleBack = () => {
        if (shop.hasDesigners && selectedDesigner) {
            setSelectedDesigner(null);  // 디자이너 선택 해제
        } else {
            navigate('/')
        }
    };

    // 예약 버튼 클릭 시
    const handleReserve = (menu) => {
        setSelectedMenu(menu);
        setIsBottomSheetOpen(true);
    };

    // 디자이너 선택
    const handleSelectDesigner = (designer) => {
        setSelectedDesigner(designer);
    };

  return (
    <PageContainer>
        {/* 상단 네비게이션 바 */}
        <NavBar>
            <BackButton onClick={handleBack}>
                <svg className='w-6 h-6' fill='#000' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15 191-7 7 7-7' />
                </svg>
            </BackButton>
            <NavTitle>
                {shop.name}{selectedDesigner ? ` / ${selectedDesigner.name}` : ''}
            </NavTitle>
            <LikeButton storeId={shop.id} isLiked={shop.isLiked} />
        </NavBar>

        {/* 콘텐츠 영역 */}
        <ContentContainer>
            <ShopImage src={shop.image || '/assets/images/placeholder.png'} alt={shop.name} />
            <ShopInfo
                name={shop.name}
                address={ADDRESS_DATA}
                distance={`${shop.distance}m`}
                walkingTime={`${shop.walkTime}분`}
                reservationTime={`${currentTime} 예약`}
            />
            {shop.hasDesigners && !selectedDesigner ? (
                <DesignerSection>
                    <SectionTitle>디자이너 선택</SectionTitle>
                    {shop.designers.map(designer => (
                        <DesignerCard
                            key={designer.id}
                            designer={designer}
                            onSelect={() => handleSelectDesigner(designer)}
                        />
                    ))}
                </DesignerSection>
            ) : (
                <>
                    <MenuSection>
                        <SectionTitle>가장 할인율이 큰 대표 메뉴!</SectionTitle>
                        <MenuCard
                            menu={getFeaturedMenu()}
                            onReserve={() => handleReserve(getFeaturedMenu())}
                        />
                    </MenuSection>
                    <MenuSection>
                        <SectionTitle>다른 할인 메뉴</SectionTitle>
                        <MenuList menus={getOtherMenus()} onReserve={handleReserve} />
                    </MenuSection>
                </>
            )}
        </ContentContainer>

        {/* 예약 바텀시트 */}
        {isBottomSheetOpen && (
            <ReservationBottomSheet
                shop={shop}
                menu={selectedMenu}
                designer={selectedDesigner}
                onClose={() => setIsBottomSheetOpen(false)}
            />
        )}
    </PageContainer>
  );
};

export default ShopDetailPage

// ===== Styled Components ===== //

/* 페이지 전체 컨테이너 */
const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background: #fff;
`;

/* 상단 네비게이션 바 */
const NavBar = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 16px;
`;

/* 뒤로 가기 버튼 */
const BackButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
`;

/* 네비게이션 제목 (가게 이름 및 디자이너 이름) */
const NavTitle = styled.h1`
    font-size: clamp(16px, 4vw, 18px);
    font-weight: 700;
    color: #000;
`;

/* 콘텐츠 영역 (스크롤 가능) */
const ContentContainer = styled.div`
    flex: 1;
    overflow-y: auto;
    padding-top: 60px;
    padding-bottom: 60px;
`;

/* 가게 이미지 */
const ShopImage = styled.img`
    width: 100%;
    height: 200px;
    object-fit: cover;
`;

/* 디자이너 선택 섹션 */
const DesignerSection = styled.div`
    padding: 16px;
`;

/* 섹션 제목 (대표 메뉴, 다른 메뉴) */
const SectionTitle = styled.h2`
    font-size: clamp(10px, 5vw, 20px);
    font-weight: 700;
    color: #000;
    margin-bottom: 12px;
`;

/* 메뉴 섹션 */
const MenuSection = styled.div`
    padding: 16px;
`;