import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '../../components/layout/TopNavBar/TopNavBar';
import Layout from '../../components/layout/Layout';
import ScrollContainer from '../../components/layout/ScrollContainer';

const FAQPage = () => {
  const navigate = useNavigate();
  const [openItems, setOpenItems] = useState(new Set());

  const handleBackClick = () => {
    navigate('/');
  };

  const toggleItem = (index) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const faqData = [
    {
      question: "예약은 어떻게 하나요?",
      answer: "원하는 매장을 선택하고 원하는 날짜와 시간을 선택한 후 예약 버튼을 클릭하시면 됩니다. 예약 확인은 마이페이지에서 확인할 수 있습니다."
    },
    {
      question: "예약을 취소할 수 있나요?",
      answer: "네, 예약 취소가 가능합니다. 마이페이지에서 예약 내역을 확인하고 취소 버튼을 클릭하시면 됩니다. 단, 예약 시간 2시간 전까지 취소 가능합니다."
    },
    {
      question: "결제는 어떻게 하나요?",
      answer: "현재는 현장 결제만 가능합니다. 예약 시 결제는 하지 않으시고, 방문 후 서비스 이용 시 결제하시면 됩니다."
    },
    {
      question: "매장 정보를 수정하고 싶어요",
      answer: "매장 정보 수정은 고객센터로 문의해 주시기 바랍니다. 이메일 또는 전화로 연락 주시면 도움을 드리겠습니다."
    },
    {
      question: "앱에서 문제가 발생했어요",
      answer: "앱 사용 중 문제가 발생하시면 설정 > 고객센터에서 문의해 주시거나, 이메일로 스크린샷과 함께 보내주시면 빠르게 해결해 드리겠습니다."
    }
  ];

  return (
    <Layout currentPage="faq">
      <PageContainer>
        <NavBarContainer>
          <TopNavBar title="자주 묻는 질문" onBack={handleBackClick} />
        </NavBarContainer>
        <ScrollContainer>
          <ContentContainer>
            <FAQList>
              {faqData.map((item, index) => (
                <FAQItem key={index}>
                  <FAQQuestion 
                      onClick={() => toggleItem(index)}
                    isOpen={openItems.has(index)}
                  >
                    <QuestionText>{item.question}</QuestionText>
                    <ArrowIcon isOpen={openItems.has(index)}>▼</ArrowIcon>
                  </FAQQuestion>
                  {openItems.has(index) && (
                    <FAQAnswer>
                      {item.answer}
                    </FAQAnswer>
                  )}
                </FAQItem>
              ))}
            </FAQList>
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
  position: absolute;
  top: 72px;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0 16px;
  overflow-y: auto;

  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #ccc;
  }

  @media (max-width: 500px) {
    &::-webkit-scrollbar {
      width: 0;
    }
  }
`;

const FAQList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  background-color: #e9ecef;
  border-radius: 12px;
  overflow: hidden;
`;

const FAQItem = styled.div`
  background: white;
`;

const FAQQuestion = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  cursor: pointer;
  background: white;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f8f9fa;
  }
`;

const QuestionText = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: #333;
  flex: 1;
`;

const ArrowIcon = styled.span`
  font-size: 12px;
  color: #666;
  transition: transform 0.2s;
  transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

const FAQAnswer = styled.div`
  padding: 0 20px 20px 20px;
  font-size: 14px;
  color: #555;
  line-height: 1.6;
  background: white;
  border-top: 1px solid #f0f0f0;
`;

export default FAQPage; 