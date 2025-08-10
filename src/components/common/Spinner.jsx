import React from 'react'
import styled, { keyframes } from 'styled-components'

const Spinner = () => {
  return (
    <SpinnerWrapper>
        <Loader />
    </SpinnerWrapper>
  )
}

export default Spinner;

const spin = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
`

const SpinnerWrapper = styled.div`
    position: relative;
    //top: 140px;
    display: flex;
    justify-content: center;
    align-items: center;
`

const Loader = styled.div`
    width: 64px;
    height: 64px;
    border: 5px solid #DA2538;
    border-top: 5px solid #fff;
    border-radius: 50%;
    animation: ${spin} 0.5s linear infinite;
`