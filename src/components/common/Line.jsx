/**
 * 구분선을 표시하는 컴포넌트
 */

import styled from 'styled-components';

const Line = () => {
  return <StyledLine />
}

export default Line

// ===== Styled Components ===== //

const StyledLine = styled.div`
    width: calc(100% - 32px);
    height: 1px;
    background: #e2e4e9;
    margin: 0px 16px;
`;