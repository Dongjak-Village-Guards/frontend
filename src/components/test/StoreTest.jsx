import React, { useState, useEffect } from 'react';
import { fetchStoresFromAPI } from '../../apis/storeAPI';
import styled from 'styled-components';

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
      const store = stores.find(s => s.store_id === storeId);
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
             <StoreItem key={store.store_id}>
              <StoreInfo>
                <StoreName>{store.store_name}</StoreName>
                <StoreCategory>{store.menu}</StoreCategory>
                <StoreAddress>거리: {store.distance}m, 도보: {store.walkTime}분</StoreAddress>
              </StoreInfo>
                             <StoreActions>
                 <DetailButton onClick={() => handleFetchStoreById(store.store_id)}>
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
            <DetailImage src={selectedStore.store_image_url || "https://via.placeholder.com/200x150"} alt={selectedStore.store_name} />
            <DetailContent>
              <DetailName>{selectedStore.store_name}</DetailName>
              <DetailCategory>메뉴: {selectedStore.menu}</DetailCategory>
              <DetailOwner>거리: {selectedStore.distance}m</DetailOwner>
              <DetailAddress>도보 시간: {selectedStore.walkTime}분</DetailAddress>
              <DetailDescription>좋아요: {selectedStore.isLiked ? '❤️' : '🤍'}</DetailDescription>
              <DetailStatus>
                할인율: {selectedStore.menus?.[0]?.discount_rate || 0}%
              </DetailStatus>
              <DetailDates>
                <div>정가: {selectedStore.menus?.[0]?.menu_price?.toLocaleString() || 0}원</div>
                <div>할인가: {selectedStore.menus?.[0]?.discounted_price?.toLocaleString() || 0}원</div>
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

// Styled Components
const TestContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const TestTitle = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 30px;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
`;

const TestButton = styled.button`
  padding: 12px 24px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: background 0.2s ease;
  
  &:hover:not(:disabled) {
    background: #0056b3;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const CategoryGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
`;

const CategoryLabel = styled.span`
  font-weight: 500;
  color: #666;
  margin-right: 10px;
`;

const CategoryButton = styled.button`
  padding: 8px 16px;
  background: ${props => props.$active ? '#28a745' : '#f8f9fa'};
  color: ${props => props.$active ? 'white' : '#333'};
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: ${props => props.$active ? '#218838' : '#e9ecef'};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  padding: 12px;
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 6px;
  margin-bottom: 20px;
`;

const StoreList = styled.div`
  margin-bottom: 30px;
  
  h3 {
    color: #333;
    margin-bottom: 15px;
  }
`;

const StoreItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 10px;
  background: white;
  transition: box-shadow 0.2s ease;
  
  &:hover {
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
`;

const StoreInfo = styled.div`
  flex: 1;
`;

const StoreName = styled.h4`
  margin: 0 0 5px 0;
  color: #333;
  font-size: 16px;
`;

const StoreCategory = styled.span`
  display: inline-block;
  padding: 4px 8px;
  background: #e9ecef;
  color: #495057;
  border-radius: 4px;
  font-size: 12px;
  margin-right: 10px;
`;

const StoreAddress = styled.p`
  margin: 5px 0 0 0;
  color: #666;
  font-size: 14px;
`;

const StoreActions = styled.div`
  display: flex;
  gap: 10px;
`;

const DetailButton = styled.button`
  padding: 6px 12px;
  background: #17a2b8;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background 0.2s ease;
  
  &:hover {
    background: #138496;
  }
`;

const StoreDetail = styled.div`
  margin-top: 30px;
  
  h3 {
    color: #333;
    margin-bottom: 15px;
  }
`;

const DetailCard = styled.div`
  display: flex;
  gap: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  margin-bottom: 15px;
`;

const DetailImage = styled.img`
  width: 200px;
  height: 150px;
  object-fit: cover;
  border-radius: 6px;
  background: #f8f9fa;
`;

const DetailContent = styled.div`
  flex: 1;
`;

const DetailName = styled.h2`
  margin: 0 0 10px 0;
  color: #333;
  font-size: 24px;
`;

const DetailCategory = styled.p`
  margin: 5px 0;
  color: #666;
  font-size: 14px;
`;

const DetailOwner = styled.p`
  margin: 5px 0;
  color: #666;
  font-size: 14px;
`;

const DetailAddress = styled.p`
  margin: 5px 0;
  color: #666;
  font-size: 14px;
`;

const DetailDescription = styled.p`
  margin: 10px 0;
  color: #333;
  line-height: 1.5;
`;

const DetailStatus = styled.p`
  margin: 5px 0;
  font-weight: 500;
`;

const DetailDates = styled.div`
  margin-top: 10px;
  font-size: 12px;
  color: #666;
  
  div {
    margin: 2px 0;
  }
`;

const CloseButton = styled.button`
  padding: 8px 16px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s ease;
  
  &:hover {
    background: #5a6268;
  }
`; 