import styled from 'styled-components';

// ===== Styled Components ===== //
export const SignInwithGoogle = styled.div`
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 2px 3px #0000002b, 0px 0px 3px #00000015;
  width: 296px;
  height: 54px;
  display: inline-flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: #EBEBEA;
  }

  &:active {
    transform: translateY(2px);
  }

  & .frame {
    display: flex;
    align-items: flex-start;
    background: transparent;
    border-radius: 10px;
    gap: 15px;
  }

  & .google-logo {
    height: 24px;
    position: relative;
    width: 24px;
  }

  & .text-wrapper {
    color: #0000008a;
    font-family: "Roboto", Helvetica;
    font-size: 20px;
    font-weight: 500;
    letter-spacing: 0;
    line-height: normal;
    margin-top: -1.00px;
    position: relative;
    white-space: nowrap;
    width: fit-content;
  }
`; 