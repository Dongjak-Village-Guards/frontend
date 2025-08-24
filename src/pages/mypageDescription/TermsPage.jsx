import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '../../components/layout/TopNavBar/TopNavBar';
import Layout from '../../components/layout/Layout';
import ScrollContainer from '../../components/layout/ScrollContainer';

const TermsPage = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <Layout currentPage="terms">
        <NavBarContainer>
          <TopNavBar title="약관 및 정책" onBack={handleBackClick} />
        </NavBarContainer>
        <ScrollContainer offsetTop={72}>
          <ContentContainer>
            <TermsSection>
              <SectionTitle>서비스 이용약관</SectionTitle>
              <SectionContent>
                <Paragraph>
                  제1조 (목적)
                </Paragraph>
                <Paragraph>
                  이 약관은 회사가 제공하는 서비스의 이용과 관련하여 회사와 회원과의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
                </Paragraph>
                
                <Paragraph>
                  제2조 (정의)
                </Paragraph>
                <Paragraph>
                  1. "서비스"라 함은 회사가 제공하는 모든 서비스를 의미합니다.
                  2. "회원"이라 함은 회사의 서비스에 접속하여 이 약관에 따라 회사와 이용계약을 체결하고 회사가 제공하는 서비스를 이용하는 고객을 말합니다.
                </Paragraph>
                
                <Paragraph>
                  제3조 (약관의 효력 및 변경)
                </Paragraph>
                <Paragraph>
                  1. 이 약관은 서비스 화면에 게시하거나 기타의 방법으로 회원에게 공지함으로써 효력이 발생합니다.
                  2. 회사는 필요한 경우 관련법령을 위배하지 않는 범위에서 이 약관을 변경할 수 있습니다.
                </Paragraph>
              </SectionContent>
            </TermsSection>
  
            <TermsSection>
              <SectionTitle>개인정보처리방침</SectionTitle>
              <SectionContent>
                <Paragraph>
                  1. 개인정보의 수집 및 이용목적
                </Paragraph>
                <Paragraph>
                  회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
                </Paragraph>
                
                <Paragraph>
                  2. 개인정보의 처리 및 보유기간
                </Paragraph>
                <Paragraph>
                  회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
                </Paragraph>
                
                <Paragraph>
                  3. 개인정보의 제3자 제공
                </Paragraph>
                <Paragraph>
                  회사는 정보주체의 개인정보를 제1조(개인정보의 처리목적)에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 개인정보보호법 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.
                </Paragraph>
              </SectionContent>
            </TermsSection>
  
            <TermsSection>
              <SectionTitle>환불 정책</SectionTitle>
              <SectionContent>
                <Paragraph>
                  1. 환불 조건
                </Paragraph>
                <Paragraph>
                  - 서비스 이용 전: 전액 환불
                  - 서비스 이용 후: 환불 불가
                  - 예약 취소: 예약 시간 2시간 전까지 가능
                </Paragraph>
                
                <Paragraph>
                  2. 환불 방법
                </Paragraph>
                <Paragraph>
                  환불 신청은 고객센터를 통해 접수하시며, 신청 후 3-5일 내에 처리됩니다.
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
  padding: 2px 16px 0px 16px;
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
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #da2538;
`;

const SectionContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Paragraph = styled.p`
  font-size: 14px;
  color: #555;
  line-height: 1.6;
  margin: 0;
  
  &:first-child {
    font-weight: 600;
    color: #333;
  }
`;

export default TermsPage; 