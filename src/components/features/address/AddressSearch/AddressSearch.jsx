import React, { useState } from 'react'
import { ReactComponent as SearchIcon } from '../../../../assets/images/search.svg';
import { fetchAddressResults } from '../../../../apis/addressAPI';
import Spinner from '../../../ui/Spinner/Spinner';
import useUserInfo from '../../../../hooks/user/useUserInfo';
import useStore from '../../../../hooks/store/useStore';
import {
  SearchWrapper,
  SearchBar,
  NoResult,
  ResultContainer,
  ResultItem,
  SearchFixArea
} from './AddressSearch.styles';

const AddressSearch = () => {
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  
  const { setUserAddress } = useUserInfo();
  const { setCurrentPage } = useStore();

  const handleSearch = async () => {
    if (!keyword.trim()) return;

    console.log('=== 주소 검색 시작 ===');
    console.log('원본 검색 키워드:', keyword);
    setHasSearched(true);
    setLoading(true);
    setError('');
    setResults([]);

    try {
      const res = await fetchAddressResults(keyword);
      console.log('주소 검색 결과 개수:', res.length);
      console.log('주소 검색 결과 샘플:', res.slice(0, 3)); // 처음 3개만 로그
      setResults(res);
    } catch (err) {
      console.error('주소 검색 오류:', err);
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
      console.log('=== 주소 검색 완료 ===');
    }
  };

  /** 주소 상태 저장&관리를 위한 handle함수 추가
   * 초기 주소검색 페이지에서 받은 주소 메인페이지 상단에 표시
   * 백엔드에도 주소 정보 저장
   */
  const handleAddressSelect = async (address) => {
    try {
      // 주소 정보 저장 (로컬 + 백엔드)
      await setUserAddress(address);
      // 메인 페이지로 이동
      setCurrentPage("home");
    } catch (error) {
      console.error('주소 설정 실패:', error);
      alert('주소 설정에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <SearchWrapper>
      <SearchFixArea>
        <SearchBar>
            <input
            type='text'
            placeholder='도로명 또는 건물명으로 검색'
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <SearchIcon className='search-icon' onClick={handleSearch} />
        </SearchBar>
      </SearchFixArea>
      
      {loading && hasSearched && <Spinner />}
      {!loading && !error && hasSearched && results.length === 0 && <NoResult>검색 결과가 없어요</NoResult>}

      <ResultContainer>
        {results.map((item, index) => (
          <ResultItem key={index} onClick={() => handleAddressSelect(item)}>
            {item.roadAddr} ({item.zipNo})
          </ResultItem>
        ))}
      </ResultContainer>
    </SearchWrapper>
  );
};

export default AddressSearch; 