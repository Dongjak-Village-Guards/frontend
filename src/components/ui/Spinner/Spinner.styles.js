import styled, { keyframes } from 'styled-components';

const spin = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
`

export const SpinnerWrapper = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
`

export const Loader = styled.div`
    width: 64px;
    height: 64px;
    border: 5px solid #DA2538;
    border-top: 5px solid #fff;
    border-radius: 50%;
    animation: ${spin} 0.5s linear infinite;
` 