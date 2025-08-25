import styled from 'styled-components';

export const CategoryList = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
`;

export const CategoryItem = styled.button`
  padding: 12px 16px;
  border: none;
  border-bottom: 1px solid #CCC;
  background: #fff;
  font-size: 15px;
  display: flex;
  justify-content: flex-start;
  color: ${props => props.$selected ? '#DA2538' : '#000'};
  font-weight: ${props => props.$selected ? '600' : '400'};
  cursor: pointer;

  &:hover {
    color: #DA2538;
  }

  &:last-child {
    border-bottom: none;
  }
`; 