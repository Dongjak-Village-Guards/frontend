import { StyledButton } from './ReservationButton.styles';

const ReservationButton = ({ 
  children, 
  onClick, 
  disabled, 
  variant = "primary", // primary, secondary, danger
  ...props 
}) => (
  <StyledButton 
    onClick={onClick} 
    disabled={disabled} 
    variant={variant}
    {...props}
  >
    {children}
  </StyledButton>
);

export default ReservationButton; 