import React from "react";
import styled from "styled-components";
import { AiOutlineCaretDown } from "react-icons/ai";

const AddressBar = ({ address, onAddressClick }) => {
  return (
    <AddressContainer onClick={onAddressClick}>
      <AddressText>{address}</AddressText>
      <SelectArrow>
        <AiOutlineCaretDown />
      </SelectArrow>
    </AddressContainer>
  );
};

// ===== Styled Components ===== //
const AddressContainer = styled.div`
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

const AddressText = styled.div`
  color: #000000;
  font-family: "Pretendard-Bold", Helvetica;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0;
  line-height: normal;
  
  // 긴 text ...으로 대체
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  flex: 1;
`;

const SelectArrow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 19px;
  color: #666;
`;

export default AddressBar; 