import React, { useState, useEffect } from 'react';
import { fetchStoresFromAPI } from '../../../apis/storeAPI';
import { TestContainer, TestTitle, ButtonGroup, TestButton, CategoryGroup, CategoryLabel, CategoryButton, ErrorMessage, StoreList, StoreItem, StoreInfo, StoreName, StoreCategory, StoreAddress, StoreActions, DetailButton, StoreDetail, DetailCard, DetailImage, DetailContent, DetailName, DetailCategory, DetailOwner, DetailAddress, DetailDescription, DetailStatus, DetailDates, CloseButton } from './StoreTest.styles';

const StoreTest = () => {
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');

  // 가게 목록 조회
  const handleFetchStores = async () => {
    setLoading(true);
    setError(null);
    try {
      // 현재 시간을 기준으로 API 호출
      const currentHour = new Date().getHours();
      const data = await fetchStoresFromAPI(currentHour);
      setStores(data);
      setSelectedStore(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 가게 상세 조회 (현재 API에는 상세 조회 기능이 없으므로 주석 처리)
  const handleFetchStoreById = async (storeId) => {
    setLoading(true);
    setError(null);
    try {
      // 현재 백엔드 API에는 상세 조회 기능이 없으므로 임시로 목록에서 찾기
      const store = stores.find(s => s.id === storeId);
      if (store) {
        setSelectedStore(store);
      } else {
        setError('가게를 찾을 수 없습니다.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 카테고리별 조회
  const handleFetchByCategory = async (category) => {
    setLoading(true);
    setError(null);
    try {
      // 현재 시간과 카테고리를 기준으로 API 호출
      const currentHour = new Date().getHours();
      const data = await fetchStoresFromAPI(currentHour, category);
      setStores(data);
      setSelectedStore(null);
      setSelectedCategory(category);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 가게 목록 조회
  useEffect(() => {
    handleFetchStores();
  }, []);

  const categories = ['스터디카페', '스포츠시설', '미용실', 'PT/필라테스', '사진 스튜디오'];

  return (
    <TestContainer>
      <TestTitle>가게 API 테스트 (백엔드 연동)</TestTitle>
      
      {/* 테스트 버튼들 */}
      <ButtonGroup>
        <TestButton onClick={handleFetchStores} disabled={loading}>
          {loading ? '로딩 중...' : '현재 시간 기준 가게 목록 조회'}
        </TestButton>
        
        <CategoryGroup>
          <CategoryLabel>카테고리별 조회:</CategoryLabel>
          {categories.map(category => (
            <CategoryButton
              key={category}
              onClick={() => handleFetchByCategory(category)}
              disabled={loading}
              $active={selectedCategory === category}
            >
              {category}
            </CategoryButton>
          ))}
        </CategoryGroup>
      </ButtonGroup>

      {/* 에러 메시지 */}
      {error && (
        <ErrorMessage>
          ❌ 에러: {error}
        </ErrorMessage>
      )}

      {/* 가게 목록 */}
      {stores.length > 0 && (
        <StoreList>
          <h3>가게 목록 ({stores.length}개)</h3>
                     {stores.map(store => (
             <StoreItem key={store.id}>
              <StoreInfo>
                <StoreName>{store.name}</StoreName>
                <StoreCategory>{store.menu}</StoreCategory>
                <StoreAddress>거리: {store.distance}m, 도보: {store.walkTime}분</StoreAddress>
              </StoreInfo>
                             <StoreActions>
                 <DetailButton onClick={() => handleFetchStoreById(store.id)}>
                   상세보기
                 </DetailButton>
               </StoreActions>
            </StoreItem>
          ))}
        </StoreList>
      )}

      {/* 선택된 가게 상세 정보 */}
      {selectedStore && (
        <StoreDetail>
          <h3>가게 상세 정보</h3>
          <DetailCard>
            <DetailImage src={selectedStore.store_image_url || "https://via.placeholder.com/200x150"} alt={selectedStore.name} />
            <DetailContent>
              <DetailName>{selectedStore.name}</DetailName>
              <DetailCategory>메뉴: {selectedStore.menu}</DetailCategory>
              <DetailOwner>거리: {selectedStore.distance}m</DetailOwner>
              <DetailAddress>도보 시간: {selectedStore.walkTime}분</DetailAddress>
              <DetailDescription>좋아요: {selectedStore.isLiked ? '❤️' : '🤍'}</DetailDescription>
              <DetailStatus>
                할인율: {selectedStore.menus?.[0]?.discountRate || 0}%
              </DetailStatus>
              <DetailDates>
                <div>정가: {selectedStore.menus?.[0]?.originalPrice?.toLocaleString() || 0}원</div>
                <div>할인가: {selectedStore.menus?.[0]?.discountPrice?.toLocaleString() || 0}원</div>
              </DetailDates>
            </DetailContent>
          </DetailCard>
          <CloseButton onClick={() => setSelectedStore(null)}>
            닫기
          </CloseButton>
        </StoreDetail>
      )}
    </TestContainer>
  );
};

export default StoreTest; 