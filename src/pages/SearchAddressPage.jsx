import React from 'react'
import { FiChevronLeft } from 'react-icons/fi'
import Search from '../components/address/Search'
import styled from 'styled-components'
import useStore from '../hooks/store/useStore'
import useUserInfo from '../hooks/user/useUserInfo'

const SearchAddressPage = () => {
  const { setCurrentPage, fromHomePage } = useStore();
  const { userAddress } = useUserInfo();

  console.log('SearchAddressPage - userAddress:', userAddress);
  console.log('SearchAddressPage - fromHomePage:', fromHomePage);

  const handleBackClick = () => {
    console.log('뒤로가기 버튼 클릭됨');
    setCurrentPage('home');
  };

  return (
    <AddressWrapper>
      {/* 뒤로가기 토글 - HomePage에서 접근했을 때만 표시 */}
      {fromHomePage && (
        <BackButton onClick={handleBackClick}>
          <FiChevronLeft size={20} />
          <span>주소 선택</span>
        </BackButton>
      )}
      
      <AddressContainer>
        <AddressFrame>
          <TextContainer>
            <p className='title'>우리 동네를 등록해보세요</p>
            <p className='paragraph'>동네에서 가장 똑똑한 소비를 찾아드려요</p>
          </TextContainer>
          <SearchContainer>
            <Search />
          </SearchContainer>
        </AddressFrame>
      </AddressContainer>
    </AddressWrapper>
  )
}

export default SearchAddressPage;

const AddressWrapper = styled.div`
  background-color: #ffffff;
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  height: 100%; // Layout에 맞출려고 수정
  position: relative;
`

const BackButton = styled.button`
  position: absolute;
  top: 12px;
  left: 16px;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 100;
  display: flex;
  justify-content: center;
  font-size: 16px;
  vertical-align: ;
  align-items: flex-end;
  color: #000000;
  transition: color 0.2s ease;

  &:hover {
    opacity: 0.7;
    color: #DA2538;
  }
`

const AddressContainer = styled.div`
  position: relative;
  background-color: #ffffff;
  width: 360px;
  height: 720px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const AddressFrame = styled.div`
  position: relative;
  top: 128px;
  width: 328px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
`

const TextContainer = styled.div`
  width: 100%;

  .title {
    color: #282828;
    font-family: 'Pretendard-Regular', Helvetica;
    font-size: 20px;
    font-weight: 400;
    letter-spacing: 0;
    line-height: normal;
    margin: 0 0 8px 0;
  }

  .paragraph {
    color: #737373;
    font-family: 'Pretendard-Regular', Helvetica;
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 0;
    line-height: normal;
    margin: 0 0 16px 0;
  }
`

const SearchContainer = styled.div`
  width: 100%;
`