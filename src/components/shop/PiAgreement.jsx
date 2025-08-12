/**
 * 개인정보 제3자 제공 동의서 컴포넌트
 */
import React from 'react';
import styled from 'styled-components';

const PiAgreement = () => {
  return (
    <AgreementContainer>
        <AgreementText>
        &nbsp;[지금살래]는 회원들의 개인정보를 안전하게 취급하는 데 최선을 다합니다.<br /><br />
        &nbsp;고객님의 개인정보는 원활한 예약 진행, 고객상담, 고객관리, 분쟁 조정을 위한 기록 보존을 위해 아래 업체에 제공됩니다.<br /><br />
        &nbsp;1. 제공받는 자 : 회원이 예약을 신청한 업체, 예약관리 솔루션 [지금살래]<br /><br />
        &nbsp;2. 제공받는 자의 개인정보 이용 목적 : 업체 예약 서비스 제공 (서비스 계약 이행, 예약자 확인, 예약 관리, 재방문고객 식별, 고객 상담, 고객 관리, 문의 및 상담) 및 제공거절<br /><br />
        &nbsp;3. 제공하는 개인정보 항목 : 휴대전화번호, 예약자명, 기타 예약을 위해 필요한 정보, 닉네임<br /><br />
        &nbsp;4. 제공받는 자의 보유기간 : 예약을 통한 업체 방문일로부터 1년이 경과한 때까지 보관<br /><br />
        &nbsp;단, (i) 매장이 방문일로부터 2년 이내의 기간을 정해 제공 거절 목록에 등록한 경우, 매장이 제공 거절 목록 등록을 해제하는 때와 방문일로부터 1년이 경과한 때 중 나중에 도래하는 때까지 보관하고, (ii) 관계법령에 정해진 규정이 있는 경우 이에 따라 법정기간 동안 보관함.<br /><br />
        &nbsp;동의를 거부할 권리가 있으나, 서비스 제공을 위해 필요한 최소한의 개인정보이므로 동의 거부 시 [지금살래] 예약 서비스 이용이 제한됩니다.
        </AgreementText>
    </AgreementContainer>
  );
};

export default PiAgreement;

// ===== Styled Components ===== //

const AgreementContainer = styled.div`
  background: #fff;
  font-family: Pretendard;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const AgreementText = styled.p`
  font-size: 14px;
  font-weight: 400;
  color: #000;
  line-height: 15px;
`;