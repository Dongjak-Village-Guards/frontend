/**
 * Store 리다이렉트 컴포넌트
 * /store/:id 경로로 접근했을 때 Space 개수에 따라 적절한 페이지로 리다이렉트
 */

import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchStoreSpacesCount } from '../../apis/storeAPI';
import Spinner from '../../components/ui/Spinner/Spinner';
import styled from 'styled-components';

const StoreRedirect = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    const determineRedirect = async () => {
      try {
        console.log('StoreRedirect: 가게 정보 조회 시작', { storeId: id });
        
        const spacesData = await fetchStoreSpacesCount(parseInt(id));
        console.log('StoreRedirect: Space 개수 조회 결과', spacesData);
        
        if (spacesData.count === 1) {
          // Space가 1개인 경우: 메뉴 페이지로 리다이렉트
          console.log('StoreRedirect: Space 1개 → 메뉴 페이지로 리다이렉트');
          navigate(`/store/${id}/menu`, { replace: true });
        } else if (spacesData.count >= 2) {
          // Space가 2개 이상인 경우: Space 목록 페이지로 리다이렉트
          console.log('StoreRedirect: Space 2개 이상 → Space 목록 페이지로 리다이렉트');
          navigate(`/store/${id}/spaces`, { replace: true });
        } else {
          // Space가 없는 경우: 홈으로 리다이렉트
          console.log('StoreRedirect: Space 없음 → 홈으로 리다이렉트');
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error('StoreRedirect: 가게 정보 조회 실패', error);
        // 에러 시 홈으로 이동
        navigate('/', { replace: true });
      }
    };
    
    determineRedirect();
  }, [id, navigate]);
  
  return (
    <RedirectContainer>
      <Spinner />
      <RedirectText>페이지를 찾는 중...</RedirectText>
    </RedirectContainer>
  );
};

export default StoreRedirect;

// ===== Styled Components ===== //

const RedirectContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #fff;
`;

const RedirectText = styled.div`
  margin-top: 16px;
  font-size: 14px;
  color: #666;
`; 