/**
 * 예약 페이지 컴포넌트
 * 선택된 메뉴와 가게 정보, 개인정보 제3자 동의 체크박스를 표시
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import useStore from '../hooks/store/useStore';
import useUserInfo from '../hooks/user/useUserInfo';
import ShopInfo from '../components/sections/shop-detail/ShopInfo/ShopInfo';
import MenuCard from '../components/sections/shop-detail/MenuCard/MenuCard';
import PiAgreement from '../components/sections/shop-detail/PiAgreement/PiAgreement';
import { ReactComponent as ArrowButton } from '../assets/images/piArrow.svg';
import Line from '../components/ui/Line/Line';
import Spinner from '../components/ui/Spinner/Spinner';
import { fetchMenuItemDetails, createReservation } from '../apis/storeAPI';

const ReservationPage = ({ shop }) => {
  const navigate = useNavigate();
  
  const { 
    selectedMenu, 
    selectedDesigner, 
    currentTime, 
    cancelReservation, 
    togglePiAgreement, 
    showPiAgreement, 
    setCurrentPage,
    time
  } = useStore();

  const { accessToken } = useUserInfo();
  const storeData = shop;

  // 상태 관리
  const [menuData, setMenuData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reserving, setReserving] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);

  // menuData 디버깅을 위한 useEffect
  useEffect(() => {
    console.log('=== menuData 상태 변경 디버깅 ===');
    console.log('menuData:', menuData);
    console.log('menuData 타입:', typeof menuData);
    
    if (menuData) {
      console.log('=== menuData 상세 분석 ===');
      console.log('전체 menuData 객체:', JSON.stringify(menuData, null, 2));
      console.log('menuData 키들:', Object.keys(menuData));
      
      // 메뉴 기본 정보
      console.log('메뉴 ID:', menuData.menu_id);
      console.log('메뉴 이름:', menuData.menu_name);
      console.log('아이템 ID:', menuData.item_id);
      console.log('메뉴 이미지:', menuData.menu_image_url);
      
      // 가격 정보
      console.log('할인율:', menuData.discount_rate);
      console.log('원래 가격:', menuData.menu_price);
      console.log('할인 가격:', menuData.discounted_price);
      
      // 예약 관련 정보
      console.log('예약 가능 여부:', menuData.is_available);
      console.log('선택된 시간:', menuData.selected_time);
      
      // 가게 정보
      console.log('가게 ID:', menuData.store_id);
      console.log('가게 이름:', menuData.store_name);
      console.log('가게 주소:', menuData.store_address);
      console.log('거리:', menuData.distance);
      
      // Space 정보 (있다면)
      if (menuData.space_id) {
        console.log('=== Space 정보 ===');
        console.log('Space ID:', menuData.space_id);
        console.log('Space 이름:', menuData.space_name);
        console.log('Space 이미지:', menuData.space_image_url);
      }
      
      console.log('=== 현재 상태 ===');
      console.log('loading:', loading);
      console.log('error:', error);
      console.log('reserving:', reserving);
      console.log('isAgreed:', isAgreed);
      console.log('---');
    } else {
      console.log('menuData가 null입니다.');
    }
  }, [menuData, loading, error, reserving, isAgreed]);

  // 메뉴 상세 데이터 로드
  useEffect(() => {
    const loadMenuData = async () => {
      try {
        setLoading(true);
        
        console.log('=== 🎯 ReservationPage 디버깅 ===');
        console.log('📋 selectedMenu:', selectedMenu);
        console.log('🔍 selectedMenu.item_id:', selectedMenu?.item_id);
        console.log('📊 selectedMenu 구조:', JSON.stringify(selectedMenu, null, 2));
        console.log('🔑 accessToken 존재:', !!accessToken);
        console.log('📍 현재 URL:', window.location.href);
        console.log('🕐 현재 시간:', new Date().toISOString());
        
        // 새로고침 시 undefined 에러 확인을 위한 추가 디버깅
        console.log('=== 🔄 새로고침 시 undefined 에러 확인 ===');
        console.log('📍 현재 URL:', window.location.href);
        console.log('🔍 URL에 /reservation 포함 여부:', window.location.href.includes('/reservation'));
        console.log('📋 selectedMenu 존재 여부:', !!selectedMenu);
        console.log('📊 selectedMenu 타입:', typeof selectedMenu);
        console.log('❓ selectedMenu === null:', selectedMenu === null);
        console.log('❓ selectedMenu === undefined:', selectedMenu === undefined);
        console.log('🔍 selectedMenu?.item_id 존재 여부:', !!selectedMenu?.item_id);
        console.log('📊 selectedMenu?.item_id 타입:', typeof selectedMenu?.item_id);
        console.log('🔑 accessToken 타입:', typeof accessToken);
        console.log('📏 accessToken 길이:', accessToken?.length);
        
        // 새로고침으로 인한 상태 초기화 확인
        if (!selectedMenu) {
          console.log('⚠️ 경고: selectedMenu가 없음 - 새로고침으로 인한 상태 초기화 가능성');
          console.log('🔄 예약 상태 복원 시도...');
          
          // localStorage에서 예약 상태 복원 시도
          const { restoreReservationState } = useStore.getState();
          const restored = restoreReservationState();
          
          if (restored) {
            console.log('✅ 예약 상태 복원 성공');
            console.log('📋 복원된 selectedMenu:', useStore.getState().selectedMenu);
            console.log('🔍 복원된 selectedMenu.item_id:', useStore.getState().selectedMenu?.item_id);
            
            // 복원된 메뉴 정보로 다시 API 호출
            const restoredMenu = useStore.getState().selectedMenu;
            if (restoredMenu && restoredMenu.item_id) {
              console.log('🔄 복원된 메뉴 정보로 API 재호출');
              const data = await fetchMenuItemDetails(restoredMenu.item_id, accessToken);
              setMenuData(data);
              return;
            }
          } else {
            console.log('❌ localStorage에서 예약 상태 복원 실패');
            console.log('🔄 현재 페이지 메뉴 정보로 예약 상태 복원 시도...');
            
            // localStorage에 데이터가 없을 때 현재 페이지의 메뉴 정보를 활용해 복원
            // 이 경우 ShopDetailPage에서 이미 예약 상태가 복원되어 있을 수 있음
            const currentSelectedMenu = useStore.getState().selectedMenu;
            if (currentSelectedMenu && currentSelectedMenu.item_id) {
              console.log('✅ 현재 Zustand 스토어에서 메뉴 정보 찾음:', currentSelectedMenu);
              console.log('🔄 현재 메뉴 정보로 API 호출');
              const data = await fetchMenuItemDetails(currentSelectedMenu.item_id, accessToken);
              setMenuData(data);
              return;
            } else {
              console.log('❌ 현재 Zustand 스토어에도 메뉴 정보가 없음');
              console.log('🔄 홈페이지로 리다이렉트...');
              navigate('/', { replace: true });
              return;
            }
          }
          
          console.log('현재 페이지 상태:');
          console.log('- loading:', loading);
          console.log('- error:', error);
          console.log('- reserving:', reserving);
          console.log('- isAgreed:', isAgreed);
          console.log('- menuData:', menuData);
        }
        
        if (!selectedMenu || !selectedMenu.item_id) {
          console.log('❌ 에러: 메뉴 정보가 없어서 예약 페이지를 표시할 수 없음');
          console.log('🔄 새로고침으로 인한 상태 초기화로 추정됨');
          throw new Error('메뉴 정보가 없습니다.');
        }

        console.log('🎯 ReservationPage: 메뉴 상세 데이터 로드 시작', { itemId: selectedMenu.item_id });
        
        const data = await fetchMenuItemDetails(selectedMenu.item_id, accessToken);
        console.log('✅ 메뉴 상세 데이터 로드 성공:', data);
        setMenuData(data);
        
      } catch (error) {
        console.error('❌ ReservationPage: 메뉴 상세 데이터 로드 실패', error);
        console.log('=== 🚨 에러 상세 정보 ===');
        console.log('📊 에러 타입:', typeof error);
        console.log('📝 에러 메시지:', error.message);
        console.log('📚 에러 스택:', error.stack);
        console.log('📈 에러 상태:', error.status);
        console.log('📋 에러 응답:', error.response);
        setError(error);
        
        // 401 에러 시 로그인 페이지로 이동
        if (error.status === 401) {
          console.log('🔐 401 에러 감지 - 로그인 페이지로 이동');
          setCurrentPage('login');
        }
      } finally {
        setLoading(false);
        console.log('✅ ReservationPage 로딩 완료');
      }
    };

    if (selectedMenu && accessToken) {
      console.log('✅ 조건 충족 - loadMenuData 실행');
      loadMenuData();
    } else {
      console.log('=== ⚠️ ReservationPage 조건부 로딩 ===');
      console.log('📋 selectedMenu 존재:', !!selectedMenu);
      console.log('🔑 accessToken 존재:', !!accessToken);
      console.log('❌ 조건 미충족으로 loadMenuData 실행 안됨');
      
      // 새로고침 시 상태가 초기화된 경우
      if (!selectedMenu && window.location.href.includes('/reservation')) {
        console.log('⚠️ 경고: 예약 페이지에서 새로고침했지만 selectedMenu가 없음');
        console.log('🔄 예약 상태 복원 시도...');
        
        const { restoreReservationState } = useStore.getState();
        const restored = restoreReservationState();
        
        if (restored) {
          console.log('✅ 예약 상태 복원 성공 - loadMenuData 재실행');
          // 복원된 상태로 다시 loadMenuData 실행
          setTimeout(() => {
            const restoredMenu = useStore.getState().selectedMenu;
            if (restoredMenu && accessToken) {
              loadMenuData();
            }
          }, 100);
        } else {
          console.log('❌ 예약 상태 복원 실패 - 현재 Zustand 스토어 상태 확인');
          console.log('🔄 현재 Zustand 스토어에서 메뉴 정보 확인...');
          
          // localStorage 복원이 실패했지만 Zustand 스토어에 메뉴 정보가 있을 수 있음
          const currentSelectedMenu = useStore.getState().selectedMenu;
          if (currentSelectedMenu && currentSelectedMenu.item_id && accessToken) {
            console.log('✅ 현재 Zustand 스토어에서 메뉴 정보 찾음:', currentSelectedMenu);
            console.log('🔄 현재 메뉴 정보로 loadMenuData 실행');
            loadMenuData();
          } else {
            console.log('❌ 현재 Zustand 스토어에도 메뉴 정보가 없음 - 홈페이지로 리다이렉트');
            console.log('🔄 홈페이지로 리다이렉트...');
            navigate('/', { replace: true });
          }
        }
      }
    }
  }, [selectedMenu, accessToken, setCurrentPage, navigate]);

  // 예약 확인 핸들러
  const handleConfirm = async () => {
    if (!isAgreed || !menuData) return;
    
    try {
      setReserving(true);
      setError(null);
      
      console.log('=== 예약 요청 전 데이터 확인 ===');
      console.log('menuData:', menuData);
      console.log('item_id:', menuData.item_id);
      console.log('accessToken 존재:', !!accessToken);
      console.log('accessToken 길이:', accessToken?.length);
      console.log('isAgreed:', isAgreed);
      console.log('현재 시간:', new Date().toISOString());
      
      // 시간 관련 정보 추가
    //  const { time } = useStore.getState();
      console.log('=== 시간 관련 정보 ===');
      console.log('선택된 시간:', time);
      console.log('현재 시간 (시):', new Date().getHours());
      console.log('현재 시간 (분):', new Date().getMinutes());
      console.log('현재 시간 (전체):', new Date().toLocaleString('ko-KR'));
      
      console.log('예약 생성 시작', { itemId: menuData.item_id });
      
      const reservationResult = await createReservation(menuData.item_id, accessToken);
      console.log('예약 생성 성공:', reservationResult);
      
      console.log('=== 예약 완료 후 리다이렉트 과정 시작 ===');
      
      // 예약 완료 데이터를 localStorage에 저장 (SchedulePage에서 바텀시트로 표시)
      localStorage.setItem('completedReservation', JSON.stringify(reservationResult));
      console.log('localStorage에 예약 완료 데이터 저장됨');
      
      // 예약 상태 초기화
      console.log('예약 상태 초기화 시작');
      cancelReservation();
      console.log('예약 상태 초기화 완료');
      
      // SchedulePage로 직접 이동
      console.log('navigate("/history") 호출 시작');
      navigate('/history');
      console.log('navigate("/history") 호출 완료');
      
      console.log('=== 예약 완료 후 리다이렉트 과정 완료 ===');
      
    } catch (error) {
      console.log('예약 생성 실패:', error);
      // storeAPI에서 throw한 에러 객체를 그대로 상태에 저장
      setError(error);
    } finally {
      setReserving(false);
    }
  };

  // 체크박스 변경 핸들러
  const handleCheckboxChange = (e) => {
    setIsAgreed(e.target.checked);
  };

  // 화살표 버튼 클릭 핸들러
  const handleArrowClick = () => {
    togglePiAgreement();
  };

  const getErrorMessage = (error) => {
    if (!error) return "에러 상태가 없습니다.";

    // 1. 가장 가능성 있는 경로에서 에러 메시지를 우선 추출
    let message = error?.serverResponse?.error || error?.response?.data?.error;

    // 2. 만약 message가 string 타입이고, JSON 형태('{...}')라면 파싱을 시도
    if (typeof message === 'string' && message.trim().startsWith('{')) {
      try {
        const parsedMessage = JSON.parse(message);
        // 파싱에 성공하면 진짜 에러 메시지를 사용
        message = parsedMessage.error || message;
      } catch (e) {
        // 파싱에 실패하면 그냥 기존 메시지를 그대로 사용
      }
    }
    
    // 3. 최종 메시지가 없으면 기본 에러 메시지를 반환
    return message || "알 수 없는 오류가 발생했습니다.";
  };

  // 가게 이름 (/ 디자이너)
  const getShopName = () => {
    if (menuData) {
      return menuData.store_name;
    }
    return selectedDesigner ? `${selectedDesigner.name}` : '가게 정보 없음';
  };

  // 로딩 중이거나 에러 상태 처리
  if (loading) {
    return (
      <ReservationContainer>
        <LoadingContainer>
          <Spinner />
        </LoadingContainer>
      </ReservationContainer>
    );
  }

  console.log("렌더링 시점 error 상태:", error);
  console.log("getErrorMessage 결과:", getErrorMessage(error));

  if (error) {
    return (
      <ReservationContainer>
        <ErrorContainer>
          <ErrorText>{getErrorMessage(error)}</ErrorText>
          <BackButton onClick={cancelReservation}>뒤로가기</BackButton>
        </ErrorContainer>
      </ReservationContainer>
    );
  }

  return (
    <ReservationContainer>
      {showPiAgreement ? (
        <PiAgreementContainer>
          <SectionTitle>개인정보 제3자 제공 동의서</SectionTitle>
          <PiAgreement />
          <CloseButton onClick={togglePiAgreement}>닫기</CloseButton>
        </PiAgreementContainer>
      ) : (
        <>
          <SectionTitle>아래 내용이 맞는지 꼼꼼히 확인해주세요</SectionTitle>
          <Line />
          <ShopInfo
            name={getShopName()}
            address={menuData?.store_address || '주소 정보 없음'}
            distance={`${menuData?.distance || 0}m`}
            reservationTime={`${time} 예약`}
          />
          <Line />
          {menuData && (
            <MenuCardDiv>
                <MenuCard
                  menu={{
                    name: menuData.menu_name,
                    discountRate: menuData.discount_rate,
                    originalPrice: menuData.menu_price,
                    discountPrice: menuData.discounted_price,
                    isReserved: false,
                    menuImage: menuData.menu_image_url,
                  }}
                  onReserve={() => {}}
                />
            </MenuCardDiv>
          )}
          <Line />
          <CheckboxContainer>
            <CheckboxWrapper>
              <Checkbox
                id="pi-agree-checkbox"
                type="checkbox"
                checked={isAgreed}
                onChange={handleCheckboxChange}
              />
              <CheckboxLabel htmlFor="pi-agree-checkbox">개인정보 제3자 제공 동의</CheckboxLabel>
            </CheckboxWrapper>
            <ArrowIcon onClick={handleArrowClick}>
                <ArrowButton />
            </ArrowIcon>
          </CheckboxContainer>
          <Line />
          <ReserveButton 
            disabled={!isAgreed || reserving} 
            onClick={handleConfirm}
          >
            {reserving ? '예약 중...' : '예약하기'}
          </ReserveButton>
          <NoticeText>
            방문 시간 30분 전부터는 예약을 취소할 수 없습니다
          </NoticeText>
        </>
      )}
    </ReservationContainer>
  );
};

export default ReservationPage;

// ===== Styled Components ===== //

const ReservationContainer = styled.div`
  margin-top: 1.5rem;
  padding: 0px 16px;
  background: #fff;
  display: flex;
  flex-direction: column;
`;

const PiAgreementContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 700;
  color: #000;
//  text-align: center;
  padding-left: 20px;
  margin-bottom: 16px;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0px 32px;
  height: 70px;
`;

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  user-select: none;
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
`;

const CheckboxLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: rgba(0,0,0,0.45);
`;

const ArrowIcon = styled.div`
  cursor: pointer;
  line-height: 1;
`;

const ReserveButton = styled.button`
  background: ${props => props.disabled ? "#737373" : "#da2538"};
  color: #fff;
  border: none;
  width: 260px;
  height: 56px;
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 400;
  cursor: ${props => props.disabled ? "not-allowed" : "pointer"};
  margin-top: 32px;
  align-self: center;
`;

const CloseButton = styled.button`
  background: #fff;
  color: #0B0C0F;
  border: 1px solid #E2E4E9;
  width: 260px;
  height: 56px;
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  align-self: center;
  margin-top: 20px;
`;

const MenuCardDiv = styled.div`
  padding: 16px 16px 4px 16px ;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

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
  margin-bottom: 16px;
`;

const BackButton = styled.button`
  background: #DA2538;
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
`;

const NoticeText = styled.div`
  margin-top: 24px;
  color: #da2538;
  font-size: 14px;
  text-align: center;
  font-weight: 600;
`;