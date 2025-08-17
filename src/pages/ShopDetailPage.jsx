/**
 * 가게 상세 페이지 구현
 * 와이어프레임에 따라 두 가지 case를 처리:
 * 1. hasDesigners=true: 디자이너 목록 표시 후, 디자이너 선택 시 메뉴 표시
 * 2. hasDesigners=false: 바로 메뉴 표시
 * 
 * ===== 백서버 연동 상태 =====
 * ✅ 연동됨: 가게 목록 데이터 (stores), 찜 상태 (isLiked), 기본 정보 (이름, 주소, 거리)
 * ❌ Mock 사용: 가게 이미지, 예약 시간 표시, 디자이너 전문 분야
 * 
 * ===== 적용 필요 사항 =====
 * 1. 시간 필터: currentTime → filters.userSelectedTime 사용
 * 2. 이미지: 백서버에서 이미지 URL 제공 필요
 * 3. 예약 시간: 실제 예약 가능 시간과 연동 필요
 */

import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
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
import placeholderImage from "../assets/images/placeholder.svg";
import DesignerInfo from '../components/home/detail/DesignerInfo';
import ReservationPage from './ReservationPage';
import Layout from '../components/layout/Layout';
import TopNavBar from '../components/nav/TopNavBar';
import { getNearestHour } from '../components/filter/TimeFilter';

const ShopDetailPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { 
        stores,
        currentTime,
        time,
        isReserving,
        selectedDesigner,
        showPiAgreement,
        selectedStore,
        storeSpaces,
        spaceLoading,
        selectDesigner,
        startReservation,
        cancelReservation,
        togglePiAgreement,
        fetchStoreDetail,
        selectSpace
    } = useStore();

    // useEffect로 가게 상세 정보 로드
    useEffect(() => {
        const loadStoreDetail = async () => {
            try {
                const store_id = parseInt(id);
                const timeParam = time ? parseInt(time.split(':')[0]) : new Date().getHours();
                await fetchStoreDetail(store_id, timeParam);
            } catch (error) {
                console.error('가게 상세 정보 로드 실패:', error);
                // 에러 발생 시 홈으로 이동
                //navigate('/');
            }
        };

        if (id) {
            loadStoreDetail();
        }
    }, [id, time, fetchStoreDetail, navigate]);

    // 가게 데이터 결정 (selectedStore가 있으면 사용, 없으면 기존 stores에서 찾기)
    const shop = selectedStore || stores.find(store => store.id === parseInt(id)) || stores[0];

    // ✅ 임시 이미지 매핑 사용 (백서버에 이미지 필드가 없어서)
    const imageMap = {
        1: chickenImage,
        2: pizzaImage,
        3: saladImage,
        4: steakImage,
        5: koreanImage,
        6: hairImage,
        7: hairImage,
    };

    // shop이 undefined일 수 있으므로 안전하게 처리
    const imageSrc = shop?.store_image_url || (shop ? imageMap[shop.id] : null) || placeholderImage;

    // ✅ 백서버 연동됨: 가게/디자이너 메뉴 데이터 사용
    const getFeaturedMenu = () => {
        if (!shop) return null;
        
        if (shop?.hasDesigners && selectedDesigner) {
            return selectedDesigner.menus?.reduce((prev, curr) => 
            prev.discount_rate > curr.discount_rate ? prev : curr
            );
        }
        return shop.menus?.reduce((prev, curr) =>
        prev.discount_rate > curr.discount_rate ? prev : curr
        );
    };

    // ✅ 백서버 연동됨: 가게/디자이너 메뉴 데이터 사용
    const getOtherMenus = () => {
        if (!shop) return [];
        
        const featured = getFeaturedMenu();
        if (!featured) return [];
        
        if (shop?.hasDesigners && selectedDesigner) {
            return selectedDesigner.menus?.filter(menu => menu.menu_id !== featured.menu_id) || [];
        }
        return shop.menus?.filter(menu => menu.menu_id !== featured.menu_id) || [];
    };

    // 뒤로 가기 처리
    const handleBack = () => {
        if (showPiAgreement) {
            togglePiAgreement(); // 동의서 숨김
        } else if (isReserving) {
            cancelReservation(); // 예약 상태 초기화
        } else if (shop?.hasDesigners && selectedDesigner) {
            cancelReservation(); // 디자이너 선택 해제
        } else {
            navigate('/');
        }
    };

    // 예약 버튼 클릭 시
    const handleReserve = (menu) => {
        startReservation(menu, selectedDesigner);
    };

    // Space 선택 (기존 디자이너 선택 로직과 동일하게 사용)
    const handleSelectDesigner = (designer) => {
        selectSpace(designer);
    };

    const shopName = selectedDesigner ? `${shop?.store_name || '가게명'} / ${selectedDesigner.space_name}` : (shop?.store_name || '가게명');

  return (
    <Layout currentPage="shop-detail">
        <PageContainer>
            {/* ✅ 백서버 연동됨: 찜 상태 (isLiked) */}
            <TopNavBar
                onBack={handleBack}
                title={
                showPiAgreement ? '개인정보 제3자 제공 동의서' :
                isReserving ? '예약하기' :
                shopName
                }
                showLike={!isReserving && !showPiAgreement}
                storeId={shop?.store_id}
                isLiked={shop?.is_liked}
            />
    
            {/* 콘텐츠 영역 */}
            <ContentContainer>
                {isReserving ? (
                    <ReservationPage shop={shop} />
                ) : (
                    <>
                    {!shop?.hasDesigners || !selectedDesigner ? (
                        <ShopImage 
                            src={imageSrc} 
                            alt={shop?.store_name}
                            onError={(e) => {
                                e.target.src = placeholderImage;
                            }}
                        />
                    ) : null}
                    {!shop?.hasDesigners || !selectedDesigner ? (
                        <ShopInfo
                            name={shop?.store_name}
                            address={shop?.store_address}
                            distance={`${shop?.distance}m`}
                            reservationTime={`${time || getNearestHour(currentTime)} 예약`}
                        />
                    ) : (
                        <DesignerInfo
                            name={selectedDesigner.space_name}
                            specialty={`${selectedDesigner.max_discount_rate}% 할인 전문`}
                            reservationTime={`${time || getNearestHour(currentTime)} 방문`}
                        />
                    )}
                    {shop?.hasDesigners ? (
                        !selectedDesigner ? (
                            <>
                                <Line />
                                <DesignerSection>
                                    {/* Space 목록을 DesignerCard로 표시 */}
                                    {storeSpaces.map(space => (
                                        <DesignerCard
                                            key={space.id}
                                            designer={space}
                                            onSelect={() => handleSelectDesigner(space)}
                                        />
                                    ))}
                                </DesignerSection>
                            </>
                        ) : (
                            <>
                                <Line />
                                <MenuSection>
                                    <SectionTitle>가장 할인율이 큰 대표 메뉴!</SectionTitle>
                                    {/* ✅ 백서버 연동됨: 메뉴 데이터 */}
                                    <MenuCard
                                        menu={getFeaturedMenu()}
                                        onReserve={() => handleReserve(getFeaturedMenu())}
                                    />
                                </MenuSection>
                                <Line />
                                <MenuSection>
                                    <SectionTitle>다른 할인 메뉴</SectionTitle>
                                    {/* ✅ 백서버 연동됨: 메뉴 데이터 */}
                                    <MenuList menus={getOtherMenus()} onReserve={handleReserve} />
                                </MenuSection>
                                {/* Space 목록 추가 */}
                                {storeSpaces.length > 0 && (
                                    <>
                                        <Line />
                                        <DesignerSection>
                                            {storeSpaces.map(space => (
                                                <DesignerCard
                                                    key={space.id}
                                                    designer={space}
                                                    onSelect={() => handleSelectDesigner(space)}
                                                />
                                            ))}
                                        </DesignerSection>
                                    </>
                                )}
                            </>
                        )
                    ) : (
                        <>
                            <Line />
                            <MenuSection>
                                <SectionTitle>가장 할인율이 큰 대표 메뉴!</SectionTitle>
                                {/* ✅ 백서버 연동됨: 메뉴 데이터 */}
                                <MenuCard
                                    menu={getFeaturedMenu()}
                                    onReserve={() => handleReserve(getFeaturedMenu())}
                                />
                            </MenuSection>
                            <Line />
                            <MenuSection>
                                <SectionTitle>다른 할인 메뉴</SectionTitle>
                                {/* ✅ 백서버 연동됨: 메뉴 데이터 */}
                                <MenuList menus={getOtherMenus()} onReserve={handleReserve} />
                            </MenuSection>
                            {/* Space 목록 추가 */}
                            {storeSpaces.length > 0 && (
                                <>
                                    <Line />
                                    <DesignerSection>
                                        {storeSpaces.map(space => (
                                            <DesignerCard
                                                key={space.id}
                                                designer={space}
                                                onSelect={() => handleSelectDesigner(space)}
                                            />
                                        ))}
                                    </DesignerSection>
                                </>
                            )}
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

