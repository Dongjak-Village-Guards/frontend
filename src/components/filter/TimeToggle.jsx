import React from 'react';
import styled from 'styled-components';

const TimeToggle = ({ label, active, onClick }) => {
  return (
    <Button type="button" onClick={onClick} $active={active} aria-pressed={!!active}>
      <span>{label}</span>
      <Caret>▾</Caret>
    </Button>
  );
};

export default TimeToggle;

const Button = styled.button`
  width: clamp(60px, 20vw, 72px);
  height: clamp(30px, 7vh, 36px);
  border-radius: clamp(12px, 3vw, 16px);
  border: 1px solid ${props => props.$active ? '#DA2538' : '#CCC'};
  background: #fff;
  color: ${props => props.$active ? '#DA2538' : '#666'};
  font-size: clamp(13px, 4vw, 15px);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: clamp(4px, 2vw, 8px);
  padding: 0 clamp(4px, 2vw, 8px);
  
//  &:hover { background: #f8f8f8; }
  &:hover { 
    border: 1px solid #DA2538;
    color: #DA2538;
  }
`;

const Caret = styled.span`
  font-size: 12px;
`;

