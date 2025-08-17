import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiChevronRight } from 'react-icons/fi';
import ReservationButton from '../components/common/ReservationButton';
import BottomSheet from '../components/common/BottomSheet';
import useStore from '../hooks/store/useStore';
import appStorage from '../storage/AppStorage';

const SchedulePage = () => {
  const { currentPage } = useStore();
  
  // 예약 취소 확인을 위한 상태
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  
  // 예약 완료 알림 바텀시트 상태
  const [reservationCompleteOpen, setReservationCompleteOpen] = useState(false);
  const [reservationData, setReservationData] = useState(null);

  // 예약 데이터 (실제로는 API에서 가져올 데이터)
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      salonName: '노량진 미용실',
      visitTime: '99:99',
      designer: 'A 디자이너',
      service: '남성 컷',
      profileImage: '/path/to/profile1.jpg'
    },
    {
      id: 2,
      salonName: '노량진 미용실',
      visitTime: '99:99',
      designer: 'A 구장',
      service: '',
      profileImage: '/path/to/profile2.jpg'
    },
    {
      id: 3,
      salonName: '노량진 미용실',
      visitTime: '99:99',
      designer: 'A 디자이너',
      service: '남성 컷',
      profileImage: '/path/to/profile3.jpg'
    }
  ]);

  // 예약 완료 알림 바텀시트 표시 (예약 후 SchedulePage로 이동 시)
  useEffect(() => {
    if (currentPage === 'history') {
      // 예약 완료 데이터가 있다면 바텀시트 표시
      const completedReservation = appStorage.get('completedReservation');
      if (completedReservation) {
        setReservationData(completedReservation);
        setReservationCompleteOpen(true);
        appStorage.remove('completedReservation'); // 사용 후 제거
      }
    }
  }, [currentPage]);

  // 예약 취소 확인 바텀시트 열기
  const handleCancelClick = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    setCancelConfirmOpen(true);
  };

  // 예약 취소 확인 바텀시트 닫기
  const handleCancelConfirmClose = () => {
    setCancelConfirmOpen(false);
    setSelectedAppointmentId(null);
  };

  // 예약 취소 실행
  const handleConfirmCancel = () => {
    if (selectedAppointmentId) {
      setAppointments(prev => prev.filter(app => app.id !== selectedAppointmentId));
    }
    handleCancelConfirmClose();
  };

  // 예약 유지 (바텀시트 닫기)
  const handleKeepReservation = () => {
    handleCancelConfirmClose();
  };

  // 예약 완료 알림 바텀시트 닫기
  const handleReservationCompleteClose = () => {
    setReservationCompleteOpen(false);
    setReservationData(null);
  };

  return (
    <PageContainer>
      {/* 상단 헤더 */}
      <Header>
        <HeaderTitle>방문 예정</HeaderTitle>
      </Header>

      {/* 예약 목록 */}
      <ContentContainer>
        {appointments.length > 0 ? (
          <AppointmentList>
            {appointments.map(appointment => (
              <AppointmentCard key={appointment.id}>
                <CardContent>
                  <ProfileImage>
                    <ProfilePlaceholder />
                  </ProfileImage>
                  <AppointmentDetails>
                    <SalonName>
                      <SalonNameText>{appointment.salonName}</SalonNameText>
                      <ChevronIcon />
                    </SalonName>
                    <VisitTime>{appointment.visitTime} 방문</VisitTime>
                    <ServiceInfo>
                      {appointment.designer}
                      {appointment.service && ` / ${appointment.service}`}
                    </ServiceInfo>
                  </AppointmentDetails>
                </CardContent>
                <ReservationButton 
                    variant="secondary"
                    onClick={() => handleCancelClick(appointment.id)}
                    >예약 취소</ReservationButton>
              </AppointmentCard>
            ))}
          </AppointmentList>
        ) : (
          <EmptyState>
            <EmptyText>방문 예정인 일정이 없어요</EmptyText>
            <EmptySubText>새로운 예약을 해보세요!</EmptySubText>
          </EmptyState>
        )}
      </ContentContainer>

      {/* 예약 취소 확인 바텀시트 */}
      <BottomSheet
        open={cancelConfirmOpen}
        title="예약을 취소하시겠어요?"
        onClose={handleCancelConfirmClose}
        sheetHeight="schedulePageSize"
        headerVariant="noHeaderPadding"
        bodyVariant="noBodyPadding"
      >
        <Divider />
        <CancelConfirmContent>
          <ButtonGroup>
            <ReservationButton
              variant="secondary"
              style={{
                flex: 1,
                marginRight: '8px',
                height: '54px',
              }}
              onClick={handleKeepReservation}
            >
              예약 유지
            </ReservationButton>
            <ReservationButton
              variant="danger"
              style={{
                flex: 1,
                marginLeft: '8px',
                height: '54px',
              }}
              onClick={handleConfirmCancel}
            >
              예약 취소
            </ReservationButton>
          </ButtonGroup>
        </CancelConfirmContent>
      </BottomSheet>

      {/* 예약 완료 알림 바텀시트 */}
      <BottomSheet
        open={reservationCompleteOpen}
        title="예약이 완료되었습니다!"
        onClose={handleReservationCompleteClose}
        sheetHeight="schedulePageSize"
        headerVariant="noHeaderPadding"
        bodyVariant="noBodyPadding"
      >
        <Divider />
        <ReservationCompleteContent>
          <CompleteIcon>✅</CompleteIcon>
          <CompleteTitle>예약이 성공적으로 완료되었습니다</CompleteTitle>
          {reservationData && (
            <ReservationInfo>
              <InfoRow>
                <InfoLabel>매장명:</InfoLabel>
                <InfoValue>{reservationData.store_name}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>예약일:</InfoLabel>
                <InfoValue>{reservationData.reservation_date}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>예약시간:</InfoLabel>
                <InfoValue>{reservationData.reservation_time}</InfoValue>
              </InfoRow>
            </ReservationInfo>
          )}
          <ConfirmButton onClick={handleReservationCompleteClose}>
            확인
          </ConfirmButton>
        </ReservationCompleteContent>
      </BottomSheet>
    </PageContainer>
  );
};

