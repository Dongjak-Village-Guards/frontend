/**
 * Space 목록 페이지 컴포넌트
 * Space가 2개 이상인 가게의 Space 목록을 표시
 */

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import useStore from '../../hooks/store/useStore';
import useStoreSpaces from '../../hooks/store/useStoreSpaces';
import DetailPageLayout from '../../components/layout/DetailPageLayout';
import StoreImage from '../../components/features/shop/StoreImage/StoreImage';
import ShopInfo from '../../components/sections/shop-detail/ShopInfo/ShopInfo';
import SpaceCard from '../../components/sections/shop-detail/SpaceCard/SpaceCard';
import Spinner from '../../components/ui/Spinner/Spinner';
import placeholderImage from '../../assets/images/placeholder.svg';
import {
  LoadingContainer,
  ErrorContainer,
  ErrorText,
  ErrorSubText,
  Line,
  DesignerSection,
} from '../../components/ui/CommonStyles';
import styled from 'styled-components';

const SpacesListPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { time } = useStore();
  const { spaces, storeData, loading, error } = useStoreSpaces(id, time);
  
  // 뒤로가기 처리
  const handleBack = () => {
    navigate(-1);
  };
  
  // Space 선택 시
  const handleSpaceSelect = (spaceId) => {
    console.log('SpacesListPage: Space 선택', spaceId);
    navigate(`/store/${id}/space/${spaceId}`);
    console.log(`"개인 확인"${storeData.store_image_url}`);
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
    >
      <StoreImage 
        storeSrc={storeData?.store_image_url || placeholderImage}
        storeAlt={storeData?.store_name}
      />
      <ShopInfo
        name={storeData?.store_name}
        address={storeData?.store_address}
        distance={`${storeData?.distance}m`}
        reservationTime={`${time} 예약`}
      />
      
      <Line />
      <DesignerSection>
        {spaces.map(space => (
          <SpaceCard
            key={space.space_id}
            space={{
              id: space.space_id,
              name: space.space_name,
              image: space.space_image_url,
              maxDiscountRate: space.max_discount_rate,
              isPossible: space.is_possible
            }}
            onSelect={handleSpaceSelect}
          />
        ))}
      </DesignerSection>
    </DetailPageLayout>
  );
};

export default SpacesListPage;

 