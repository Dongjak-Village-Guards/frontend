/**
 * 가게 상세 페이지 구현
 * 와이어프레임에 따라 두 가지 case를 처리:
 * 1. hasDesigners=true: 디자이너 목록 표시 후, 디자이너 선택 시 메뉴 표시
 * 2. hasDesigners=false: 바로 메뉴 표시
 * mockShopList.js의 STORES_DATA에서 데이터 동적 로드
 * 예약 페이지 및 개인정보 동의서 표시 추가
 */

import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useStore from '../hooks/store/useStore';
import useUserInfo from '../hooks/user/useUserInfo';
import MenuCard from '../components/sections/shop-detail/MenuCard/MenuCard';
import ShopInfo from '../components/sections/shop-detail/ShopInfo/ShopInfo';
import MenuList from '../components/sections/shop-detail/MenuList/MenuList';
import styled from 'styled-components';
import SpaceCard from '../components/sections/shop-detail/SpaceCard/SpaceCard';
import placeholderImage from "../assets/images/placeholder.svg";
import DesignerInfo from '../components/sections/shop-detail/DesignerInfo/DesignerInfo';
import ReservationPage from './ReservationPage';
import Layout from '../components/layout/Layout';
import TopNavBar from '../components/layout/TopNavBar/TopNavBar';
import Spinner from '../components/ui/Spinner/Spinner';
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
    const location = useLocation();
    const { 
        stores,
        time,
        isReserving,
        showPiAgreement,
        startReservation,
        cancelReservation,
        togglePiAgreement,
        toggleLikeWithAPI
    } = useStore();

    const { accessToken } = useUserInfo();

    // URL에서 shop-detail 상태 파악 함수 추가
    const getShopDetailStateFromUrl = () => {
        const pathParts = location.pathname.split('/');
        const storeId = pathParts[2]; // /shop/:id
        
        if (pathParts.length === 3) {
            return { type: 'entry-point', storeId }; // 기본 진입점
        }
        if (pathParts.length === 4 && pathParts[3] === 'menu') {
            return { type: 'single-space-menu', storeId }; // Space가 1개인 메뉴 페이지
        }
        if (pathParts.length === 4 && pathParts[3] === 'spaces') {
            return { type: 'spaces-list', storeId }; // Space 목록 페이지
        }
        if (pathParts.length === 5 && pathParts[3] === 'space') {
            return { type: 'space-menu', storeId, spaceId: pathParts[4] }; // 특정 Space의 메뉴 페이지
        }
        if (pathParts.length === 4 && pathParts[3] === 'reservation') {
            return { type: 'reservation', storeId }; // 예약 페이지
        }
        
        return { type: 'entry-point', storeId };
    };

    // 상태 관리
    const [storeData, setStoreData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [spaceCount, setSpaceCount] = useState(null);
    const [selectedSpaceId, setSelectedSpaceId] = useState(null);

    // URL 상태 파악 디버깅
    useEffect(() => {
        console.log('=== ShopDetailPage URL 상태 파악 디버깅 ===');
        console.log('현재 URL:', location.pathname);
        console.log('URL 상태:', getShopDetailStateFromUrl());
        
        // URL 변경 시 selectedSpaceId 상태 동기화
        const urlState = getShopDetailStateFromUrl();
        console.log('=== URL 변경에 따른 상태 동기화 ===');
        console.log('현재 selectedSpaceId:', selectedSpaceId);
        console.log('URL에서 추출한 spaceId:', urlState.spaceId);
        
        if (urlState.type === 'space-menu' && urlState.spaceId) {
            // Space 상세 페이지인 경우
            if (selectedSpaceId !== urlState.spaceId) {
                console.log(`selectedSpaceId 업데이트: ${selectedSpaceId} -> ${urlState.spaceId}`);
                setSelectedSpaceId(urlState.spaceId);
            }
        } else if (urlState.type === 'spaces-list' || urlState.type === 'entry-point') {
            // Space 목록 페이지인 경우
            if (selectedSpaceId !== null) {
                console.log(`selectedSpaceId 초기화: ${selectedSpaceId} -> null`);
                setSelectedSpaceId(null);
            }
        } else if (urlState.type === 'single-space-menu') {
            // 단일 Space 메뉴 페이지인 경우
            if (selectedSpaceId !== null) {
                console.log(`selectedSpaceId 초기화 (단일 Space): ${selectedSpaceId} -> null`);
                setSelectedSpaceId(null);
            }
        }
        
        console.log('최종 selectedSpaceId:', selectedSpaceId);
    }, [location.pathname, selectedSpaceId]);

    // 브라우저 뒤로가기/앞으로가기 감지 및 상태 동기화
    useEffect(() => {
        const handlePopState = () => {
            console.log('=== 브라우저 뒤로가기/앞으로가기 감지 ===');
            console.log('새로운 URL:', window.location.pathname);
            console.log('현재 selectedSpaceId:', selectedSpaceId);
            
            // URL 상태에 따라 selectedSpaceId 동기화
            const urlState = getShopDetailStateFromUrl();
            console.log('새로운 URL 상태:', urlState);
            
            if (urlState.type === 'space-menu' && urlState.spaceId) {
                if (selectedSpaceId !== urlState.spaceId) {
                    console.log(`브라우저 네비게이션: selectedSpaceId 업데이트 ${selectedSpaceId} -> ${urlState.spaceId}`);
                    setSelectedSpaceId(urlState.spaceId);
                }
            } else if (urlState.type === 'spaces-list' || urlState.type === 'entry-point' || urlState.type === 'single-space-menu') {
                if (selectedSpaceId !== null) {
                    console.log(`브라우저 네비게이션: selectedSpaceId 초기화 ${selectedSpaceId} -> null`);
                    setSelectedSpaceId(null);
                }
            }
        };

        window.addEventListener('popstate', handlePopState);
        
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [selectedSpaceId]);

    // storeData 디버깅을 위한 useEffect
    useEffect(() => {
        console.log('=== storeData 상태 변경 디버깅 ===');
        console.log('storeData:', storeData);
        console.log('storeData 타입:', typeof storeData);
        
        if (storeData) {
            console.log('=== storeData 상세 분석 ===');
            console.log('전체 storeData 객체:', JSON.stringify(storeData, null, 2));
            console.log('storeData 키들:', Object.keys(storeData));
            
            // 가게 정보
            console.log('가게 이름:', storeData.store_name);
            console.log('가게 주소:', storeData.store_address);
            console.log('가게 이미지:', storeData.store_image_url);
            console.log('거리:', storeData.distance);
            
            // Space 정보 (Space가 2개 이상인 경우)
            if (storeData.spaces) {
                console.log('=== Space 목록 정보 ===');
                console.log('Space 개수:', storeData.spaces.length);
                storeData.spaces.forEach((space, index) => {
                    console.log(`Space ${index + 1}:`, {
                        space_id: space.space_id,
                        space_name: space.space_name,
                        space_image_url: space.space_image_url,
                        max_discount_rate: space.max_discount_rate,
                        is_possible: space.is_possible,
                        menus_count: space.menus?.length || 0
                    });
                });
            }
            
            // 단일 Space 정보 (Space 상세 화면)
            if (storeData.space_name) {
                console.log('=== 단일 Space 정보 ===');
                console.log('Space 이름:', storeData.space_name);
                console.log('Space 이미지:', storeData.space_image_url);
            }
            
            // 메뉴 정보
            if (storeData.menus) {
                console.log('=== 메뉴 정보 ===');
                console.log('메뉴 개수:', storeData.menus.length);
                storeData.menus.forEach((menu, index) => {
                    console.log(`메뉴 ${index + 1}:`, {
                        menu_id: menu.menu_id,
                        menu_name: menu.menu_name,
                        discount_rate: menu.discount_rate,
                        menu_price: menu.menu_price,
                        discounted_price: menu.discounted_price,
                        is_available: menu.is_available,
                        item_id: menu.item_id
                    });
                });
            }
            
            console.log('=== 현재 페이지 상태 ===');
            console.log('spaceCount:', spaceCount);
            console.log('selectedSpaceId:', selectedSpaceId);
            console.log('loading:', loading);
            console.log('error:', error);
            console.log('---');
        } else {
            console.log('storeData가 null입니다.');
        }
    }, [storeData, spaceCount, selectedSpaceId, loading, error]);

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
        const urlState = getShopDetailStateFromUrl();
        // 예약 페이지 상태가 아닐 때만 예약 상태 초기화
        if (urlState.type !== 'reservation') {
            cancelReservation(); // 무한 츠쿠요미 막기용(렌더식 캐시 초기화)
        }
        const loadStoreData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const storeId = parseInt(id);
                const urlState = getShopDetailStateFromUrl();
                console.log('=== ShopDetailPage 초기 데이터 로드 시작 ===');
                console.log('Store ID:', storeId);
                console.log('Time 파라미터:', time);
                console.log('AccessToken 존재:', !!accessToken);
                console.log('URL 상태:', urlState);
                
                // 1. Space 개수 조회
                console.log('Space 개수 조회 시작...');
                const spacesData = await fetchStoreSpacesCount(storeId);
                console.log('Space 개수 조회 결과:', spacesData);
                console.log('Space 개수:', spacesData.count);
                setSpaceCount(spacesData.count);
                
                const timeParam = convertTimeToParam(time);
                console.log('변환된 시간 파라미터:', timeParam);
                
                if (spacesData.count === 1) {
                    // Space가 1개인 경우
                    if (urlState.type === 'entry-point') {
                        // /shop/:id로 접근한 경우 - /shop/:id/menu로 리다이렉트
                        console.log('Space가 1개인 경우: /shop/:id/menu로 리다이렉트');
                        navigate(`/shop/${storeId}/menu`);
                    } else if (urlState.type === 'single-space-menu') {
                        // /shop/:id/menu로 접근한 경우 - 정상 처리
                        console.log('=== Space가 1개인 경우: 바로 메뉴 조회 ===');
                        const menuData = await fetchStoreMenus(storeId, timeParam, accessToken);
                        console.log('메뉴 조회 결과:', menuData);
                        setStoreData(menuData);
                    } else {
                        // 다른 URL로 접근한 경우 - /shop/:id/menu로 리다이렉트
                        console.log('Space가 1개인 경우: 다른 URL에서 /shop/:id/menu로 리다이렉트');
                        navigate(`/shop/${storeId}/menu`);
                    }
                } else if (spacesData.count >= 2) {
                    // Space가 2개 이상인 경우
                    if (urlState.type === 'entry-point') {
                        // /shop/:id로 접근한 경우 - /shop/:id/spaces로 리다이렉트
                        console.log('Space가 2개 이상인 경우: /shop/:id/spaces로 리다이렉트');
                        navigate(`/shop/${storeId}/spaces`);
                    } else if (urlState.type === 'spaces-list') {
                        // /shop/:id/spaces로 접근한 경우 - 정상 처리
                        console.log('=== Space가 2개 이상인 경우: Space 목록 조회 ===');
                        const spacesListData = await fetchStoreSpacesList(storeId, timeParam, accessToken);
                        console.log('Space 목록 조회 결과:', spacesListData);
                        console.log('=== API 응답 전체 구조 분석 ===');
                        console.log('전체 응답 객체:', JSON.stringify(spacesListData, null, 2));
                        console.log('spaces 배열:', spacesListData.spaces);
                        console.log('spaces 배열 길이:', spacesListData.spaces?.length);
                        if (spacesListData.spaces && spacesListData.spaces.length > 0) {
                            console.log('첫 번째 Space 객체 전체:', JSON.stringify(spacesListData.spaces[0], null, 2));
                            console.log('첫 번째 Space의 모든 키:', Object.keys(spacesListData.spaces[0]));
                        }
                        
                        // 각 Space의 메뉴 정보를 확인하여 is_possible 계산
                        const spacesWithCorrectedInfo = spacesListData.spaces.map(space => {
                            // 디버깅 로그
                            console.log(`=== Space ${space.space_id} 디버깅 ===`);
                            console.log('Space 이름:', space.space_name);
                            console.log('원본 is_possible:', space.is_possible);
                            console.log('Space의 메뉴들:', space.menus); // API 응답에 메뉴 정보가 포함되어 있다면
                            
                            // 시간 만료 체크
                            const timeExpired = isTimeExpired();
                            console.log('시간 만료 여부:', timeExpired);
                            
                            // 해당 Space의 메뉴들 중 하나라도 예약 불가능한지 확인
                            const hasUnavailableMenu = space.menus && space.menus.some(menu => !menu.is_available);
                            console.log('예약 불가능한 메뉴 존재 여부:', hasUnavailableMenu);
                            console.log('각 메뉴의 is_available:', space.menus?.map(menu => ({ 
                                menu_id: menu.menu_id, 
                                menu_name: menu.menu_name, 
                                is_available: menu.is_available 
                            })));
                            
                            // 최종 is_possible 계산
                            const finalIsPossible = space.is_possible && !timeExpired && !hasUnavailableMenu;
                            console.log('최종 is_possible:', finalIsPossible);
                            console.log('---');
                            
                            return {
                                ...space,
                                is_possible: finalIsPossible
                            };
                        });
                        
                        // 수정된 Space 목록으로 storeData 설정
                        setStoreData({
                            ...spacesListData,
                            spaces: spacesWithCorrectedInfo
                        });
                    } else if (urlState.type === 'space-menu') {
                        // /shop/:id/space/:spaceId로 접근한 경우 - 정상 처리
                        console.log('=== 특정 Space의 메뉴 페이지 ===');
                        const spaceData = await fetchSpaceDetails(urlState.spaceId, timeParam, accessToken);
                        setStoreData(spaceData);
                        setSelectedSpaceId(urlState.spaceId);
                    } else if (urlState.type === 'reservation') {
                        // /shop/:id/reservation으로 접근한 경우 - 리다이렉트하지 않음
                        console.log('=== 예약 페이지 상태: 리다이렉트하지 않음 ===');
                        // 예약 페이지에서는 기존 데이터를 유지하거나 필요한 경우에만 데이터를 로드
                    } else {
                        // 다른 URL로 접근한 경우 - /shop/:id/spaces로 리다이렉트
                        console.log('Space가 2개 이상인 경우: 다른 URL에서 /shop/:id/spaces로 리다이렉트');
                        navigate(`/shop/${storeId}/spaces`);
                    }
                }
                
                console.log('=== ShopDetailPage 데이터 로드 완료 ===');
                console.log('최종 spaceCount:', spacesData.count);
                console.log('최종 storeData 설정됨');
                
            } catch (error) {
                console.error('ShopDetailPage: 데이터 로드 실패', error);
                setError(error.message);
            } finally {
                setLoading(false);
                console.log('ShopDetailPage 로딩 상태: false');
            }
        };

        if (id && time !== null) {
            loadStoreData();
        } else {
            console.log('ShopDetailPage: id 또는 time이 없어서 데이터 로드 건너뜀');
            console.log('id:', id);
            console.log('time:', time);
        }
    }, [id, time, accessToken, location.pathname, navigate]); // navigate 의존성 추가

    // 특정 Space 선택 시 상세 데이터 로드
    const handleSpaceSelect = async (spaceId) => {
        // URL 변경으로 Space 선택
        navigate(`/shop/${id}/space/${spaceId}`);
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
        console.log('=== getImageSrc 함수 실행 ===');
        console.log('입력된 imageUrl:', imageUrl);
        console.log('imageUrl 타입:', typeof imageUrl);
        
        if (imageUrl && imageUrl !== '') {
            console.log('이미지 URL 반환:', imageUrl);
            return imageUrl;
        }
        // 이미지가 없을 경우 기본 이미지 사용
        console.log('기본 placeholder 이미지 반환:', placeholderImage);
        return placeholderImage;
    };

    // 대표 메뉴 선택 (최대 할인율 기준)
    const getFeaturedMenu = () => {
        console.log('=== getFeaturedMenu 함수 실행 ===');
        console.log('storeData:', storeData);
        console.log('storeData.menus:', storeData?.menus);
        
        if (!storeData || !storeData.menus) {
            console.log('메뉴 데이터가 없음 - null 반환');
            return null;
        }
        
        const featured = storeData.menus.reduce((prev, curr) => 
            prev.discount_rate > curr.discount_rate ? prev : curr
        );
        console.log('대표 메뉴:', featured);
        return featured;
    };

    // 나머지 메뉴 목록
    const getOtherMenus = () => {
        console.log('=== getOtherMenus 함수 실행 ===');
        console.log('storeData:', storeData);
        console.log('storeData.menus:', storeData?.menus);
        
        if (!storeData || !storeData.menus) {
            console.log('메뉴 데이터가 없음 - 빈 배열 반환');
            return [];
        }
        
        const featured = getFeaturedMenu();
        console.log('대표 메뉴:', featured);
        
        if (!featured) {
            console.log('대표 메뉴가 없음 - 전체 메뉴 반환');
            return storeData.menus;
        }
        
        const otherMenus = storeData.menus.filter(menu => menu.menu_id !== featured.menu_id);
        console.log('나머지 메뉴 개수:', otherMenus.length);
        return otherMenus;
    };

    // 예약 가능한 메뉴가 있는지 확인
    const hasAvailableMenus = () => {
        if (!storeData || !storeData.menus) return false;
        return storeData.menus.some(menu => menu.is_available);
    };

    // Space 상세 화면에서는 모든 메뉴가 예약 가능한 상태로 가정
    // (Space 목록에서 이미 필터링되었으므로)
    const isMenuUnavailable = (menu) => {
        return false; // 항상 예약 가능
    };

    // Space 상세 화면에서는 모든 메뉴가 예약 가능한 상태로 가정
    // (Space 목록에서 이미 필터링되었으므로)
    const areAllMenusUnavailable = () => {
        return false; // 항상 예약 가능
    };

    // Space 상세 화면에서는 모든 메뉴가 예약 가능한 상태로 가정
    // (Space 목록에서 이미 필터링되었으므로)
    const getUnavailableReason = () => {
        return '예약 가능한 메뉴가 있습니다.';
    };

    // 뒤로 가기 처리 (URL 기반 네비게이션)
    const handleBack = () => {
        console.log('=== handleBack 함수 실행 ===');
        console.log('showPiAgreement:', showPiAgreement);
        console.log('isReserving:', isReserving);
        console.log('spaceCount:', spaceCount);
        console.log('selectedSpaceId:', selectedSpaceId);
        console.log('storeData:', storeData);
        console.log('id:', id);
        console.log('현재 URL:', location.pathname);
        
        if (showPiAgreement) {
            console.log('개인정보 동의서 숨김 처리');
            togglePiAgreement(); // 동의서 숨김
        } else if (isReserving) {
            // 예약 페이지에서 뒤로가기: 선택된 Space의 메뉴 페이지로
            console.log('예약 페이지에서 뒤로가기 처리');
            cancelReservation(); // 예약 상태 초기화
            if (spaceCount >= 2 && selectedSpaceId) {
                console.log(`예약 페이지 -> Space 메뉴 페이지로 이동: /shop/${id}/space/${selectedSpaceId}`);
                navigate(`/shop/${id}/space/${selectedSpaceId}`);
            } else if (spaceCount === 1) {
                console.log(`예약 페이지 -> 단일 메뉴 페이지로 이동: /shop/${id}/menu`);
                navigate(`/shop/${id}/menu`);
            } else {
                console.log(`예약 페이지 -> Space 목록 페이지로 이동: /shop/${id}/spaces`);
                navigate(`/shop/${id}/spaces`);
            }
        } else if (spaceCount >= 2 && selectedSpaceId) {
            // 특정 Space 메뉴 페이지에서 뒤로가기: Space 목록으로
            console.log('Space 메뉴 페이지에서 Space 목록으로 뒤로가기');
            setSelectedSpaceId(null);
            navigate(`/shop/${id}/spaces`);
        } else if (spaceCount >= 2 && !selectedSpaceId) {
            // Space 목록에서 뒤로가기: 홈페이지로
            console.log('Space 목록에서 홈페이지로 뒤로가기');
            navigate('/');
        } else if (spaceCount === 1) {
            // 단일 Space 메뉴 페이지에서 뒤로가기: 홈페이지로
            console.log('단일 Space 메뉴 페이지에서 홈페이지로 뒤로가기');
            navigate('/');
        } else {
            // 기본: 브라우저 히스토리 뒤로가기
            console.log('기본 브라우저 히스토리 뒤로가기');
            navigate(-1);
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
        // 예약 페이지로 URL 변경
        navigate(`/shop/${id}/reservation`);
    };

    // Space 선택 (디자이너 선택과 동일한 역할)
    const handleSelectSpace = (spaceId) => {
        handleSpaceSelect(spaceId);
    };

    // 대표 메뉴 이름 (전문 분야로 사용)
    const getSpecialty = () => {
        console.log('=== getSpecialty 함수 실행 ===');
        const featured = getFeaturedMenu();
        console.log('대표 메뉴:', featured);
        
        if (featured) {
            const specialty = `${featured.menu_name} 전문`;
            console.log('전문 분야:', specialty);
            return specialty;
        }
        
        console.log('전문 분야: N/A (대표 메뉴 없음)');
        return 'N/A';
    };

    // 페이지 제목 결정
    const getPageTitle = () => {
        console.log('=== getPageTitle 함수 실행 ===');
        console.log('showPiAgreement:', showPiAgreement);
        console.log('isReserving:', isReserving);
        console.log('spaceCount:', spaceCount);
        console.log('selectedSpaceId:', selectedSpaceId);
        console.log('storeData:', storeData);
        
        if (showPiAgreement) {
            console.log('페이지 제목: 개인정보 제3자 제공 동의서');
            return '개인정보 제3자 제공 동의서';
        }
        if (isReserving) {
            console.log('페이지 제목: 예약하기');
            return '예약하기';
        }
        if (spaceCount >= 2 && selectedSpaceId && storeData) {
            // Space 상세 페이지인 경우
            if (storeData.space_name) {
                const title = `${storeData.store_name} / ${storeData.space_name}`;
                console.log('페이지 제목 (Space 상세):', title);
                return title;
            } else {
                // space_name이 없는 경우 (Space 목록 데이터에서 특정 Space 찾기)
                const selectedSpace = storeData.spaces?.find(space => space.space_id === parseInt(selectedSpaceId));
                if (selectedSpace) {
                    const title = `${storeData.store_name} / ${selectedSpace.space_name}`;
                    console.log('페이지 제목 (Space 상세 - 찾은 Space):', title);
                    return title;
                } else {
                    console.log('페이지 제목 (Space 상세 - Space를 찾을 수 없음):', storeData.store_name);
                    return storeData.store_name;
                }
            }
        }
        if (storeData) {
            console.log('페이지 제목:', storeData.store_name);
            return storeData.store_name;
        }
        console.log('페이지 제목: 가게 상세 (기본값)');
        return '가게 상세';
    };

  return (
    <Layout currentPage="shop-detail">
        <PageContainer>
            {/* 네브 바 영역 */}
            <NavBarContainer>
                <TopNavBar
                    onBack={handleBack}
                    title={getPageTitle()}
                    showLike={!isReserving && !showPiAgreement && !(spaceCount >= 2 && selectedSpaceId)}
                    storeId={parseInt(id)}
                    isLiked={isLiked}
                    onLikeToggle={handleLikeToggle}
                />
            </NavBarContainer>
    
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
                    {(spaceCount === 1 || (spaceCount >= 2 && !selectedSpaceId)) && !isReserving ? (
                        <IntroductionSection>
                            {(() => {
                                console.log('=== 이미지 렌더링 디버깅 ===');
                                console.log('spaceCount:', spaceCount);
                                console.log('selectedSpaceId:', selectedSpaceId);
                                console.log('isReserving:', isReserving);
                                console.log('storeData:', storeData);
                                console.log('storeData?.store_image_url:', storeData?.store_image_url);
                                console.log('storeData?.space_image_url:', storeData?.space_image_url);
                                
                                const imageUrl = getImageSrc(storeData?.store_image_url || storeData?.space_image_url);
                                const imageAlt = storeData?.store_name || storeData?.space_name;
                                
                                console.log('최종 imageUrl:', imageUrl);
                                console.log('최종 imageAlt:', imageAlt);
                                
                                return (
                                    <ShopImage 
                                        src={imageUrl} 
                                        alt={imageAlt}
                                        onError={(e) => {
                                            console.warn('가게 이미지 로드 실패, placeholder 이미지로 대체');
                                            e.target.src = placeholderImage;
                                        }}
                                    />
                                );
                            })()}
                            <ShopInfo
                                name={storeData?.store_name}
                                address={storeData?.store_address}
                                distance={`${storeData?.distance}m`}
                                reservationTime={`${time} 예약`}
                            />
                        </IntroductionSection>
                    ) : null}
                    
                    {/* Space가 1개인 경우: 가게 정보 표시 */}
                    {spaceCount === 1 ? (
                        <></>
                    ) : spaceCount >= 2 && selectedSpaceId ? (
                        /* Space 상세 화면: Space 정보 표시 */
                        <DesignerInfo
                            name={storeData?.space_name}
                            specialty={`${getSpecialty()} 전문`}
                            reservationTime={`${time} 방문`}
                            designerImage={storeData?.space_image_url}
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
                            (() => {
                                console.log('=== Space 상세 화면 렌더링 ===');
                                console.log('selectedSpaceId:', selectedSpaceId);
                                console.log('storeData:', storeData);
                                console.log('storeData.menus:', storeData?.menus);
                                
                                const featuredMenu = getFeaturedMenu();
                                const otherMenus = getOtherMenus();
                                
                                console.log('featuredMenu:', featuredMenu);
                                console.log('otherMenus:', otherMenus);
                                
                                return (
                                    <>
                                        <Line />
                                        <MenuSection>
                                            <SectionTitle>가장 할인율이 큰 대표 메뉴!</SectionTitle>
                                            {featuredMenu ? (
                                                <MenuCard
                                                    menu={featuredMenu}
                                                    onReserve={() => handleReserve(featuredMenu)}
                                                />
                                            ) : (
                                                <div>메뉴를 불러오는 중...</div>
                                            )}
                                        </MenuSection>
                                        <Line />
                                        <MenuSection>
                                            <SectionTitle>다른 할인 메뉴</SectionTitle>
                                            <MenuList menus={otherMenus} onReserve={handleReserve} />
                                        </MenuSection>
                                    </>
                                );
                            })()
                        )
                    ) : (
                        /* Space가 1개인 경우: 바로 메뉴 목록 */
                        (() => {
                            console.log('=== 단일 Space 메뉴 목록 렌더링 ===');
                            console.log('storeData:', storeData);
                            console.log('storeData.menus:', storeData?.menus);
                            
                            const featuredMenu = getFeaturedMenu();
                            const otherMenus = getOtherMenus();
                            
                            console.log('featuredMenu:', featuredMenu);
                            console.log('otherMenus:', otherMenus);
                            
                            return (
                                <>
                                    <Line />
                                    <MenuSection>
                                        <SectionTitle>가장 할인율이 큰 대표 메뉴!</SectionTitle>
                                        {featuredMenu ? (
                                            <MenuCard
                                                menu={featuredMenu}
                                                onReserve={() => handleReserve(featuredMenu)}
                                            />
                                        ) : (
                                            <div>메뉴를 불러오는 중...</div>
                                        )}
                                    </MenuSection>
                                    <Line />
                                    <MenuSection>
                                        <SectionTitle>다른 할인 메뉴</SectionTitle>
                                        <MenuList menus={otherMenus} onReserve={handleReserve} />
                                    </MenuSection>
                                </>
                            );
                        })()
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
    height: 100vh;
    background: #fff;
`;

/* 네브 바 영역 */
const NavBarContainer = styled.div`
`;

/* 콘텐츠 영역 (스크롤 가능) */
const ContentContainer = styled.div`
    overflow-y: visible;
    position: relative;
    padding-top: 72px;
    min-height: calc(100vh - 72px);
`;

/* 가게 이미지 */
const ShopImage = styled.img`
    width: 100%;
    height: 120px;
    padding: 0 16px;
    object-fit: cover;
    opacity: 0.65;
`;

const IntroductionSection = styled.div`
    display: flex;
    flex-direction: column;
`;

/* 디자이너 선택 섹션 */
const DesignerSection = styled.div`
    padding: 16px 16px 0px 16px;
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