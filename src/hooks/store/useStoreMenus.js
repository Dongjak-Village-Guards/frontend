/**
 * 가게 메뉴 데이터 로딩 Hook
 * 특정 가게의 메뉴 목록을 로딩
 */

import { useState, useEffect } from 'react';
import { fetchStoreMenus, convertTimeToParam } from '../../apis/storeAPI';
import useUserInfo from '../user/useUserInfo';

const useStoreMenus = (storeId, time) => {
  const [menus, setMenus] = useState([]);
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
        
        console.log('useStoreMenus: 메뉴 데이터 로딩 시작', { storeId, time });
        
        const timeParam = convertTimeToParam(time);
        const data = await fetchStoreMenus(storeId, timeParam, accessToken);
        
        console.log('useStoreMenus: 메뉴 데이터 로딩 결과', data);
        
        setMenus(data.menus || []);
        setStoreData(data);
        
      } catch (error) {
        console.error('useStoreMenus: 메뉴 데이터 로딩 실패', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [storeId, time, accessToken]);

  return { 
    menus, 
    storeData, 
    loading, 
    error 
  };
};

export default useStoreMenus; 