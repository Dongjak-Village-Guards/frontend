import React, { useState } from 'react'
import styled from 'styled-components'
import { ReactComponent as SearchIcon } from '../../assets/images/search.svg';
import { fetchAddressResults } from '../../apis/addressAPI';
import Spinner from '../common/Spinner';
import useUserInfo from '../../hooks/user/useUserInfo';
import useStore from '../../hooks/store/useStore';

const Search = () => {
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  
  const { setUserAddress } = useUserInfo();
  const { setCurrentPage } = useStore();

  const handleSearch = async () => {
    if (!keyword.trim()) return;

    console.log('주소 검색 시작:', keyword); // 디버깅 로그 추가
    setHasSearched(true);
    setLoading(true);
    setError('');
    setResults([]);

    try {
      const res = await fetchAddressResults(keyword);
      console.log('주소 검색 결과:', res); // 디버깅 로그 추가
      setResults(res);
    } catch (err) {
      console.error('주소 검색 오류:', err); // 디버깅 로그 추가
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  /** 주소 상태 저장&관리를 위한 handle함수 추가
   * 초기 주소검색 페이지에서 받은 주소 메인페이지 상단에 표시
   * 추후 백DB 생기면 관리 
   */
  const handleAddressSelect = (address) => {
    // 주소 정보 저장
    setUserAddress(address);
    // 메인 페이지로 이동
    setCurrentPage("home");
  };

  return (
    <SearchWrapper>
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
  )
}

export default Search

// ===== Styled Components ===== //
const SearchWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const SearchBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 328px;
  height: 48px;
  border-radius: 16px;
  border: 1px solid #737373;
  margin-bottom: 16px;

  input {
    width: 100%;
    padding: 0;
    margin-left: 16px;
    border: none;
    outline: none;
    font-family: Pretendard;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    color: #000;
  }

  .search-icon {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    margin-right: 16px;
    cursor: pointer;
  }
`
/*
const LoadingSpinner = styled.div`
  position: relative;
  top: 108px;
  color: #000;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  text-align: center;
`
*/

const NoResult = styled.div`
  position: relative;
  top: 108px;
  color: #000;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  text-align: center;
`

const ResultContainer = styled.ul`
  width: 100%;
  max-width: 328px;
  list-style: none;
  padding: 0;
  margin: 0;
`

const ResultItem = styled.li`
  display: flex;
  align-items: center;
  gap: 10px;
  align-self: stretch;
  border-bottom: 1px solid #ccc;

  color: #000;
  font-variant-numeric: lining-nums tabular-nums;
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;

  padding: 10px 16px;
  box-sizing: border-box;
  min-height: 50px;
  white-space: normal;
  word-break: break-word;

  user-select: none;
  cursor: pointer;
`