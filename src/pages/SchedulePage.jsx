import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';
import ReservationButton from '../components/common/ReservationButton';
import BottomSheet from '../components/common/BottomSheet';
import useStore from '../hooks/store/useStore';
import useUserInfo from '../hooks/user/useUserInfo';
import Spinner from '../components/common/Spinner';
import { getNearestHour } from '../components/filter/TimeFilter';
import { fetchUserReservations, cancelReservation } from '../apis/reservationAPI';
import placeholderImage from '../assets/images/placeholder.svg';

const SchedulePage = () => {
  const navigate = useNavigate();
  const { currentPage } = useStore();
  const { accessToken, isTokenValid, refreshTokens } = useUserInfo();
  
  // 로딩 상태
  const [loading, setLoading] = useState(false);
  
  // 예약 취소 확인을 위한 상태
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  
  // 예약 완료 알림 바텀시트 상태
  const [reservationCompleteOpen, setReservationCompleteOpen] = useState(false);
  const [reservationData, setReservationData] = useState(null);

  // 예약 데이터
  const [appointments, setAppointments] = useState([]);

  // 날짜/시간 포맷팅 함수
  const formatDateTime = (date, time) => {
    const dateObj = new Date(`${date}T${time}`);
    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // 백엔드 데이터를 UI 형식으로 변환
  const transformReservationData = (reservations) => {
    console.log('=== 예약 데이터 변환 디버깅 ===');
    console.log('원본 예약 데이터:', reservations);
    
    return reservations.map(reservation => {
      // 취소 가능 여부 계산
      const now = new Date();
      const reservationDateTime = new Date(`${reservation.reservation_date}T${reservation.reservation_time}`);
      const timeDifference = reservationDateTime - now;
      const isCancellable = timeDifference > 30 * 60 * 1000; // 30분 이상 남아야 취소 가능

      // store_id 확인
      console.log('예약 데이터 필드들:', {
        reservation_id: reservation.reservation_id,
        store_id: reservation.store_id,
        store_name: reservation.store_name,
        space_name: reservation.space_name,
        menu_name: reservation.menu_name,
        reservation_date: reservation.reservation_date,
        reservation_time: reservation.reservation_time
      });

      return {
        id: reservation.reservation_id,
        storeId: reservation.store_id, // store_id 추가
        salonName: reservation.store_name,
        visitTime: formatDateTime(reservation.reservation_date, reservation.reservation_time),
        designer: reservation.space_name,
        service: reservation.menu_name,
        profileImage: reservation.store_image_url || placeholderImage,
        isCancellable: isCancellable, // 취소 가능 여부 추가
        originalDate: reservation.reservation_date, // 원본 날짜 저장
        originalTime: reservation.reservation_time  // 원본 시간 저장
      };
    });
  };

  // 예약 목록 조회
  const fetchReservations = async () => {
    if (!accessToken) {
      console.log('로그인이 필요합니다.');
      return;
    }

    setLoading(true);
    try {
      // 토큰 유효성 확인 및 갱신
      if (!isTokenValid()) {
        console.log('토큰이 만료되었습니다. 토큰 갱신을 시도합니다.');
        const refreshSuccess = await refreshTokens();
        if (!refreshSuccess) {
          console.error('토큰 갱신에 실패했습니다.');
          return;
        }
        console.log('토큰 갱신 성공');
      }

      // 갱신된 토큰 가져오기
      const { accessToken: currentToken } = useUserInfo.getState();
      
      const reservations = await fetchUserReservations(currentToken);
      const transformedData = transformReservationData(reservations);
      setAppointments(transformedData);
      
      // 할인 금액 계산 및 전역 상태에 저장
      const { calculateAndSetTotalDiscount } = useStore.getState();
      calculateAndSetTotalDiscount(reservations);
    } catch (error) {
      console.error('예약 목록 조회 실패:', error);
      // 에러 발생 시 빈 배열로 설정
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 예약 목록 조회
  useEffect(() => {
    if (currentPage === 'history') {
      fetchReservations();
    }
  }, [currentPage, accessToken]);

  // 시간 경과에 따른 취소 가능 여부 실시간 업데이트
  useEffect(() => {
    if (currentPage === 'history' && appointments.length > 0) {
      const interval = setInterval(() => {
        setAppointments(prev => 
          prev.map(appointment => {
            // 원본 날짜와 시간 정보 사용
            const now = new Date();
            const reservationDateTime = new Date(`${appointment.originalDate}T${appointment.originalTime}`);
            const timeDifference = reservationDateTime - now;
            const isCancellable = timeDifference > 30 * 60 * 1000; // 30분 이상 남아야 취소 가능
            
            return { ...appointment, isCancellable };
          })
        );
      }, 60000); // 1분마다 업데이트

      return () => clearInterval(interval);
    }
  }, [currentPage, appointments.length]);

  // 예약 완료 알림 바텀시트 표시 (예약 후 SchedulePage로 이동 시)
  useEffect(() => {
    if (currentPage === 'history') {
      // 예약 완료 데이터가 있다면 바텀시트 표시
      const completedReservation = localStorage.getItem('completedReservation');
      if (completedReservation) {
        setReservationData(JSON.parse(completedReservation));
        setReservationCompleteOpen(true);
        localStorage.removeItem('completedReservation'); // 사용 후 제거
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
  const handleConfirmCancel = async () => {
    if (!selectedAppointmentId) return;

    try {
      // 토큰 유효성 확인 및 갱신
      if (!isTokenValid()) {
        const refreshSuccess = await refreshTokens();
        if (!refreshSuccess) {
          alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
          return;
        }
      }

      // 갱신된 토큰 가져오기
      const { accessToken: currentToken } = useUserInfo.getState();
      
      await cancelReservation(selectedAppointmentId, currentToken);
      
      // 성공 시 바텀시트 닫기
      handleCancelConfirmClose();
      
      // 예약 목록 새로고침 (할인 금액도 함께 업데이트됨)
      await fetchReservations();
      
    } catch (error) {
      console.error('예약 취소 실패:', error);
      alert(error.message);
    }
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

  // 가게 제목 클릭 핸들러
  const handleSalonClick = (storeId, visitTime) => {
    console.log('=== 가게 클릭 디버깅 ===');
    console.log('가게 ID:', storeId);
    console.log('방문 시간:', visitTime);
    
    if (!storeId) {
      console.warn('가게 ID가 없습니다.');
      return;
    }
    
    // ShopDetailPage로 라우팅
    navigate(`/shop/${storeId}`);
  };

  return (
    <PageContainer>
      {/* 상단 헤더 */}
      <Header>
        <HeaderTitle>방문 예정</HeaderTitle>
      </Header>

      {/* 예약 목록 */}
      <ContentContainer>
        {loading ? (
          <LoadingContainer>
            <Spinner />
          </LoadingContainer>
        ) : appointments.length > 0 ? (
          <AppointmentList>
            {appointments.map(appointment => (
              <AppointmentCard key={appointment.id}>
                <CardContent>
                  <ProfileImage>
                    <ProfileImageSrc 
                      src={appointment.profileImage} 
                      alt={appointment.salonName}
                      onError={(e) => {
                        e.target.src = placeholderImage;
                      }}
                    />
                  </ProfileImage>
                  <AppointmentDetails>
                    <SalonName onClick={() => handleSalonClick(appointment.storeId, appointment.visitTime)}>
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
                    variant={appointment.isCancellable ? "secondary" : "primary"}
                    disabled={!appointment.isCancellable}
                    onClick={appointment.isCancellable ? () => handleCancelClick(appointment.id) : undefined}
                    >
                    {appointment.isCancellable ? "예약 취소" : "취소 불가"}
                </ReservationButton>
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
          {reservationData && (
            <ReservationInfo>
                <InfoLabel><InfoSpan>매장</InfoSpan> <InfoSpan>예약일시</InfoSpan></InfoLabel>
                
                <InfoLabel><InfoSpan>{reservationData.store_name}</InfoSpan> <InfoSpan>{reservationData.reservation_date} {reservationData.reservation_time}</InfoSpan> </InfoLabel> 
            </ReservationInfo>
          )}
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

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 40px 0;
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
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-contenet: space-between;
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
  overflow: hidden;
`;

const ProfileImageSrc = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 8px;
  object-fit: cover;
`;

const AppointmentDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`;

const SalonName = styled.div`
  display: flex;
//  align-items: center;
  gap: 4px;
  cursor: pointer;
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 0.8;
  }
`;

const SalonNameText = styled.span`
//  background: #FFF3CD;
  color: #000;
  padding: 2px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 700;
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
  margin-top: 8px;
`;

const Divider = styled.div`
  width: 100%;
  border-bottom: 1px solid #CCCCCC;
  padding-top: 0px;
`;

const ReservationCompleteContent = styled.div`
//  padding: 24px 16px;
  text-align: center;
`;

const ReservationInfo = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 24px;
  text-align: left;
  margin-top: 0.7rem;
  display: flex;
`;

const InfoLabel = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 16px;
  color: #666;
  font-weight: 500;
  padding:  0;
`;

const InfoSpan = styled.span`
  display: flex;
  flex-direction: column;
  padding-left: 1.5rem;
  margin: 0.7rem 0;
  font-weight: 700;
`;