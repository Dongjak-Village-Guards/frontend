import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '../../components/layout/TopNavBar/TopNavBar';
import Layout from '../../components/layout/Layout';
import { NavBar } from '../../components/layout/TopNavBar/TopNavBar.styles';
import ScrollContainer from '../../components/layout/ScrollContainer';

const NoticePage = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <Layout currentPage="notice">
      <PageContainer>
        <NavBarContainer>
          <TopNavBar title="공지사항" onBack={handleBackClick} />
        </NavBarContainer>
        <ScrollContainer>
          <ContentContainer>
            <NoticeList>
              <NoticeItem>
                <NoticeTitle>서비스 이용 안내</NoticeTitle>
                <NoticeDate>2024.01.15</NoticeDate>
                <NoticeContent>
                  안녕하세요. 저희 서비스를 이용해 주셔서 감사합니다.
                  더 나은 서비스를 위해 지속적으로 개선하고 있습니다.
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
        </ScrollContainer>
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

const NavBarContainer = styled.div`
`;

const ContentContainer = styled.div`
  padding: 72px 0px 0px 0px;
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