export default SchedulePage;

// ===== Styled Components ===== //

const PageContainer = styled.div`
  padding-top: 2rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  font-family: Pretendard;
  padding: 0 16px;
`;

const Header = styled.div`
  position: sticky;
    top: 0;
    left: 0;
    right: 0;
    padding: 52px 0 16px 0;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    z-index: 10;
    border-bottom: 2px solid #DA2538;
`;

const HeaderTitle = styled.h1`
  //  font-size: 22px;
//  font-weight: 700;
//  color: #000;
//  margin: 0;
//width: 100%;
    font-size: 22px;
    font-weight: 700;
    line-height: 14px;
    color: #000;
`;

const ContentContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-top: 16px;
`;

const AppointmentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const AppointmentCard = styled.div`
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CardContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ProfileImage = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const ProfilePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 8px;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #999;
`;

const AppointmentDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`;

const SalonName = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const SalonNameText = styled.span`
  background: #FFF3CD;
  color: #000;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
`;

const ChevronIcon = styled(FiChevronRight)`
  color: #666;
  font-size: 16px;
`;

const VisitTime = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #DA2538;
`;

const ServiceInfo = styled.div`
  font-size: 14px;
  color: #666;
`;

const CancelButton = styled.button`
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  color: #000;
  cursor: pointer;
  align-self: center;
  transition: all 0.2s ease;

  &:hover {
    background: #f8f8f8;
    border-color: #ccc;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
`;

const EmptyText = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #666;
  margin-bottom: 8px;
`;

const EmptySubText = styled.div`
  font-size: 14px;
  color: #999;
`;

const CancelConfirmContent = styled.div`
  padding: 16px 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0;
  width: 100%;
//  height: 100%;
  margin-top: 8px; // 임시
`;

const Divider = styled.div`
  width: 100%;
  border-bottom: 1px solid #CCCCCC;
  padding-top: 0px;
`;

const ReservationCompleteContent = styled.div`
  padding: 24px 16px;
  text-align: center;
`;

const CompleteIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

const CompleteTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #000;
  margin-bottom: 24px;
`;

const ReservationInfo = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
  text-align: left;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoLabel = styled.span`
  font-size: 14px;
  color: #666;
  font-weight: 500;
`;

const InfoValue = styled.span`
  font-size: 14px;
  color: #000;
  font-weight: 600;
`;

const ConfirmButton = styled.button`
  background: #DA2538;
  color: #fff;
  border: none;
  width: 100%;
  height: 48px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
`;