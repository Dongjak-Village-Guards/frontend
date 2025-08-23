import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '../../components/layout/TopNavBar/TopNavBar';
import Layout from '../../components/layout/Layout';

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
      question: "Q. '지금 살래'는 어떤 서비스인가요?",
      answer: "A. '지금 살래'는 우리 동네 가게들의 비어있는 예약 시간을 AI가 찾아내 실시간 할인가로 제공하는 타임커머스 플랫폼입니다. 지금부터 12시간 이내의 임박 할인 정보만을 제공하여, 사용자는 합리적인 가격에 동네 서비스를 이용하고 소상공인은 빈 시간을 수익으로 전환할 수 있습니다."
    },
    {
      question: "Q. 왜 제가 사는 동네는 없나요? 서비스 지역은 어디인가요?",
      answer: "A. 현재 '지금 살래'는 서울시 동작구에서 시범 운영 중입니다. 앞으로 더 많은 동네에서 찾아뵐 수 있도록 열심히 노력하겠습니다!"
    },
    {
      question: "Q. 가격은 왜 계속 바뀌나요?",
      answer: "A. 저희 서비스의 가격은 AI가 예약까지 남은 시간, 수요 등을 실시간으로 분석하여 책정하는 '다이나믹 프라이싱' 방식이 적용됩니다. 일반적으로 예약 시간이 가까워질수록 할인율이 높아질 수 있지만, 수요가 몰릴 경우 가격이 오르거나 조기 마감될 수 있습니다. 지금 보이는 가격이 가장 좋은 가격일 수 있습니다!"
    },
  ];

  return (
    <Layout currentPage="faq">
      <PageContainer>
        <TopNavBar title="자주 묻는 질문" onBack={handleBackClick} />
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