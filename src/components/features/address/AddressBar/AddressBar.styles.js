import styled from "styled-components";

export const AddressContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 18px 20px 0 20px;
  font-size: 22px;
  font-weight: bold;
  gap: 6px;
  justify-content: space-between;
  position: relative;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`;

export const AddressText = styled.div`
  color: #000;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0;
  line-height: normal;
`;

export const SelectArrow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 19px;
  color: #666;
`;