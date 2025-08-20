import styled from 'styled-components';

export const Button = styled.button`
  width: clamp(60px, 20vw, 72px);
  height: clamp(30px, 7vh, 36px);
  border-radius: 20px;
  border: 1px solid #DA2538;
  background: #fff;
  color: #DA2538;
  font-size: clamp(13px, 4vw, 14px);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(4px, 2vw, 8px);
  padding: 0 clamp(4px, 2vw, 8px);
  
  &:hover { 
    border: 1px solid #DA2538;
    color: #DA2538;
  }
`; 