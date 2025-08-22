import styled from 'styled-components';

export const Button = styled.button`
  min-width: 72px;
  width: auto;
  height: 36px;
  border-radius: 20px;
  border: 1px solid ${props => props.$active ? '#DA2538' : '#CCC'};
  background: #fff;
  color: ${props => props.$active ? '#DA2538' : '#000000'};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  white-space: nowrap;
  
  &:hover { 
    border: 1px solid #DA2538;
    color: #DA2538;
  }
`; 