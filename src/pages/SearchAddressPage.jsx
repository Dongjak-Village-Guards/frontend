/**
 * 주소 검색 페이지
 * 로그인 다음 or 홈 화면에서 주소 변경할 때 사용
 */

import Search from '../components/features/address/AddressSearch'
import styled from 'styled-components'
import useStore from '../hooks/store/useStore'
import useUserInfo from '../hooks/user/useUserInfo'
import TopNavBar from '../components/layout/TopNavBar/TopNavBar'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const SearchAddressPage = () => {
  const navigate = useNavigate();
  const { setCurrentPage, fromHomePage, setFromHomePage } = useStore();
  const { userAddress } = useUserInfo();

  // userAddress가 있으면 홈에서 온 것으로 판단, 없으면 로그인 후 첫 주소 설정
  useEffect(() => {
    const isFromHome = userAddress !== null;
    setFromHomePage(isFromHome);
  }, [userAddress, setFromHomePage]);

  console.log('SearchAddressPage - userAddress:', userAddress);
  console.log('SearchAddressPage - fromHomePage:', fromHomePage);

  const handleBackClick = () => {
    //setCurrentPage('home');
    navigate(-1);
  };

  return (
    <AddressWrapper>
      {fromHomePage && (
        <TopNavBar
          title="주소 선택"
          onBack={handleBackClick}
        />
      )}
      <AddressContainer fromHomePage={fromHomePage}>
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
  );
};

export default SearchAddressPage;

const AddressWrapper = styled.div`
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

const AddressContainer = styled.div`
  background-color: #ffffff;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: ${props => props.fromHomePage ? 'flex-start' : 'center'};
  padding-top: ${props => props.fromHomePage ? '72px' : '0'};
`;

const AddressFrame = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 16px;
`;

const TextContainer = styled.div`
  width: 100%;

  .title {
    color: #282828;
    font-size: 20px;
    font-weight: 400;
    letter-spacing: 0;
    line-height: normal;
    margin: 0 0 8px 0;
  }

  .paragraph {
    color: #737373;
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 0;
    line-height: normal;
    margin: 0 0 16px 0;
  }
`;

const SearchContainer = styled.div`
  width: 100%;
`;