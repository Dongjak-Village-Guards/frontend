import { AiOutlineCaretDown } from "react-icons/ai";
import {
  AddressContainer,
  AddressText,
  SelectArrow
} from './AddressBar.styles';

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

export default AddressBar; 