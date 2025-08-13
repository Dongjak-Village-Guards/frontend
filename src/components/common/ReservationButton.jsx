import styled from "styled-components";

const ReservationButton = ({ children, onClick, disabled, ...props }) => (
  <StyledButton onClick={onClick} disabled={disabled} {...props}>
    {children}
  </StyledButton>
);

export default ReservationButton;

const StyledButton = styled.button`
  border: none;
  background: ${({ disabled }) => (disabled ? "#737373" : "#da2538")};
  color: #fff;
  font-size: 14px;
  font-weight: 400;
  padding: 8px 12px;
  border-radius: 10px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: background 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${({ disabled }) => (disabled ? 0.7 : 1)};

  &:hover {
    background: ${({ disabled }) => (disabled ? "#737373" : "#b71c2a")};
  }
`;