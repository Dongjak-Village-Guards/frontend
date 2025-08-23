/**
 * 메뉴 페이지 컴포넌트
 * Space가 1개인 가게의 메뉴 목록을 표시
 */

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import useStore from '../../hooks/store/useStore';
import useStoreMenus from '../../hooks/store/useStoreMenus';
import DetailPageLayout from '../../components/layout/DetailPageLayout';
import StoreImage from '../../components/features/shop/StoreImage/StoreImage';
import ShopInfo from '../../components/sections/shop-detail/ShopInfo/ShopInfo';
import MenuList from '../../components/sections/shop-detail/MenuList/MenuList';
import MenuCard from '../../components/sections/shop-detail/MenuCard/MenuCard';
import Spinner from '../../components/ui/Spinner/Spinner';
import placeholderImage from '../../assets/images/placeholder.svg';
import {
  LoadingContainer,
  ErrorContainer,
  ErrorText,
  ErrorSubText,
  Line,
  MenuSection,
  SectionTitle
} from '../../components/ui/CommonStyles';

const MenuPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { time, startReservation } = useStore();
  const { menus, storeData, loading, error } = useStoreMenus(id, time);
  
  // useStoreMenus 디버깅
  console.log('=== MenuPage useStoreMenus 디버깅 ===');
  console.log('storeId (id):', id);
  console.log('time:', time);
  console.log('loading:', loading);
  console.log('error:', error);
  console.log('menus 배열:', menus);
  console.log('menus 길이:', menus?.length);
  console.log('storeData:', storeData);
  console.log('첫 번째 메뉴:', menus?.[0]);
  console.log('첫 번째 메뉴의 item_id:', menus?.[0]?.item_id);
  console.log('첫 번째 메뉴의 menu_id:', menus?.[0]?.menu_id);
  console.log('첫 번째 메뉴의 is_available:', menus?.[0]?.is_available);
  console.log('모든 메뉴의 item_id 목록:', menus?.map(menu => ({ menu_id: menu.menu_id, item_id: menu.item_id, is_available: menu.is_available })));
  console.log('=== MenuPage useStoreMenus 디버깅 끝 ===');
  
  // 뒤로가기 처리
  const handleBack = () => {
    navigate(-1);
  };
  
  // 예약하기 버튼 클릭 시
  const handleReserve = (menu) => {
    console.log('MenuPage: 예약하기 클릭', menu);
    console.log('=== 메뉴 선택 디버깅 ===');
    console.log('선택된 메뉴 객체:', menu);
    console.log('item_id 존재 여부:', !!menu?.item_id);
    console.log('item_id 값:', menu?.item_id);
    console.log('메뉴 ID:', menu?.menu_id);
    console.log('메뉴 이름:', menu?.menu_name);
    console.log('storeId (id):', id);
    console.log('=== 메뉴 선택 디버깅 끝 ===');
    
    if (!menu || !menu.item_id) {
      console.error('MenuPage: 메뉴 정보가 없거나 item_id가 없습니다.');
      return;
    }
    
    startReservation(menu, null);
    navigate(`/store/${id}/reservation`);
  };
  
  // 대표 메뉴 선택 (최대 할인율 기준)
  const getFeaturedMenu = () => {
    console.log('=== getFeaturedMenu 디버깅 ===');
    console.log('menus 존재 여부:', !!menus);
    console.log('menus 길이:', menus?.length);
    
    if (!menus || menus.length === 0) {
      console.log('메뉴가 없어서 null 반환');
      return null;
    }
    
    const featured = menus.reduce((prev, curr) => 
      prev.discount_rate > curr.discount_rate ? prev : curr
    );
    
    console.log('선택된 대표 메뉴:', featured);
    console.log('대표 메뉴의 item_id:', featured?.item_id);
    console.log('대표 메뉴의 is_available:', featured?.is_available);
    console.log('=== getFeaturedMenu 디버깅 끝 ===');
    
    return featured;
  };
  
  // 나머지 메뉴 목록
  const getOtherMenus = () => {
    console.log('=== getOtherMenus 디버깅 ===');
    console.log('menus 존재 여부:', !!menus);
    console.log('menus 길이:', menus?.length);
    
    if (!menus || menus.length === 0) {
      console.log('메뉴가 없어서 빈 배열 반환');
      return [];
    }
    
    const featured = getFeaturedMenu();
    console.log('대표 메뉴:', featured);
    
    if (!featured) {
      console.log('대표 메뉴가 없어서 전체 메뉴 반환');
      return menus;
    }
    
    const otherMenus = menus.filter(menu => menu.menu_id !== featured.menu_id);
    console.log('나머지 메뉴 개수:', otherMenus.length);
    console.log('나머지 메뉴 목록:', otherMenus.map(menu => ({ menu_id: menu.menu_id, item_id: menu.item_id, is_available: menu.is_available })));
    console.log('=== getOtherMenus 디버깅 끝 ===');
    
    return otherMenus;
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
      title={storeData?.store_name}
      onBack={handleBack}
      showLike={false}
    >
      <StoreImage 
        src={storeData?.store_image_url || placeholderImage} 
        alt={storeData?.store_name}
      />
      <ShopInfo
        name={storeData?.store_name}
        address={storeData?.store_address}
        distance={`${storeData?.distance}m`}
        reservationTime={`${time} 예약`}
      />
      
      <Line />
      <MenuSection>
        <SectionTitle>가장 할인율이 큰 대표 메뉴!</SectionTitle>
        {(() => {
          const featuredMenu = getFeaturedMenu();
          return (
            <MenuCard
              menu={featuredMenu}
              onReserve={() => handleReserve(featuredMenu)}
            />
          );
        })()}
      </MenuSection>
      
      <Line />
      <MenuSection>
        <SectionTitle>다른 할인 메뉴</SectionTitle>
        <MenuList menus={getOtherMenus()} onReserve={handleReserve} />
      </MenuSection>
    </DetailPageLayout>
  );
};

export default MenuPage;

 