/**
 * 예약 페이지 컴포넌트
 * 선택된 메뉴와 가게 정보, 개인정보 제3자 동의 체크박스를 표시
 */

import React from 'react';
import styled from 'styled-components';
import useStore from '../hooks/store/useStore';
import ShopInfo from '../components/shop/ShopInfo';
import MenuCard from '../components/shop/MenuCard';
import PiAgreement from '../components/shop/PiAgreement';
import { ReactComponent as ArrowButton } from '../assets/images/piArrow.svg';
import Line from '../components/common/Line';

const ReservationPage = ({ shop }) => {
  const { selectedMenu, selectedDesigner, currentTime, cancelReservation, togglePiAgreement, showPiAgreement, isAgreed, setAgreed } = useStore();

  // 예약 확인 핸들러 (임시)
  const handleConfirm = () => {
    if (!isAgreed) return;
    alert('예약이 완료되었습니다!');
    cancelReservation();
  };

  // 체크박스 변경 핸들러
  const handleCheckboxChange = (e) => {
    setAgreed(e.target.checked);
  };

  // 화살표 버튼 클릭 핸들러
  const handleArrowClick = () => {
    togglePiAgreement();
  };

  // 가게 이름 (/ 디자이너)
  const shopName = selectedDesigner ? `${shop.name} / ${selectedDesigner.name}` : shop.name;

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
            name={shopName}
            address={shop.address}
            distance={`${shop.distance}m`}
            reservationTime={`${currentTime} 예약`}
          />
          <Line />
          {selectedMenu && (
            <MenuCardDiv>
                <MenuCard
                  menu={selectedMenu}
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
          <ReserveButton disabled={!isAgreed} onClick={handleConfirm}>
            예약하기
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
  font-family: Pretendard;
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
  font-family: Pretendard;
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
  font-family: Pretendard;
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  align-self: center;
  margin-top: 20px;
`;

const MenuCardDiv = styled.div`
  padding: 16px 16px 4px 16px ;
`