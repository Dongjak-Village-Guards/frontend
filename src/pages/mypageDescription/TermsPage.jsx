import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '../../components/layout/TopNavBar/TopNavBar';
import Layout from '../../components/layout/Layout';
import ScrollContainer from '../../components/layout/ScrollContainer';

const TermsPage = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <Layout currentPage="terms">
        <NavBarContainer>
          <TopNavBar title="약관 및 정책" onBack={handleBackClick} />
        </NavBarContainer>
        <ScrollContainer offsettop={72}>
          <ContentContainer>
            <TermsSection>
              <SectionTitle>예약 부도(No-Show)</SectionTitle>
              <SectionContent>
              <Paragraph>
                <ol>
                  <li>예약 부도(No-Show)의 정의: 예약 시간으로부터 15분이 지날 때까지 매장에 방문하지 않거나, 사전 연락 없이 예약을 이행하지 않는 경우.</li>
                  <br />
                  <li>패널티 적용:</li>
                  <ul>
                    <li>최근 30일 이내 1회 발생 시: 7일 동안 서비스 이용(예약)이 제한됩니다.</li>
                    <li>최근 30일 이내 2회 발생 시: 14일 동안 서비스 이용(예약)이 제한됩니다.</li>
                    <li>최근 30일 이내 3회 이상 발생 시: 영구적으로 서비스 이용(예약)이 제한됩니다.</li>
                  </ul>
                </ol>
              </Paragraph>
              </SectionContent>
            </TermsSection>

            <TermsSection>
              <SectionTitle>예약 취소</SectionTitle>
            <SectionContent>
              <Paragraph>
                부득이하게 예약을 지키기 어려운 경우, 예약 시간 30분 전까지는 '일정' 탭에서 직접 취소가 가능합니다. 30분 이내로 남은 시점에는 취소가 불가하오니, 신중한 예약을 부탁드립니다.
              </Paragraph>
            </SectionContent>
          </TermsSection>
        </ContentContainer>
      </ScrollContainer>
    </Layout>
  );
};

const ContentContainer = styled.div`
  position: relative;
  padding: 3px 16px 0px 16px;
`;

const NavBarContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;
`;

const TermsSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: #000;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #da2538;
`;

const SectionContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Paragraph = styled.div`
  font-size: 14px;
  color: #444;
  line-height: 1.4;
  margin: 0;

  ol, ul {
    padding-left: 20px;
  }
`;

export default TermsPage; 