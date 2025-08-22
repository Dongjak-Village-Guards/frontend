import styled from "styled-components";

export const StyledButton = styled.button`
  border: ${({ variant, disabled }) => {
    if (disabled) return "1px solid #737373";
    switch (variant) {
      case "secondary":
        return "1px solid #CCCCCC";
      case "danger":
        return "1px solid #DA2538";
      default:
        return "1px solid #da2538";
    }
  }};
  
  background: ${({ variant, disabled }) => {
    if (disabled) return "#737373";
    switch (variant) {
      case "secondary":
        return "#fff";
      case "danger":
        return "#DA2538";
      default:
        return "#da2538";
    }
  }};
  
  color: ${({ variant, disabled }) => {
    if (disabled) return "#fff";
    switch (variant) {
      case "secondary":
        return "#000000";
      case "danger":
        return "#ffffff";
      default:
        return "#fff";
    }
  }};
  
  font-size: 14px;
  font-weight: 400;
  padding: 10px 0;
  border-radius: 10px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${({ disabled }) => (disabled ? 0.7 : 1)};

  &:hover {
    background: ${({ variant, disabled }) => {
      if (disabled) return "#737373";
      switch (variant) {
        case "secondary":
          return "#f8f8f8";
        case "danger":
          return "#b71c2a";
        default:
          return "#b71c2a";
      }
    }};
  }
`; 