import styled from 'styled-components';

// ===== Styled Components ===== //

/* 메뉴 목록 컨테이너 */
export const ListContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

/* 메뉴 없음 메시지 */
export const NoMenus = styled.div`
    font-size: clamp(12px, 3.5vw, 14px);
    color: #000;
    text-align: center;
    padding: 16px;
`; 