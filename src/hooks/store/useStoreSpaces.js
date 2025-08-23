/**
 * 가게 Space 목록 로딩 Hook
 * 특정 가게의 Space 목록을 로딩
 */

import { useState, useEffect } from 'react';
import { fetchStoreSpacesList, convertTimeToParam } from '../../apis/storeAPI';
import useUserInfo from '../user/useUserInfo';

const useStoreSpaces = (storeId, time) => {
  const [spaces, setSpaces] = useState([]);
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { accessToken } = useUserInfo();

  useEffect(() => {
    const loadData = async () => {
      if (!storeId || time === null) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        console.log('useStoreSpaces: Space 목록 로딩 시작', { storeId, time });
        
        const timeParam = convertTimeToParam(time);
        const data = await fetchStoreSpacesList(storeId, timeParam, accessToken);
        
        console.log('useStoreSpaces: Space 목록 로딩 결과', data);
        
        setSpaces(data.spaces || []);
        setStoreData(data);
        
      } catch (error) {
        console.error('useStoreSpaces: Space 목록 로딩 실패', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [storeId, time, accessToken]);

  return { 
    spaces, 
    storeData, 
    loading, 
    error 
  };
};

export default useStoreSpaces; 