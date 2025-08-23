/**
 * Space 상세 페이지 컴포넌트
 * 특정 Space의 상세 정보와 메뉴 목록을 표시
 */

import { useParams, useNavigate } from 'react-router-dom';
import useStore from '../../hooks/store/useStore';
import useSpaceDetail from '../../hooks/store/useSpaceDetail';
import DetailPageLayout from '../../components/layout/DetailPageLayout';
import DesignerInfo from '../../components/sections/shop-detail/DesignerInfo/DesignerInfo';
import MenuList from '../../components/sections/shop-detail/MenuList/MenuList';
import MenuCard from '../../components/sections/shop-detail/MenuCard/MenuCard';
import Spinner from '../../components/ui/Spinner/Spinner';
import {
  LoadingContainer,
  ErrorContainer,
  ErrorText,
  ErrorSubText,
  Line,
  MenuSection,
  SectionTitle
} from '../../components/ui/CommonStyles';

const SpaceDetailPage = () => {
  const { id, spaceId } = useParams();
  const navigate = useNavigate();
  const { time, startReservation } = useStore();
  const { spaceData, menus, loading, error } = useSpaceDetail(spaceId, time);
  
  // 뒤로가기 처리
  const handleBack = () => {
    navigate(-1);
  };
  
  // 예약하기 버튼 클릭 시
  const handleReserve = (menu) => {
    console.log('SpaceDetailPage: 예약하기 클릭', menu);
    startReservation(menu, null);
    navigate(`/store/${id}/reservation`);
  };
  
  // 대표 메뉴 선택 (최대 할인율 기준)
  const getFeaturedMenu = () => {
    if (!menus || menus.length === 0) return null;
    return menus.reduce((prev, curr) => 
      prev.discount_rate > curr.discount_rate ? prev : curr
    );
  };
  
  // 나머지 메뉴 목록
  const getOtherMenus = () => {
    if (!menus || menus.length === 0) return [];
    const featured = getFeaturedMenu();
    if (!featured) return menus;
    return menus.filter(menu => menu.menu_id !== featured.menu_id);
  };
  
  // 대표 메뉴 이름 (전문 분야로 사용)
  const getSpecialty = () => {
    const featured = getFeaturedMenu();
    return featured ? featured.menu_name : 'N/A';
  };
  
  if (loading) {
    return (
      <DetailPageLayout shopId={id} title="로딩 중..." onBack={handleBack}>
        <LoadingContainer>
          <Spinner />
        </LoadingContainer>
      </DetailPageLayout>
    );
  }
  
  if (error) {
    return (
      <DetailPageLayout shopId={id} title="에러" onBack={handleBack}>
        <ErrorContainer>
          <ErrorText>데이터를 불러오는데 실패했습니다.</ErrorText>
          <ErrorSubText>{error.message}</ErrorSubText>
        </ErrorContainer>
      </DetailPageLayout>
    );
  }
  
  return (
    <DetailPageLayout 
      shopId={id} 
      title={`${spaceData?.store_name} / ${spaceData?.space_name}`}
      onBack={handleBack}
      showLike={false}
    >
      <DesignerInfo
        name={spaceData?.space_name}
        specialty={`${getSpecialty()} 전문`}
        reservationTime={`${time} 방문`}
      />
      
      <Line />
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
    </DetailPageLayout>
  );
};

export default SpaceDetailPage;

 