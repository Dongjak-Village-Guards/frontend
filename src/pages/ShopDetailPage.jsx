/**
 * 가게 상세 페이지 구현
 * 와이어프레임에 따라 두 가지 case를 처리:
 * 1. hasDesigners=true: 디자이너 목록 표시 후, 디자이너 선택 시 메뉴 표시
 * 2. hasDesigners=false: 바로 메뉴 표시
 * mockShopList.js의 STORES_DATA에서 데이터 동적 로드
 * 예약 페이지 및 개인정보 동의서 표시 추가
 */

import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useStore from '../hooks/store/useStore';
import useUserInfo from '../hooks/user/useUserInfo';
import MenuCard from '../components/home/detail/MenuCard';
import ShopInfo from '../components/home/detail/ShopInfo';
import MenuList from '../components/home/detail/MenuList';
import styled from 'styled-components';
import SpaceCard from '../components/home/detail/SpaceCard';
import placeholderImage from "../assets/images/placeholder.svg";
import DesignerInfo from '../components/home/detail/DesignerInfo';
import ReservationPage from './ReservationPage';
import Layout from '../components/layout/Layout';
import TopNavBar from '../components/nav/TopNavBar';
import Spinner from '../components/common/Spinner';
import { 
  fetchStoreSpacesCount, 
  fetchStoreMenus, 
  fetchStoreSpacesList, 
  fetchSpaceDetails,
  convertTimeToParam
} from '../apis/storeAPI';

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
        selectDesigner,
        startReservation,
        cancelReservation,
        togglePiAgreement,
        toggleLikeWithAPI
    } = useStore();

    const { accessToken } = useUserInfo();

    // 상태 관리
    const [storeData, setStoreData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [spaceCount, setSpaceCount] = useState(null);
    const [selectedSpaceId, setSelectedSpaceId] = useState(null);

    // 현재 가게의 Zustand 상태에서 좋아요 상태 가져오기
    const currentStore = stores.find(store => store.id === parseInt(id));
    const isLiked = currentStore?.isLiked || false;



    // 현재 시간과 메뉴 시간 비교 (이전 시간대는 예약 불가능)
    const isTimeExpired = () => {
        console.log('=== 시간 만료 체크 ===');
        console.log('time 파라미터:', time);
        console.log('time 타입:', typeof time);
        
        if (!time) {
            console.log('time 파라미터가 없음 - 만료되지 않음으로 처리');
            return false;
        }
        
        const currentHour = new Date().getHours();
        const menuHour = convertTimeToParam(time);
        
        console.log('현재 시간:', currentHour);
        console.log('메뉴 시간 (convertTimeToParam):', menuHour);
        console.log('시간 만료 여부:', menuHour < currentHour);
        console.log('비교 결과:', `${menuHour} < ${currentHour} = ${menuHour < currentHour}`);
        
        return menuHour < currentHour;
    };

    // 초기 데이터 로드
    useEffect(() => {
        const loadStoreData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const storeId = parseInt(id);
                console.log('ShopDetailPage: 초기 데이터 로드 시작', { storeId, time });
                
                // 1. Space 개수 조회
                const spacesData = await fetchStoreSpacesCount(storeId);
                setSpaceCount(spacesData.count);
                
                const timeParam = convertTimeToParam(time);
                
                if (spacesData.count === 1) {
                    // Space가 1개인 경우: 바로 메뉴 조회
                    const menuData = await fetchStoreMenus(storeId, timeParam, accessToken);
                    setStoreData(menuData);
                } else if (spacesData.count >= 2) {
                    // Space가 2개 이상인 경우: Space 목록 조회
                    const spacesListData = await fetchStoreSpacesList(storeId, timeParam, accessToken);
                    setStoreData(spacesListData);
                }
                
            } catch (error) {
                console.error('ShopDetailPage: 데이터 로드 실패', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (id && time !== null) {
            loadStoreData();
        }
    }, [id, time, accessToken]);

    // 특정 Space 선택 시 상세 데이터 로드
    const handleSpaceSelect = async (spaceId) => {
        try {
            setLoading(true);
            setError(null);
            
            const timeParam = convertTimeToParam(time);
            const spaceData = await fetchSpaceDetails(spaceId, timeParam, accessToken);
            
            setStoreData(spaceData);
            setSelectedSpaceId(spaceId);
            
        } catch (error) {
            console.error('Space 상세 데이터 로드 실패', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // 좋아요 토글 처리 - Zustand 스토어만 업데이트
    const handleLikeToggle = async () => {
        if (!storeData) return;
        
        try {
            await toggleLikeWithAPI(parseInt(id));
            // API 재호출 제거 - Zustand 스토어가 자동으로 상태를 업데이트함
        } catch (error) {
            console.error('좋아요 토글 실패', error);
        }
    };

    // 이미지 처리 함수
    const getImageSrc = (imageUrl) => {
        if (imageUrl && imageUrl !== '') {
            return imageUrl;
        }
        // 이미지가 없을 경우 기본 이미지 사용
        return placeholderImage;
    };

    // 대표 메뉴 선택 (최대 할인율 기준)
    const getFeaturedMenu = () => {
        if (!storeData || !storeData.menus) return null;
        return storeData.menus.reduce((prev, curr) => 
            prev.discount_rate > curr.discount_rate ? prev : curr
        );
    };

    // 나머지 메뉴 목록
    const getOtherMenus = () => {
        if (!storeData || !storeData.menus) return [];
        const featured = getFeaturedMenu();
        if (!featured) return storeData.menus;
        return storeData.menus.filter(menu => menu.menu_id !== featured.menu_id);
    };

    // 예약 가능한 메뉴가 있는지 확인
    const hasAvailableMenus = () => {
        if (!storeData || !storeData.menus) return false;
        return storeData.menus.some(menu => menu.is_available);
    };

    // 메뉴의 예약 불가능 여부 확인 (통합 조건)
    const isMenuUnavailable = (menu) => {
        if (!menu) return true;
        
        console.log('=== 개별 메뉴 예약 불가능 체크 ===');
        console.log('메뉴:', menu.menu_name);
        console.log('menu.is_available:', menu.is_available);
        console.log('time 파라미터:', time);
        
        const timeExpired = isTimeExpired();
        const result = !menu.is_available || timeExpired;
        
        console.log('시간 만료 여부:', timeExpired);
        console.log('최종 예약 불가능 여부:', result);
        console.log('---');
        
        return result;
    };

    // 모든 메뉴의 예약 가능 여부 확인 (수정된 버전)
    const areAllMenusUnavailable = () => {
        console.log('=== 모든 메뉴 예약 불가능 체크 ===');
        console.log('storeData:', storeData);
        console.log('storeData.menus:', storeData?.menus);
        console.log('time 파라미터:', time);
        
        if (!storeData || !storeData.menus) {
            console.log('메뉴 데이터 없음 - 예약 불가능으로 처리');
            return true;
        }
        
        const result = storeData.menus.every(menu => isMenuUnavailable(menu));
        console.log('모든 메뉴 예약 불가능 여부:', result);
        
        return result;
    };

    // 예약 불가능한 이유 확인
    const getUnavailableReason = () => {
        console.log('=== 예약 불가능 이유 확인 ===');
        console.log('storeData:', storeData);
        console.log('storeData.menus:', storeData?.menus);
        console.log('time 파라미터:', time);
        
        if (!storeData || !storeData.menus) {
            console.log('메뉴 데이터 없음');
            return '메뉴 정보가 없습니다.';
        }
        
        const currentHour = new Date().getHours();
        const menuHour = convertTimeToParam(time);
        
        console.log('현재 시간:', currentHour);
        console.log('메뉴 시간 (convertTimeToParam):', menuHour);
        console.log('그냥 time:', time);
        console.log('시간 만료 여부:', menuHour < currentHour);
        
        if (menuHour < currentHour) {
            console.log('시간 만료로 인한 예약 불가능');
            return '선택한 시간대가 이미 지났습니다.';
        }
        
        console.log('일반적인 예약 불가능');
        return '현재 예약 가능한 메뉴가 없습니다.';
    };

    // 뒤로 가기 처리
    const handleBack = () => {
        if (showPiAgreement) {
            togglePiAgreement(); // 동의서 숨김
        } else if (isReserving) {
            cancelReservation(); // 예약 상태 초기화
        } else if (spaceCount >= 2 && selectedSpaceId) {
            // Space 선택 해제하고 Space 목록으로 돌아가기
            setSelectedSpaceId(null);
            const loadSpacesList = async () => {
                try {
                    setLoading(true);
                    const storeId = parseInt(id);
                    const timeParam = convertTimeToParam(time);
                    const spacesListData = await fetchStoreSpacesList(storeId, timeParam, accessToken);
                    setStoreData(spacesListData);
                } catch (error) {
                    console.error('Space 목록 재로드 실패', error);
                } finally {
                    setLoading(false);
                }
            };
            loadSpacesList();
        } else {
            navigate('/');
        }
    };

    // 예약 버튼 클릭 시
    const handleReserve = (menu) => {
        console.log('=== 메뉴 선택 디버깅 ===');
        console.log('선택된 메뉴 객체:', menu);
        console.log('item_id 존재 여부:', !!menu?.item_id);
        console.log('item_id 값:', menu?.item_id);
        console.log('메뉴 ID:', menu?.menu_id);
        console.log('메뉴 이름:', menu?.menu_name);
        console.log('Space 개수:', spaceCount);
        console.log('선택된 Space ID:', selectedSpaceId);
        startReservation(menu, null);
    };

    // Space 선택 (디자이너 선택과 동일한 역할)
    const handleSelectSpace = (spaceId) => {
        handleSpaceSelect(spaceId);
    };

    // 대표 메뉴 이름 (전문 분야로 사용)
    const getSpecialty = () => {
        const featured = getFeaturedMenu();
        return featured ? featured.menu_name : 'N/A';
    };

    // 페이지 제목 결정
    const getPageTitle = () => {
        if (showPiAgreement) return '개인정보 제3자 제공 동의서';
        if (isReserving) return '예약하기';
        if (spaceCount >= 2 && selectedSpaceId && storeData) {
            return `${storeData.store_name} / ${storeData.space_name}`;
        }
        if (storeData) return storeData.store_name;
        return '가게 상세';
    };

  return (
    <Layout currentPage="shop-detail">
        <PageContainer>
            <TopNavBar
                onBack={handleBack}
                title={getPageTitle()}
                showLike={!isReserving && !showPiAgreement}
                storeId={parseInt(id)}
                isLiked={isLiked}
                onLikeToggle={handleLikeToggle}
            />
    
            {/* 콘텐츠 영역 */}
            <ContentContainer>
                {loading ? (
                    <LoadingContainer>
                        <Spinner />
                    </LoadingContainer>
                ) : error ? (
                    <ErrorContainer>
                        <ErrorText>데이터를 불러오는데 실패했습니다.</ErrorText>
                        <ErrorSubText>{error}</ErrorSubText>
                    </ErrorContainer>
                ) : isReserving ? (
                    <ReservationPage shop={storeData} />
                ) : (
                    <>
                    {/* Space가 1개이거나(메뉴목록) Space space 화면일 때(디자이너목록)만 이미지 표시 */}
                    {spaceCount === 1 || (spaceCount >= 2 && !selectedSpaceId) ? (
                        <ShopImage 
                            src={getImageSrc(storeData?.store_image_url || storeData?.space_image_url)} 
                            alt={storeData?.store_name || storeData?.space_name}
                            onError={(e) => {
                                console.warn('가게 이미지 로드 실패, placeholder 이미지로 대체');
                                e.target.src = placeholderImage;
                            }}
                        />
                    ) : null}
                    
                    {/* Space가 1개인 경우: 가게 정보 표시 */}
                    {spaceCount === 1 ? (
                        <ShopInfo
                            name={storeData?.store_name}
                            address={storeData?.store_address}
                            distance={`${storeData?.distance}m`}
                            reservationTime={`${time} 예약`}
                        />
                    ) : spaceCount >= 2 && selectedSpaceId ? (
                        /* Space 상세 화면: Space 정보 표시 */
                        <DesignerInfo
                            name={storeData?.space_name}
                            specialty={`${getSpecialty()} 전문`}
                            reservationTime={`${time} 방문`}
                        />
                    ) : null}
                    
                    {/* Space가 2개 이상인 경우 */}
                    {spaceCount >= 2 ? (
                        !selectedSpaceId ? (
                            /* Space 목록 화면 */
                            <>
                                <Line />
                                <DesignerSection>
                                    {storeData?.spaces?.map(space => (
                                        <SpaceCard
                                            key={space.space_id}
                                            space={{
                                                id: space.space_id,
                                                name: space.space_name,
                                                image: space.space_image_url,
                                                maxDiscountRate: space.max_discount_rate,
                                                isPossible: space.is_possible
                                            }}
                                            onSelect={handleSelectSpace}
                                        />
                                    ))}
                                </DesignerSection>
                            </>
                        ) : (
                            /* Space 상세 화면: 메뉴 목록 */
                            <>
                                <Line />
                                {areAllMenusUnavailable() ? (
                                    <UnavailableMessage>
                                        <UnavailableTitle>{getUnavailableReason()}</UnavailableTitle>
                                        <UnavailableSubtitle>다른 시간대를 확인해보세요</UnavailableSubtitle>
                                    </UnavailableMessage>
                                ) : (
                                    <>
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
                        )
                    ) : (
                        /* Space가 1개인 경우: 바로 메뉴 목록 */
                        <>
                            <Line />
                            {areAllMenusUnavailable() ? (
                                <UnavailableMessage>
                                    <UnavailableTitle>{getUnavailableReason()}</UnavailableTitle>
                                    <UnavailableSubtitle>다른 시간대를 확인해보세요</UnavailableSubtitle>
                                </UnavailableMessage>
                            ) : (
                                <>
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

/* 로딩 컨테이너 */
const LoadingContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
`;

/* 에러 컨테이너 */
const ErrorContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 200px;
    text-align: center;
`;

const ErrorText = styled.div`
    font-size: 16px;
    font-weight: 600;
    color: #666;
    margin-bottom: 8px;
`;

const ErrorSubText = styled.div`
    font-size: 14px;
    color: #999;
`;

const UnavailableMessage = styled.div`
    padding: 16px;
    text-align: center;
    color: #999;
    font-size: 14px;
`;

const UnavailableTitle = styled.div`
    font-weight: 600;
    margin-bottom: 4px;
`;

const UnavailableSubtitle = styled.div`
    font-size: 12px;
`;