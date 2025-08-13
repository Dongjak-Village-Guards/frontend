/**
 * 가게 상세 페이지 구현
 * 와이어프레임에 따라 두 가지 case를 처리:
 * 1. hasDesigners=true: 디자이너 목록 표시 후, 디자이너 선택 시 메뉴 표시
 * 2. hasDesigners=false: 바로 메뉴 표시
 * mockShopList.js의 STORES_DATA에서 데이터 동적 로드
 * 예약 페이지 및 개인정보 동의서 표시 추가
 */

import { useNavigate, useParams } from 'react-router-dom';
import useStore from '../hooks/store/useStore';
import MenuCard from '../components/home/detail/MenuCard';
import ShopInfo from '../components/home/detail/ShopInfo';
import MenuList from '../components/home/detail/MenuList';
import styled from 'styled-components';
import DesignerCard from '../components/home/detail/DesignerCard';
import chickenImage from "../assets/images/chicken.png";
import pizzaImage from "../assets/images/pizza.png";
import saladImage from "../assets/images/salad.png";
import steakImage from "../assets/images/steak.png";
import koreanImage from "../assets/images/korean.png";
import hairImage from "../assets/images/hair.png";
import DesignerInfo from '../components/home/detail/DesignerInfo';
import ReservationPage from './ReservationPage';
import Layout from '../components/layout/Layout';
import TopNavBar from '../components/nav/TopNavBar';

const ShopDetailPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { 
        stores,
        currentTime,
        isReserving,
        selectedDesigner,
        showPiAgreement,
        selectDesigner,
        startReservation,
        cancelReservation,
        togglePiAgreement
    } = useStore();

    /* STORES_DATA에서 직접 데이터를 찾으면 Zustand stores 상태와 별개로 mock 데이터를 읽는 거라
    홈 화면과의 좋아요 상태가 공유되지 않음. 따라서 STORES_DATA 대신 useStore에서 상태를 불러와야 함
    이렇게 하면 toggleLike 실행 시 상태가 전역으로 바뀌어서 홈 화면과 상세페이지 양쪽에 동일하게 반영됨 */
    const shop = stores.find(store => store.id === parseInt(id)) || stores[0];

    // 가게 ID에 따라 이미지 매핑 (임시)
    const imageMap = {
        1: chickenImage,
        2: pizzaImage,
        3: saladImage,
        4: steakImage,
        5: koreanImage,
        6: hairImage,
        7: hairImage,
    };

    const imageSrc = shop.image || imageMap[shop.id] || "/assets/images/placeholder.png";

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
        if (showPiAgreement) {
            togglePiAgreement(); // 동의서 숨김
        } else if (isReserving) {
            cancelReservation(); // 예약 상태 초기화
        } else if (shop.hasDesigners && selectedDesigner) {
            cancelReservation(); // 디자이너 선택 해제
        } else {
            navigate('/');
        }
    };

    // 예약 버튼 클릭 시
    const handleReserve = (menu) => {
        startReservation(menu, selectedDesigner);
    };

    // 디자이너 선택
    const handleSelectDesigner = (designer) => {
        selectDesigner(designer);
    };

    // 대표 메뉴 이름 (전문 분야로 사용)
    const specialty = selectedDesigner?.menus?.reduce((prev, curr) =>
    prev.discountRate > curr.discountRate ? prev : curr
    )?.name || 'N/A';

    const shopName = selectedDesigner ? `${shop.name} / ${selectedDesigner.name}` : shop.name;

  return (
    <Layout currentPage="shop-detail">
        <PageContainer>
            <TopNavBar
                onBack={handleBack}
                title={
                showPiAgreement ? '개인정보 제3자 제공 동의서' :
                isReserving ? '예약하기' :
                shopName
                }
                showLike={!isReserving && !showPiAgreement}
                storeId={shop.id}
                isLiked={shop.isLiked}
            />
    
            {/* 콘텐츠 영역 */}
            <ContentContainer>
                {isReserving ? (
                    <ReservationPage shop={shop} />
                ) : (
                    <>
                    {!shop.hasDesigners || !selectedDesigner ? (
                        <ShopImage 
                            src={imageSrc} 
                            alt={shop.name} 
                        />
                    ) : null}
                    {!shop.hasDesigners || !selectedDesigner ? (
                        <ShopInfo
                            name={shop.name}
                            address={shop.address}
                            distance={`${shop.distance}m`}
                            reservationTime={`${currentTime} 예약`}
                        />
                    ) : (
                        <DesignerInfo
                            name={selectedDesigner.name}
                            specialty={`${specialty} 전문`}
                            reservationTime={`${currentTime} 방문`}
                        />
                    )}
                    {shop.hasDesigners ? (
                        !selectedDesigner ? (
                            <>
                                <Line />
                                <DesignerSection>
                                    {shop.designers.map(designer => (
                                        <DesignerCard
                                            key={designer.id}
                                            designer={designer}
                                            onSelect={() => handleSelectDesigner(designer)}
                                        />
                                    ))}
                                </DesignerSection>
                            </>
                        ) : (
                            <>
                                <Line />
                                <MenuSection>
                                    <SectionTitle>가장 할인율이 큰 대표 메뉴!</SectionTitle>
                                    <MenuCard
                                        menu={getFeaturedMenu()}
                                        onReserve={() => handleReserve(getFeaturedMenu())}
                                    />
                                </MenuSection>
                                <Line />
                                <MenuSection>
                                    <SectionTitle>다른 할인 메뉴</SectionTitle>
                                    <MenuList menus={getOtherMenus()} onReserve={handleReserve} />
                                </MenuSection>
                            </>
                        )
                    ) : (
                        <>
                            <Line />
                            <MenuSection>
                                <SectionTitle>가장 할인율이 큰 대표 메뉴!</SectionTitle>
                                <MenuCard
                                    menu={getFeaturedMenu()}
                                    onReserve={() => handleReserve(getFeaturedMenu())}
                                />
                            </MenuSection>
                            <Line />
                            <MenuSection>
                                <SectionTitle>다른 할인 메뉴</SectionTitle>
                                <MenuList menus={getOtherMenus()} onReserve={handleReserve} />
                            </MenuSection>
                        </>
                    )}
                    </>
                )}
                </ContentContainer>
        </PageContainer>
    </Layout>
  );
};

export default ShopDetailPage;

// ===== Styled Components ===== //

/* 페이지 전체 컨테이너 */
const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background: #fff;
`;

/* 콘텐츠 영역 (스크롤 가능) */
const ContentContainer = styled.div`
    flex: 1;
    overflow-y: auto;
    position: relative;
    top: 100px;
`;

/* 가게 이미지 */
const ShopImage = styled.img`
    width: 100%;
    height: 120px;
    padding: 0 16px;
    object-fit: cover;
    opacity: 0.65;
`;

/* 디자이너 선택 섹션 */
const DesignerSection = styled.div`
    padding: 16px;
`;

/* 섹션 제목 (대표 메뉴, 다른 메뉴) */
const SectionTitle = styled.h2`
    font-size: 14px;
    font-weight: 600;
    line-height: 14px;
    color: #000;
    margin-bottom: 8px;
`;

/* 메뉴 섹션 */
const MenuSection = styled.div`
    padding: 12px 16px 0px 16px;
`;

/* 구분선 */
const Line = styled.div`
    width: 100% - 32px;
    height: 1px;
    background: #e2e4e9;
    margin: 0px 16px;
`;