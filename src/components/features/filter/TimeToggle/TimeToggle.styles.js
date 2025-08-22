import styled from 'styled-components';

export const Button = styled.button`
  width: 72px;
  height: 36px;
  border-radius: 20px;
  border: 1px solid #DA2538;
  background: #fff;
  color: #DA2538;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 8px;

  &:hover { 
    border: 1px solid #DA2538;
    color: #DA2538;
  }
`; 