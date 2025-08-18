/**
 * 예약 페이지 컴포넌트
 * 선택된 메뉴와 가게 정보, 개인정보 제3자 동의 체크박스를 표시
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import useStore from '../hooks/store/useStore';
import useUserInfo from '../hooks/user/useUserInfo';
import ShopInfo from '../components/home/detail/ShopInfo';
import MenuCard from '../components/home/detail/MenuCard';
import PiAgreement from '../components/home/detail/PiAgreement';
import { ReactComponent as ArrowButton } from '../assets/images/piArrow.svg';
import Line from '../components/common/Line';
import Spinner from '../components/common/Spinner';
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
    setCurrentPage
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
        
        console.log('=== ReservationPage 디버깅 ===');
        console.log('selectedMenu:', selectedMenu);
        console.log('selectedMenu.item_id:', selectedMenu?.item_id);
        console.log('selectedMenu 구조:', JSON.stringify(selectedMenu, null, 2));
        console.log('accessToken 존재:', !!accessToken);
        
        if (!selectedMenu || !selectedMenu.item_id) {
          throw new Error('메뉴 정보가 없습니다.');
        }

        console.log('ReservationPage: 메뉴 상세 데이터 로드 시작', { itemId: selectedMenu.item_id });
        
        const data = await fetchMenuItemDetails(selectedMenu.item_id, accessToken);
        setMenuData(data);
        
      } catch (error) {
        console.error('ReservationPage: 메뉴 상세 데이터 로드 실패', error);
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
    }
  }, [selectedMenu, accessToken, setCurrentPage]);

  // 예약 확인 핸들러
  const handleConfirm = async () => {
    if (!isAgreed || !menuData) return;
    
    try {
      setReserving(true);
      setError(null);
      
      console.log('예약 생성 시작', { itemId: menuData.item_id });
      
      const reservationResult = await createReservation(menuData.item_id, accessToken);
      console.log('예약 생성 성공:', reservationResult);
      
      // 예약 완료 데이터를 localStorage에 저장 (SchedulePage에서 바텀시트로 표시)
      localStorage.setItem('completedReservation', JSON.stringify(reservationResult));
      
      // 예약 상태 초기화
      //  cancelReservation();
      
      // 예약 완료 후 SchedulePage로 이동 (바텀시트로 알림)
      setCurrentPage('history');
      
      // 한 단계 뒤로가기 (상세페이지로)
      navigate(-1);
      
    } catch (error) {
      console.error('예약 생성 실패:', error);
      
      // 서버 에러 메시지 추출
      let errorMessage = '예약에 실패했습니다.';
      
      if (error.message && error.message.includes('400')) {
        // 400 에러의 경우 서버 응답에서 에러 메시지 추출
        try {
          // 에러 객체에서 서버 응답 메시지 확인
          if (error.serverResponse) {
            errorMessage = error.serverResponse.error || errorMessage;
          }
        } catch (parseError) {
          console.error('에러 메시지 파싱 실패:', parseError);
        }
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
    return selectedDesigner ? `${shop?.name} / ${selectedDesigner.name}` : shop?.name;
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
            address={menuData?.store_address || shop?.address}
            distance={`${menuData?.distance || shop?.distance}m`}
            reservationTime={`${menuData?.selected_time || currentTime} 예약`}
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
                    isReserved: false
                  }}
                  onReserve={() => {}}
                  hideButton={true} // 버튼 숨김
                />
            </MenuCardDiv>
          )}
          <Line />
          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              checked={isAgreed}
              onChange={handleCheckboxChange}
            />
            <CheckboxLabel>개인정보 제3자 제공 동의</CheckboxLabel>
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
        </>
      )}
    </ReservationContainer>
  );
};

export default ReservationPage;

// ===== Styled Components ===== //

const ReservationContainer = styled.div`
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
  text-align: center;
  margin-bottom: 16px;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0px 32px;
  height: 70px;
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: rgba(0,0,0,0.45);
  flex: 1;
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