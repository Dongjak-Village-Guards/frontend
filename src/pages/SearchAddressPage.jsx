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

const SearchAddressPage = () => {
  const navigate = useNavigate();
  const { setCurrentPage, fromHomePage } = useStore();
  const { userAddress } = useUserInfo();

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
      <AddressContainer>
        <AddressFrame marginTop={!fromHomePage ? '120px' : '0'}>
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
  align-items: center;
  padding-top: 72px;
`;

const AddressFrame = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  margin-top: ${props => props.marginTop || '0'};
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