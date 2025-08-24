/**
 * 가게 상세 페이지 구현
 * 와이어프레임에 따라 두 가지 case를 처리:
 * 1. hasDesigners=true: 디자이너 목록 표시 후, 디자이너 선택 시 메뉴 표시
 * 2. hasDesigners=false: 바로 메뉴 표시
 * mockShopList.js의 STORES_DATA에서 데이터 동적 로드
 * 예약 페이지 및 개인정보 동의서 표시 추가
 */

import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
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
import ScrollContainer from '../components/layout/ScrollContainer';

const ShopDetailPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const { 
        stores,
        time,
        isReserving,
        selectedMenu,
        showPiAgreement,
        startReservation,
        cancelReservation,
        togglePiAgreement,
        toggleLikeWithAPI,
        restoreReservationState
    } = useStore();

    const { accessToken } = useUserInfo();

    // URL에서 shop-detail 상태 파악 함수 추가
    const getShopDetailStateFromUrl = () => {
        const pathParts = location.pathname.split('/');
        const storeId = pathParts[2]; // /shop/:id
        
        console.log('=== getShopDetailStateFromUrl 함수 실행 ===');
        console.log('전체 pathname:', location.pathname);
        console.log('pathParts:', pathParts);
        console.log('pathParts.length:', pathParts.length);
        console.log('storeId:', storeId);
        
        if (pathParts.length === 3) {
            console.log('결과: entry-point');
            return { type: 'entry-point', storeId }; // 기본 진입점
        }
        if (pathParts.length === 4 && pathParts[3] === 'menu') {
            console.log('결과: single-space-menu');
            return { type: 'single-space-menu', storeId }; // Space가 1개인 메뉴 페이지
        }
        if (pathParts.length === 4 && pathParts[3] === 'spaces') {
            console.log('결과: spaces-list');
            return { type: 'spaces-list', storeId }; // Space 목록 페이지
        }
        if (pathParts.length === 5 && pathParts[3] === 'space') {
            console.log('결과: space-menu, spaceId:', pathParts[4]);
            return { type: 'space-menu', storeId, spaceId: pathParts[4] }; // 특정 Space의 메뉴 페이지
        }
        if (pathParts.length === 4 && pathParts[3] === 'reservation') {
            console.log('결과: reservation');
            return { type: 'reservation', storeId }; // 예약 페이지
        }
        
        console.log('결과: entry-point (기본값)');
        return { type: 'entry-point', storeId };
    };

    // 상태 관리
    const [storeData, setStoreData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [spaceCount, setSpaceCount] = useState(null);
    const [selectedSpaceId, setSelectedSpaceId] = useState(null);
    
    // 브라우저 히스토리 상태 추적 함수
    const logHistoryState = (context = '') => {
        console.log(`=== 📈 히스토리 상태 추적 ${context} ===`);
        console.log('📍 현재 URL:', window.location.href);
        console.log('📊 현재 pathname:', window.location.pathname);
        console.log('📈 히스토리 길이:', window.history.length);
        console.log('📋 히스토리 상태:', window.history.state);
        console.log('🔄 히스토리 스크롤 복원:', window.history.scrollRestoration);
        console.log('🕐 현재 시간:', new Date().toISOString());
        
        // 현재 페이지의 상태 정보
        console.log('📊 현재 페이지 상태:');
        console.log('  - isReserving:', isReserving);
        console.log('  - selectedMenu:', selectedMenu ? '있음' : '없음');
        console.log('  - selectedMenu_item_id:', selectedMenu?.item_id);
        console.log('  - showPiAgreement:', showPiAgreement);
        console.log('  - selectedSpaceId:', selectedSpaceId);
        console.log('  - storeData:', storeData ? '있음' : '없음');
        console.log('  - spaceCount:', spaceCount);
        
        // localStorage 상태 확인
        const reservationData = localStorage.getItem('reservationData');
        console.log('💾 localStorage 예약 데이터:', reservationData ? '있음' : '없음');
        if (reservationData) {
            try {
                const data = JSON.parse(reservationData);
                console.log('📋 localStorage 예약 데이터 상세:', {
                    menu_item_id: data.menu?.item_id,
                    timestamp: new Date(data.timestamp).toISOString(),
                    age: Date.now() - data.timestamp
                });
            } catch (error) {
                console.log('❌ localStorage 데이터 파싱 실패:', error);
            }
        }
        
        console.log('=== 히스토리 상태 추적 완료 ===');
    };
    
    // 이전 URL 추적을 위한 ref
    const previousPathnameRef = useRef(location.pathname);
    const isBackNavigationRef = useRef(false);
    const isNavigatingToHomeRef = useRef(false);

    // URL 상태 파악 디버깅
    useEffect(() => {
        console.log('=== ShopDetailPage URL 상태 파악 디버깅 ===');
        console.log('현재 URL:', location.pathname);
        console.log('URL 상태:', getShopDetailStateFromUrl());
        
        // URL 변경 시 selectedSpaceId 상태 동기화
        const urlState = getShopDetailStateFromUrl();
        console.log('=== URL 변경에 따른 상태 동기화 ===');
        console.log('현재 selectedSpaceId:', selectedSpaceId);
        console.log('현재 selectedSpaceId 타입:', typeof selectedSpaceId);
        console.log('URL에서 추출한 spaceId:', urlState.spaceId);
        console.log('URL에서 추출한 spaceId 타입:', typeof urlState.spaceId);
        console.log('URL 상태 타입:', urlState.type);
        
        if (urlState.type === 'space-menu' && urlState.spaceId) {
            // Space 상세 페이지인 경우
            console.log('=== Space 상세 페이지 감지 ===');
            console.log('현재 selectedSpaceId:', selectedSpaceId);
            console.log('URL의 spaceId:', urlState.spaceId);
            console.log('타입 비교:', typeof selectedSpaceId, typeof urlState.spaceId);
            console.log('값 비교:', selectedSpaceId === urlState.spaceId);
            console.log('숫자 변환 후 비교:', selectedSpaceId === parseInt(urlState.spaceId));
            
            if (selectedSpaceId !== urlState.spaceId) {
                console.log(`selectedSpaceId 업데이트: ${selectedSpaceId} -> ${urlState.spaceId}`);
                setSelectedSpaceId(urlState.spaceId);
            } else {
                console.log('selectedSpaceId가 이미 올바른 값으로 설정됨');
            }
        } else if (urlState.type === 'spaces-list' || urlState.type === 'entry-point') {
            // Space 목록 페이지인 경우
            console.log('=== Space 목록 페이지 감지 ===');
            if (selectedSpaceId !== null) {
                console.log(`selectedSpaceId 초기화: ${selectedSpaceId} -> null`);
                setSelectedSpaceId(null);
            } else {
                console.log('selectedSpaceId가 이미 null로 설정됨');
            }
        } else if (urlState.type === 'single-space-menu') {
            // 단일 Space 메뉴 페이지인 경우
            console.log('=== 단일 Space 메뉴 페이지 감지 ===');
            if (selectedSpaceId !== null) {
                console.log(`selectedSpaceId 초기화 (단일 Space): ${selectedSpaceId} -> null`);
                setSelectedSpaceId(null);
            } else {
                console.log('selectedSpaceId가 이미 null로 설정됨 (단일 Space)');
            }
        }
        
        console.log('최종 selectedSpaceId:', selectedSpaceId);
        console.log('=== URL 상태 파악 디버깅 완료 ===');
    }, [location.pathname]); // selectedSpaceId 의존성 제거

    // 브라우저 뒤로가기/앞으로가기 감지 및 상태 동기화
    useEffect(() => {
        let previousPathname = location.pathname;
        let isBackNavigation = false;
        
        const handlePopState = () => {
            console.log('=== 브라우저 뒤로가기/앞으로가기 감지 (popstate) ===');
            console.log('새로운 URL:', window.location.pathname);
            console.log('현재 selectedSpaceId:', selectedSpaceId);
            console.log('히스토리 길이:', window.history.length);
            console.log('히스토리 상태:', window.history.state);
            console.log('현재 시간:', new Date().toISOString());
            
            // URL 상태에 따라 selectedSpaceId 동기화
            const urlState = getShopDetailStateFromUrl();
            console.log('새로운 URL 상태:', urlState);
            
            // 즉시 상태 동기화 (setTimeout으로 비동기 처리)
            setTimeout(() => {
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
            }, 0);
            
            // 브라우저 뒤로가기로 entry-point 상태가 되었을 때 홈페이지로 이동
            if (urlState.type === 'entry-point') {
                console.log('=== 브라우저 뒤로가기로 entry-point 상태 감지 ===');
                console.log('홈페이지로 이동합니다.');
                
                // 홈페이지로 이동 중임을 표시
                isNavigatingToHomeRef.current = true;
                
                // 약간의 지연을 두고 홈페이지로 이동 (무한 루프 방지)
                setTimeout(() => {
                    navigate('/', { replace: true });
                }, 50);
            }
            
            console.log('=== 브라우저 네비게이션 처리 완료 ===');
        };

        console.log('=== popstate 이벤트 리스너 등록 ===');
        console.log('등록 시점의 URL:', window.location.pathname);
        console.log('등록 시점의 히스토리 길이:', window.history.length);
        
        window.addEventListener('popstate', handlePopState);
        
        return () => {
            console.log('=== popstate 이벤트 리스너 제거 ===');
            window.removeEventListener('popstate', handlePopState);
        };
    }, [navigate]); // selectedSpaceId 의존성 제거

    // URL 변경 감지 및 브라우저 뒤로가기 처리
    useEffect(() => {
        console.log('=== URL 변경 감지 ===');
        console.log('이전 URL:', previousPathnameRef.current);
        console.log('현재 URL:', location.pathname);
        console.log('히스토리 길이:', window.history.length);
        console.log('히스토리 상태:', window.history.state);
        console.log('isReserving 상태:', isReserving);
        console.log('showPiAgreement 상태:', showPiAgreement);
        
        // URL이 변경되었을 때
        if (previousPathnameRef.current !== location.pathname) {
            console.log('URL이 변경되었습니다.');
            
            const urlState = getShopDetailStateFromUrl();
            console.log('현재 URL 상태:', urlState);
            console.log('이전 URL에 /spaces 포함 여부:', previousPathnameRef.current.includes('/spaces'));
            console.log('이전 URL에 /reservation 포함 여부:', previousPathnameRef.current.includes('/reservation'));
            console.log('이전 URL에 /space/ 포함 여부:', previousPathnameRef.current.includes('/space/'));
            
            // Space 목록 페이지에서 entry-point로 이동한 경우 (브라우저 뒤로가기로 추정)
            if (previousPathnameRef.current.includes('/spaces') && urlState.type === 'entry-point') {
                console.log('=== Space 목록에서 entry-point로 이동 감지 (브라우저 뒤로가기로 추정) ===');
                console.log('홈페이지로 이동합니다.');
                
                // 홈페이지로 이동 중임을 표시
                isNavigatingToHomeRef.current = true;
                
                // 약간의 지연을 두고 홈페이지로 이동
                setTimeout(() => {
                    navigate('/', { replace: true });
                }, 50);
            }
            
            // 단일 메뉴 페이지에서 entry-point로 이동한 경우 (브라우저 뒤로가기로 추정)
            if (previousPathnameRef.current.includes('/menu') && urlState.type === 'entry-point') {
                console.log('=== 단일 메뉴 페이지에서 entry-point로 이동 감지 (브라우저 뒤로가기로 추정) ===');
                console.log('이전 URL:', previousPathnameRef.current);
                console.log('현재 URL 상태:', urlState);
                console.log('홈페이지로 이동합니다.');
                
                // 홈페이지로 이동 중임을 표시
                isNavigatingToHomeRef.current = true;
                
                // 약간의 지연을 두고 홈페이지로 이동
                setTimeout(() => {
                    navigate('/', { replace: true });
                }, 50);
            }
            
            // 예약 페이지에서 다른 페이지로 이동한 경우 (앞으로가기/뒤로가기)
            if (previousPathnameRef.current.includes('/reservation')) {
                console.log('=== 예약 페이지에서 다른 페이지로 이동 감지 ===');
                console.log('이동 전 URL:', previousPathnameRef.current);
                console.log('이동 후 URL:', location.pathname);
                console.log('이동 후 URL 상태:', urlState);
                
                // 예약 페이지에서 Space 메뉴 페이지로 이동해야 하는 경우
                if (urlState.type === 'space-menu' && selectedSpaceId) {
                    console.log('예약 페이지에서 Space 메뉴 페이지로 이동해야 함');
                    console.log('selectedSpaceId:', selectedSpaceId);
                    // 예약 상태 초기화
                    cancelReservation();
                } else if (urlState.type === 'single-space-menu') {
                    console.log('예약 페이지에서 단일 메뉴 페이지로 이동해야 함');
                    // 예약 상태 초기화
                    cancelReservation();
                } else if (urlState.type === 'spaces-list') {
                    console.log('예약 페이지에서 Space 목록 페이지로 이동해야 함');
                    // 예약 상태 초기화
                    cancelReservation();
                }
            }
            
            // Space 메뉴 페이지에서 예약 페이지로 이동한 경우 (앞으로가기)
            if (previousPathnameRef.current.includes('/space/') && urlState.type === 'reservation') {
                console.log('=== 🎯 Space 메뉴 페이지에서 예약 페이지로 이동 감지 (앞으로가기) ===');
                console.log('📍 예약 페이지로 이동합니다.');
                
                // 이미 예약 상태가 설정되어 있는지 확인
                if (!isReserving) {
                    console.log('⚠️ 예약 상태가 설정되지 않음 - 예약 상태 복원 시도');
                    // Zustand 스토어에서 이미 선택된 메뉴 정보 사용
                    const { selectedMenu } = useStore.getState();
                    if (selectedMenu) {
                        console.log('✅ Zustand 스토어에서 선택된 메뉴 정보 찾음:', selectedMenu);
                        startReservation(selectedMenu, null);
                    } else {
                        console.log('❌ Zustand 스토어에서 선택된 메뉴 정보를 찾을 수 없음');
                        console.log('🔄 localStorage에서 예약 상태 복원 시도...');
                        const restored = restoreReservationState();
                        if (!restored) {
                            console.log('❌ localStorage에서 예약 상태 복원 실패');
                            console.log('🔄 현재 페이지 메뉴 정보로 예약 상태 복원 시도...');
                            
                            // localStorage에 데이터가 없을 때 현재 페이지의 메뉴 정보를 활용해 복원
                            if (storeData && storeData.menus && storeData.menus.length > 0) {
                                console.log('📋 현재 페이지에 메뉴 정보가 있음');
                                console.log('📊 메뉴 개수:', storeData.menus.length);
                                
                                // 첫 번째 메뉴를 선택하여 예약 상태 복원
                                const firstMenu = storeData.menus[0];
                                console.log('🎯 첫 번째 메뉴로 예약 상태 복원:', firstMenu);
                                
                                // 예약 상태 설정
                                startReservation(firstMenu, null);
                                console.log('✅ 현재 페이지 메뉴로 예약 상태 복원 성공');
                            } else {
                                console.log('❌ 현재 페이지에도 메뉴 정보가 없음 - Space 메뉴 페이지로 리다이렉트');
                                setTimeout(() => {
                                    navigate(`/shop/${id}/space/${selectedSpaceId}`, { replace: true });
                                }, 100);
                            }
                        }
                    }
                } else {
                    console.log('✅ 이미 예약 상태가 설정되어 있음');
                }
            }
            
            // 단일 메뉴 페이지에서 예약 페이지로 이동한 경우 (앞으로가기)
            if (previousPathnameRef.current.includes('/menu') && urlState.type === 'reservation') {
                console.log('=== 🎯 단일 메뉴 페이지에서 예약 페이지로 이동 감지 (앞으로가기) ===');
                console.log('📍 예약 페이지로 이동합니다.');
                
                // 이미 예약 상태가 설정되어 있는지 확인
                if (!isReserving) {
                    console.log('⚠️ 예약 상태가 설정되지 않음 - 예약 상태 복원 시도');
                    // Zustand 스토어에서 이미 선택된 메뉴 정보 사용
                    const { selectedMenu } = useStore.getState();
                    if (selectedMenu) {
                        console.log('✅ Zustand 스토어에서 선택된 메뉴 정보 찾음:', selectedMenu);
                        startReservation(selectedMenu, null);
                    } else {
                        console.log('❌ Zustand 스토어에서 선택된 메뉴 정보를 찾을 수 없음');
                        console.log('🔄 localStorage에서 예약 상태 복원 시도...');
                        const restored = restoreReservationState();
                        if (!restored) {
                            console.log('❌ localStorage에서 예약 상태 복원 실패');
                            console.log('🔄 현재 페이지 메뉴 정보로 예약 상태 복원 시도...');
                            
                            // localStorage에 데이터가 없을 때 현재 페이지의 메뉴 정보를 활용해 복원
                            if (storeData && storeData.menus && storeData.menus.length > 0) {
                                console.log('📋 현재 페이지에 메뉴 정보가 있음');
                                console.log('📊 메뉴 개수:', storeData.menus.length);
                                
                                // 첫 번째 메뉴를 선택하여 예약 상태 복원
                                const firstMenu = storeData.menus[0];
                                console.log('🎯 첫 번째 메뉴로 예약 상태 복원:', firstMenu);
                                
                                // 예약 상태 설정
                                startReservation(firstMenu, null);
                                console.log('✅ 현재 페이지 메뉴로 예약 상태 복원 성공');
                            } else {
                                console.log('❌ 현재 페이지에도 메뉴 정보가 없음 - 단일 메뉴 페이지로 리다이렉트');
                                setTimeout(() => {
                                    navigate(`/shop/${id}/menu`, { replace: true });
                                }, 100);
                            }
                        }
                    }
                } else {
                    console.log('✅ 이미 예약 상태가 설정되어 있음');
                }
            }
            
            // 예약 페이지로 이동하는 경우 (앞으로가기)
            if (urlState.type === 'reservation') {
                console.log('🎯 예약 페이지로 이동 감지 (앞으로가기)');
                console.log('📋 현재 예약 상태:', {
                    isReserving,
                    selectedMenu: selectedMenu ? '있음' : '없음',
                    selectedMenu_item_id: selectedMenu?.item_id,
                    showPiAgreement,
                    storeData: storeData ? '있음' : '없음'
                });
                
                // 예약 상태가 없는데 예약 페이지로 이동하려는 경우
                if (!isReserving || !selectedMenu) {
                    console.log('⚠️ 경고: 예약 상태가 없는데 예약 페이지로 이동 시도');
                    console.log('🔄 예약 상태 복원 시도...');
                    
                    // localStorage에서 예약 상태 복원 시도
                    const restored = restoreReservationState();
                    if (restored) {
                        console.log('✅ 예약 상태 복원 성공');
                        console.log('📋 복원된 상태:', {
                            isReserving: useStore.getState().isReserving,
                            selectedMenu: useStore.getState().selectedMenu ? '있음' : '없음',
                            selectedMenu_item_id: useStore.getState().selectedMenu?.item_id
                        });
                        
                        // 복원 후 히스토리 상태 재추적
                        setTimeout(() => {
                            logHistoryState('예약 상태 복원 후');
                        }, 100);
                    } else {
                        console.log('❌ localStorage에서 예약 상태 복원 실패');
                        console.log('🔄 현재 페이지 메뉴 정보로 예약 상태 복원 시도...');
                        
                        // localStorage에 데이터가 없을 때 현재 페이지의 메뉴 정보를 활용해 복원
                        if (storeData && storeData.menus && storeData.menus.length > 0) {
                            console.log('📋 현재 페이지에 메뉴 정보가 있음');
                            console.log('📊 메뉴 개수:', storeData.menus.length);
                            
                            // 첫 번째 메뉴를 선택하여 예약 상태 복원
                            const firstMenu = storeData.menus[0];
                            console.log('🎯 첫 번째 메뉴로 예약 상태 복원:', firstMenu);
                            
                            // 예약 상태 설정
                            startReservation(firstMenu, null);
                            console.log('✅ 현재 페이지 메뉴로 예약 상태 복원 성공');
                            
                            // 복원 후 히스토리 상태 재추적
                            setTimeout(() => {
                                logHistoryState('현재 페이지 메뉴로 예약 상태 복원 후');
                            }, 100);
                        } else {
                            console.log('❌ 현재 페이지에도 메뉴 정보가 없음');
                            console.log('🔄 Space 목록으로 리다이렉트...');
                            
                            // 예약 상태 복원이 실패한 경우 Space 목록으로 리다이렉트
                            setTimeout(() => {
                                const storeId = urlState.storeId;
                                if (spaceCount >= 2) {
                                    navigate(`/shop/${storeId}/spaces`, { replace: true });
                                } else {
                                    navigate(`/shop/${storeId}/menu`, { replace: true });
                                }
                            }, 100);
                            return;
                        }
                    }
                } else {
                    console.log('✅ 예약 상태가 정상적으로 설정되어 있음');
                }
            }
            
            // 이전 URL 업데이트
            previousPathnameRef.current = location.pathname;
        }
    }, [location.pathname, navigate, isReserving, showPiAgreement, selectedSpaceId, cancelReservation, startReservation, storeData]);

    // storeData 디버깅을 위한 useEffect
    useEffect(() => {
        console.log('=== storeData 상태 변경 디버깅 ===');
        console.log('storeData:', storeData);
        console.log('storeData 타입:', typeof storeData);
        console.log('isReserving:', isReserving);
        console.log('showPiAgreement:', showPiAgreement);
        console.log('selectedSpaceId:', selectedSpaceId);
        console.log('현재 URL:', location.pathname);
        
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
    }, [storeData, spaceCount, selectedSpaceId, loading, error, isReserving, showPiAgreement, location.pathname]);

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
                console.log('현재 URL:', location.pathname);
                console.log('히스토리 길이:', window.history.length);
                console.log('히스토리 상태:', window.history.state);
                
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
                        // /shop/:id로 접근한 경우
                        console.log('=== Space가 1개인 경우: entry-point 상태 ===');
                        console.log('Space 개수:', spacesData.count);
                        console.log('현재 URL 상태:', urlState);
                        console.log('홈페이지로 이동 중인지 확인:', isNavigatingToHomeRef.current);
                        
                        // 홈페이지로 이동 중인지 확인
                        if (isNavigatingToHomeRef.current) {
                            console.log('홈페이지로 이동 중이므로 리다이렉트하지 않음');
                            isNavigatingToHomeRef.current = false; // 플래그 초기화
                            return;
                        }
                        
                        // 일반적인 entry-point 접근인 경우 /shop/:id/menu로 리다이렉트
                        console.log('일반적인 entry-point 접근: /shop/:id/menu로 리다이렉트');
                        console.log('리다이렉트 전 히스토리 길이:', window.history.length);
                        navigate(`/shop/${storeId}/menu`);
                        console.log('리다이렉트 후 히스토리 길이:', window.history.length);
                    } else if (urlState.type === 'single-space-menu') {
                        // /shop/:id/menu로 접근한 경우 - 정상 처리
                        console.log('=== Space가 1개인 경우: 바로 메뉴 조회 ===');
                        console.log('Space 개수:', spacesData.count);
                        console.log('현재 URL 상태:', urlState);
                        console.log('메뉴 조회 시작...');
                        try {
                            const menuData = await fetchStoreMenus(storeId, timeParam, accessToken);
                            console.log('메뉴 조회 결과:', menuData);
                            console.log('=== 메뉴 데이터 상세 분석 ===');
                            if (menuData) {
                                console.log('메뉴 데이터 키들:', Object.keys(menuData));
                                console.log('메뉴 개수:', menuData.menus?.length);
                                if (menuData.menus && menuData.menus.length > 0) {
                                    console.log('첫 번째 메뉴:', JSON.stringify(menuData.menus[0], null, 2));
                                }
                            }
                            setStoreData(menuData);
                        } catch (error) {
                            console.error('메뉴 조회 실패:', error);
                            setError(error.message || '메뉴 조회에 실패했습니다.');
                        }
                    } else if (urlState.type === 'reservation') {
                        // /shop/:id/reservation으로 접근한 경우 - 리다이렉트하지 않음
                        console.log('=== Space가 1개인 경우: 예약 페이지 상태 - 리다이렉트하지 않음 ===');
                        console.log('예약 페이지에서 리다이렉트하지 않고 현재 상태 유지');
                        // 예약 페이지에서는 리다이렉트하지 않고 현재 상태를 유지
                        // storeData가 이미 설정되어 있다면 그대로 사용
                        if (!storeData) {
                            console.log('storeData가 없으므로 메뉴 데이터 로드');
                            try {
                                const menuData = await fetchStoreMenus(storeId, timeParam, accessToken);
                                setStoreData(menuData);
                            } catch (error) {
                                console.error('예약 페이지 메뉴 조회 실패:', error);
                                setError(error.message || '메뉴 조회에 실패했습니다.');
                            }
                        }
                    } else {
                        // 다른 URL로 접근한 경우 - /shop/:id/menu로 리다이렉트
                        console.log('Space가 1개인 경우: 다른 URL에서 /shop/:id/menu로 리다이렉트');
                        console.log('현재 URL 상태:', urlState);
                        navigate(`/shop/${storeId}/menu`);
                    }
                } else if (spacesData.count >= 2) {
                    // Space가 2개 이상인 경우
                    if (urlState.type === 'entry-point') {
                        // /shop/:id로 접근한 경우
                        console.log('=== entry-point 상태: Space 개수에 따른 리다이렉트 ===');
                        
                        // 홈페이지로 이동 중인지 확인
                        if (isNavigatingToHomeRef.current) {
                            console.log('홈페이지로 이동 중이므로 리다이렉트하지 않음');
                            isNavigatingToHomeRef.current = false; // 플래그 초기화
                            return;
                        }
                        
                        // 일반적인 entry-point 접근인 경우 /shop/:id/spaces로 리다이렉트
                        console.log('일반적인 entry-point 접근: /shop/:id/spaces로 리다이렉트');
                        console.log('리다이렉트 전 히스토리 길이:', window.history.length);
                        navigate(`/shop/${storeId}/spaces`);
                        console.log('리다이렉트 후 히스토리 길이:', window.history.length);
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
                        console.log('요청할 spaceId:', urlState.spaceId);
                        console.log('요청할 spaceId 타입:', typeof urlState.spaceId);
                        console.log('요청할 timeParam:', timeParam);
                        console.log('요청할 accessToken 존재:', !!accessToken);
                        console.log('fetchSpaceDetails API 호출 시작...');
                        
                        const spaceData = await fetchSpaceDetails(urlState.spaceId, timeParam, accessToken);
                        console.log('=== fetchSpaceDetails API 응답 분석 ===');
                        console.log('API 응답 전체:', spaceData);
                        console.log('API 응답 타입:', typeof spaceData);
                        console.log('API 응답 키들:', spaceData ? Object.keys(spaceData) : 'null');
                        
                        if (spaceData) {
                            console.log('=== Space 데이터 상세 분석 ===');
                            console.log('Space 이름:', spaceData.space_name);
                            console.log('Space ID:', spaceData.space_id);
                            console.log('가게 이름:', spaceData.store_name);
                            console.log('메뉴 개수:', spaceData.menus?.length);
                            
                            if (spaceData.menus && spaceData.menus.length > 0) {
                                console.log('=== 메뉴 데이터 상세 분석 ===');
                                spaceData.menus.forEach((menu, index) => {
                                    console.log(`메뉴 ${index + 1}:`, {
                                        menu_id: menu.menu_id,
                                        menu_name: menu.menu_name,
                                        item_id: menu.item_id,
                                        discount_rate: menu.discount_rate,
                                        is_available: menu.is_available,
                                        space_id: menu.space_id
                                    });
                                });
                            } else {
                                console.log('메뉴 데이터가 없음');
                            }
                        }
                        
                        console.log('setStoreData 호출 시작');
                        setStoreData(spaceData);
                        console.log('setStoreData 호출 완료');
                        
                        console.log('setSelectedSpaceId 호출 시작');
                        setSelectedSpaceId(urlState.spaceId);
                        console.log('setSelectedSpaceId 호출 완료');
                        console.log('설정된 selectedSpaceId:', urlState.spaceId);
                    } else if (urlState.type === 'reservation') {
                        // /shop/:id/reservation으로 접근한 경우 - 리다이렉트하지 않음
                        console.log('=== 예약 페이지 상태: 리다이렉트하지 않음 ===');
                        
                        // 새로고침으로 인한 상태 초기화 확인
                        if (!isReserving) {
                            console.log('=== 예약 페이지 새로고침 감지 - 상태 복원 시도 ===');
                            console.log('새로고침으로 인해 예약 상태가 초기화됨');
                            
                            // localStorage에서 예약 상태 복원 시도
                            const restored = restoreReservationState();
                            if (restored) {
                                console.log('예약 상태 복원 성공 - 예약 페이지에 유지');
                                return;
                            } else {
                                console.log('예약 상태 복원 실패 - Space 목록으로 리다이렉트');
                                // 예약 상태 복원이 실패한 경우 Space 목록으로 리다이렉트
                                setTimeout(() => {
                                    navigate(`/shop/${storeId}/spaces`, { replace: true });
                                }, 100);
                                return;
                            }
                        }
                        
                        // 예약 상태가 있는 경우 정상 처리
                        console.log('예약 상태가 있으므로 정상 처리');
                    } else {
                        // 다른 URL로 접근한 경우 - /shop/:id/spaces로 리다이렉트
                        console.log('Space가 2개 이상인 경우: 다른 URL에서 /shop/:id/spaces로 리다이렉트');
                        navigate(`/shop/${storeId}/spaces`);
                    }
                }
                
                console.log('=== ShopDetailPage 데이터 로드 완료 ===');
                console.log('최종 spaceCount:', spacesData.count);
                console.log('최종 storeData 설정됨');
                console.log('최종 히스토리 길이:', window.history.length);
                
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
        console.log('=== handleSpaceSelect 함수 호출 ===');
        console.log('입력받은 spaceId:', spaceId);
        console.log('spaceId 타입:', typeof spaceId);
        console.log('현재 URL:', location.pathname);
        console.log('현재 selectedSpaceId:', selectedSpaceId);
        console.log('현재 storeData:', storeData);
        console.log('현재 storeData 타입:', typeof storeData);
        console.log('현재 storeData 키들:', storeData ? Object.keys(storeData) : 'null');
        
        // 이동할 URL 생성
        const targetUrl = `/shop/${id}/space/${spaceId}`;
        console.log('이동할 URL:', targetUrl);
        console.log('현재 URL과 비교:', location.pathname === targetUrl ? '동일' : '다름');
        
        // URL 변경으로 Space 선택
        console.log('navigate 호출 시작');
        navigate(targetUrl);
        console.log('navigate 호출 완료');
        console.log('=== handleSpaceSelect 함수 종료 ===');
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
        console.log('히스토리 길이:', window.history.length);
        console.log('히스토리 상태:', window.history.state);
        console.log('현재 시간:', new Date().toISOString());
        
        if (showPiAgreement) {
            console.log('개인정보 동의서 숨김 처리');
            togglePiAgreement(); // 동의서 숨김
        } else if (isReserving) {
            // 예약 페이지에서 뒤로가기: 선택된 Space의 메뉴 페이지로
            console.log('예약 페이지에서 뒤로가기 처리');
            console.log('예약 상태 초기화 전 isReserving:', isReserving);
            cancelReservation(); // 예약 상태 초기화
            console.log('예약 상태 초기화 후 isReserving:', isReserving);
            
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
            console.log('이동 전 히스토리 길이:', window.history.length);
            navigate('/');
            console.log('이동 후 히스토리 길이:', window.history.length);
        } else if (spaceCount === 1) {
            // 단일 Space 메뉴 페이지에서 뒤로가기: 홈페이지로
            console.log('단일 Space 메뉴 페이지에서 홈페이지로 뒤로가기');
            navigate('/');
        } else {
            // 기본: 브라우저 히스토리 뒤로가기
            console.log('기본 브라우저 히스토리 뒤로가기');
            console.log('이동 전 히스토리 길이:', window.history.length);
            navigate(-1);
            console.log('이동 후 히스토리 길이:', window.history.length);
        }
        
        console.log('=== handleBack 함수 실행 완료 ===');
    };

    // 예약 버튼 클릭 시
    const handleReserve = (menu) => {
        console.log('=== 메뉴 선택 디버깅 ===');
        console.log('선택된 메뉴 객체:', menu);
        console.log('menu 타입:', typeof menu);
        console.log('menu 구조:', JSON.stringify(menu, null, 2));
        console.log('item_id 존재 여부:', !!menu?.item_id);
        console.log('item_id 값:', menu?.item_id);
        console.log('메뉴 ID:', menu?.menu_id);
        console.log('메뉴 이름:', menu?.menu_name);
        console.log('Space 개수:', spaceCount);
        console.log('선택된 Space ID:', selectedSpaceId);
        console.log('예약 상태 설정 전 isReserving:', isReserving);
        console.log('현재 URL:', location.pathname);
        console.log('현재 storeData:', storeData);
        console.log('storeData 타입:', typeof storeData);
        console.log('storeData 키들:', storeData ? Object.keys(storeData) : 'null');
        console.log('현재 URL 상태:', getShopDetailStateFromUrl());
        
        // 단일 메뉴 페이지에서 예약하기 버튼 클릭 확인
        if (spaceCount === 1) {
            console.log('=== 단일 메뉴 페이지에서 예약하기 버튼 클릭 ===');
            console.log('단일 메뉴 페이지에서 예약 시도');
            console.log('현재 URL 상태:', getShopDetailStateFromUrl());
        }
        
        // Space가 2개 이상인 경우
        if (spaceCount >= 2) {
            console.log('=== Space 목록에서 예약하기 버튼 클릭 ===');
            console.log('Space 목록에서 예약 시도');
            console.log('현재 URL 상태:', getShopDetailStateFromUrl());
        }
        
        console.log('startReservation 호출 전 상태');
        startReservation(menu, null);
        console.log('startReservation 호출 완료');
        console.log('예약 상태 설정 후 isReserving:', isReserving);
        
        // 예약 페이지로 URL 변경
        console.log('예약 페이지로 네비게이션 시작');
        console.log('네비게이션 전 URL:', location.pathname);
        console.log('네비게이션할 URL:', `/shop/${id}/reservation`);
        navigate(`/shop/${id}/reservation`);
        console.log('예약 페이지로 네비게이션 완료');
        console.log('네비게이션 후 URL:', location.pathname);
        console.log('=== 메뉴 선택 디버깅 종료 ===');
    };

    // 새로고침 시 예약 페이지 상태 복원을 위한 디버깅
    useEffect(() => {
        console.log('=== 새로고침 시 예약 페이지 상태 디버깅 ===');
        console.log('현재 URL:', location.pathname);
        console.log('URL에 /reservation 포함 여부:', location.pathname.includes('/reservation'));
        console.log('현재 isReserving 상태:', isReserving);
        console.log('현재 showPiAgreement 상태:', showPiAgreement);
        console.log('현재 selectedSpaceId:', selectedSpaceId);
        console.log('현재 storeData:', storeData);
        console.log('현재 spaceCount:', spaceCount);
        console.log('현재 loading:', loading);
        console.log('현재 error:', error);
        console.log('현재 id:', id);
        console.log('현재 time:', time);
        console.log('현재 accessToken 존재:', !!accessToken);
        
        // 예약 페이지에서 새로고침된 경우
        if (location.pathname.includes('/reservation')) {
            console.log('=== 예약 페이지 새로고침 감지 ===');
            console.log('예약 페이지 URL에서 새로고침됨');
            console.log('isReserving 상태:', isReserving);
            
            // 예약 상태가 없는데 예약 페이지에 있는 경우
            if (!isReserving) {
                console.log('경고: 예약 상태가 없는데 예약 페이지에 있음');
                console.log('이 경우 undefined 에러가 발생할 수 있음');
            }
            
            // storeData가 없는데 예약 페이지에 있는 경우
            if (!storeData) {
                console.log('경고: storeData가 없는데 예약 페이지에 있음');
                console.log('이 경우 undefined 에러가 발생할 수 있음');
            }
        }
    }, [location.pathname, isReserving, showPiAgreement, selectedSpaceId, storeData, spaceCount, loading, error, id, time, accessToken]);


    // Space 선택 (디자이너 선택과 동일한 역할)
    const handleSelectSpace = (spaceId) => {
        console.log('=== handleSelectSpace 함수 호출 ===');
        console.log('입력받은 spaceId:', spaceId);
        console.log('spaceId 타입:', typeof spaceId);
        console.log('현재 URL:', location.pathname);
        console.log('현재 selectedSpaceId:', selectedSpaceId);
        console.log('현재 storeData:', storeData);
        console.log('현재 spaceCount:', spaceCount);
        
        // Space 목록에서 해당 Space 정보 확인
        if (storeData && storeData.spaces) {
            const selectedSpace = storeData.spaces.find(space => space.space_id === parseInt(spaceId));
            console.log('=== 선택된 Space 정보 ===');
            console.log('찾은 Space:', selectedSpace);
            console.log('Space 이름:', selectedSpace?.space_name);
            console.log('Space ID:', selectedSpace?.space_id);
            console.log('Space 이미지:', selectedSpace?.space_image_url);
            console.log('Space 최대 할인율:', selectedSpace?.max_discount_rate);
            console.log('Space 예약 가능 여부:', selectedSpace?.is_possible);
            
            // Space의 메뉴 정보 확인 (있다면)
            if (selectedSpace?.menus) {
                console.log('=== Space의 메뉴 정보 ===');
                console.log('메뉴 개수:', selectedSpace.menus.length);
                selectedSpace.menus.forEach((menu, index) => {
                    console.log(`메뉴 ${index + 1}:`, {
                        menu_id: menu.menu_id,
                        menu_name: menu.menu_name,
                        item_id: menu.item_id,
                        discount_rate: menu.discount_rate,
                        is_available: menu.is_available
                    });
                });
            } else {
                console.log('Space에 메뉴 정보가 없음 (API에서 별도 조회 필요)');
            }
        } else {
            console.log('storeData 또는 spaces가 없음');
        }
        
        // 모든 Space 정보 출력 (비교용)
        if (storeData && storeData.spaces) {
            console.log('=== 모든 Space 정보 비교 ===');
            storeData.spaces.forEach((space, index) => {
                console.log(`Space ${index + 1}:`, {
                    space_id: space.space_id,
                    space_name: space.space_name,
                    menus_count: space.menus?.length || 0,
                    menus: space.menus?.map(menu => ({
                        menu_id: menu.menu_id,
                        menu_name: menu.menu_name,
                        item_id: menu.item_id
                    })) || []
                });
            });
        }
        
        console.log('handleSpaceSelect 호출 시작');
        handleSpaceSelect(spaceId);
        console.log('handleSpaceSelect 호출 완료');
        console.log('=== handleSelectSpace 함수 종료 ===');
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
    <Layout currentpage="shop-detail">
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
    
            <ScrollContainer offsettop={72}>
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
                                    walkTime={storeData?.on_foot}
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
                                console.log('=== Space 상세 화면 렌더링 ===');
                                console.log('selectedSpaceId:', selectedSpaceId);
                                console.log('selectedSpaceId 타입:', typeof selectedSpaceId);
                                console.log('storeData:', storeData);
                                console.log('storeData 타입:', typeof storeData);
                                console.log('storeData 키들:', storeData ? Object.keys(storeData) : 'null');
                                console.log('storeData.menus:', storeData?.menus);
                                console.log('storeData.menus 타입:', typeof storeData?.menus);
                                console.log('storeData.menus 길이:', storeData?.menus?.length);
                                
                                // Space 정보 확인
                                console.log('=== Space 정보 확인 ===');
                                console.log('Space 이름:', storeData?.space_name);
                                console.log('Space ID:', storeData?.space_id);
                                console.log('가게 이름:', storeData?.store_name);
                                
                                const featuredMenu = getFeaturedMenu();
                                const otherMenus = getOtherMenus();
                                
                                console.log('=== 메뉴 데이터 확인 ===');
                                console.log('featuredMenu:', featuredMenu);
                                console.log('featuredMenu 타입:', typeof featuredMenu);
                                console.log('otherMenus:', otherMenus);
                                console.log('otherMenus 타입:', typeof otherMenus);
                                console.log('otherMenus 길이:', otherMenus?.length);
                                
                                // 각 메뉴의 space_id 확인
                                if (storeData?.menus) {
                                    console.log('=== 각 메뉴의 space_id 확인 ===');
                                    storeData.menus.forEach((menu, index) => {
                                        console.log(`메뉴 ${index + 1}:`, {
                                            menu_id: menu.menu_id,
                                            menu_name: menu.menu_name,
                                            space_id: menu.space_id,
                                            selectedSpaceId: selectedSpaceId,
                                            space_id_match: menu.space_id === parseInt(selectedSpaceId)
                                        });
                                    });
                                }
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
            </ScrollContainer>
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
    height: 100%;
    max-height: 100vh;
    background: #fff;
`;

/* 네브 바 영역 */
const NavBarContainer = styled.div`
`;

/* 콘텐츠 영역 (스크롤 가능) */
const ContentContainer = styled.div`
    overflow-y: visible;
    position: relative;
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