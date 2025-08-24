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

const ReservationPage = () => {
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

  // 상태 관리
  const [menuData, setMenuData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reserving, setReserving] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);

  // 메뉴 상세 데이터 로드
  useEffect(() => {
    const loadMenuData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 새로고침으로 인한 상태 초기화 확인
        if (!selectedMenu) {
          // localStorage에서 예약 상태 복원 시도
          const { restoreReservationState } = useStore.getState();
          const restored = restoreReservationState();
          
          if (restored) {
            // 복원된 메뉴 정보로 다시 API 호출
            const restoredMenu = useStore.getState().selectedMenu;
            if (restoredMenu && restoredMenu.item_id) {
              const data = await fetchMenuItemDetails(restoredMenu.item_id, accessToken);
              setMenuData(data);
              return;
            }
          } else {
            // localStorage에 데이터가 없을 때 현재 페이지의 메뉴 정보를 활용해 복원
            // 이 경우 ShopDetailPage에서 이미 예약 상태가 복원되어 있을 수 있음
            const currentSelectedMenu = useStore.getState().selectedMenu;
            if (currentSelectedMenu && currentSelectedMenu.item_id) {
              const data = await fetchMenuItemDetails(currentSelectedMenu.item_id, accessToken);
              setMenuData(data);
              return;
            } else {
              navigate('/', { replace: true });
              return;
            }
          }
        }
        
        if (!selectedMenu || !selectedMenu.item_id) {
          throw new Error('메뉴 정보가 없습니다.');
        }
        
        const data = await fetchMenuItemDetails(selectedMenu.item_id, accessToken);
        setMenuData(data);
        
      } catch (error) {
        setError(error);
        
        // 401 에러 시 로그인 페이지로 이동
        if (error.status === 401) {
          setCurrentPage('login');
        }
      } finally {
        setLoading(false);
      }
    };

    if (selectedMenu && accessToken) {
      loadMenuData();
    } else {
      
      // 새로고침 시 상태가 초기화된 경우
      if (!selectedMenu && window.location.href.includes('/reservation')) {
        const { restoreReservationState } = useStore.getState();
        const restored = restoreReservationState();
        
        if (restored) {
          // 복원된 상태로 다시 loadMenuData 실행
          setTimeout(() => {
            const restoredMenu = useStore.getState().selectedMenu;
            if (restoredMenu && accessToken) {
              loadMenuData();
            }
          }, 100);
        } else {
          // localStorage 복원이 실패했지만 Zustand 스토어에 메뉴 정보가 있을 수 있음
          const currentSelectedMenu = useStore.getState().selectedMenu;
          if (currentSelectedMenu && currentSelectedMenu.item_id && accessToken) {
            loadMenuData();
          } else {
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
      
      const reservationResult = await createReservation(menuData.item_id, accessToken);
      
      // 예약 완료 데이터를 localStorage에 저장 (SchedulePage에서 바텀시트로 표시)
      localStorage.setItem('completedReservation', JSON.stringify(reservationResult));
      
      // 예약 상태 초기화
      //  cancelReservation();
      
      // SchedulePage로 직접 이동
      navigate('/history');
      
    } catch (error) {
      let errorMessage = '예약에 실패했습니다.';
      
      // 서버에서 받은 구체적인 에러 메시지가 있으면 사용
      if (error.serverResponse && error.serverResponse.error) {
        errorMessage = error.serverResponse.error;
      }
      
      setError(errorMessage);
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

  if (error) {
    return (
      <ReservationContainer>
        <ErrorContainer>
          <ErrorText>
            {error.status === 404 ? '해당 메뉴를 찾을 수 없습니다.' : '데이터를 불러오는데 실패했습니다.'}
          </ErrorText>
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
          {error && (
            <ErrorContainer>
              <ErrorText>{error}</ErrorText>
            </ErrorContainer>
          )}
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