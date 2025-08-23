import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '../../components/layout/TopNavBar/TopNavBar';
import Layout from '../../components/layout/Layout';

const NoticePage = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <Layout currentPage="notice">
      <PageContainer>
        <TopNavBar title="공지사항" onBack={handleBackClick} />
        <ContentContainer>
          <NoticeList>
            <NoticeItem>
              <NoticeTitle>서비스 이용 안내</NoticeTitle>
              <NoticeDate>2024.01.15</NoticeDate>
              <NoticeContent>
                안녕하세요, 우리 동네 시간 할인 앱 ‘지금 살래’입니다. <br />
             [지금 살래]는 사장님의 비어 있는 시간을 동네 이웃분들께 특별한 할인가로 연결해드리는 서비스입니다.
            사장님들은 약속을 믿고 정성껏 손님 맞을 준비를 합니다. 그러나 아무 연락 없이 비어버린 예약 시간은 단순히 한 시간이 사라지는 것을 넘어, 준비한 마음과 기회를 함께 잃게 합니다.
            모두의 소중한 시간을 지키기 위해 반복되는 예약 부도(노쇼)는 부득이하게 강력히 제재하고 있습니다.
            작은 약속을 지켜주시는 것만으로도 사장님께는 힘이 되고, 다른 이웃에게는 기회가 됩니다.
            감사합니다.
            [지금 살래] 팀 드림
              </NoticeContent>
            </NoticeItem>
            
            <NoticeItem>
              <NoticeTitle>앱 업데이트 안내</NoticeTitle>
              <NoticeDate>2024.01.10</NoticeDate>
              <NoticeContent>
                새로운 기능이 추가되었습니다. 
                최신 버전으로 업데이트하여 더 나은 서비스를 경험해보세요.
              </NoticeContent>
            </NoticeItem>
            
            <NoticeItem>
              <NoticeTitle>시스템 점검 안내</NoticeTitle>
              <NoticeDate>2024.01.05</NoticeDate>
              <NoticeContent>
                시스템 점검으로 인해 일시적으로 서비스 이용이 제한될 수 있습니다.
                불편을 끼쳐 죄송합니다.
              </NoticeContent>
            </NoticeItem>
          </NoticeList>
        </ContentContainer>
      </PageContainer>
    </Layout>
  );
};

const PageContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const ContentContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  padding-top: 80px;
`;

const NoticeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const NoticeItem = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const NoticeTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
`;

const NoticeDate = styled.p`
  font-size: 12px;
  color: #666;
  margin: 0 0 12px 0;
`;

const NoticeContent = styled.p`
  font-size: 14px;
  color: #555;
  line-height: 1.5;
  margin: 0;
`;

export default NoticePage; 