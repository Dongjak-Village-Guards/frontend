/**
 * 가게 기본 정보 로딩 Hook
 * 가게의 기본 정보와 Space 개수를 로딩
 */

import { useState, useEffect } from 'react';
import { fetchStoreSpacesCount } from '../../apis/storeAPI';

const useStoreData = (storeId) => {
  const [storeData, setStoreData] = useState(null);
  const [spaceCount, setSpaceCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      if (!storeId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        console.log('useStoreData: 가게 기본 정보 로딩 시작', { storeId });
        
        const spacesData = await fetchStoreSpacesCount(parseInt(storeId));
        console.log('useStoreData: Space 개수 조회 결과', spacesData);
        
        setSpaceCount(spacesData.count);
        setStoreData(spacesData);
        
      } catch (error) {
        console.error('useStoreData: 가게 기본 정보 로딩 실패', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [storeId]);

  return { 
    storeData, 
    spaceCount, 
    loading, 
    error 
  };
};

export default useStoreData; 