import React from 'react'
import Search from '../components/address/Search'
import styled from 'styled-components'

const SearchAddressPage = () => {
  return (
    <AddressWrapper>
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