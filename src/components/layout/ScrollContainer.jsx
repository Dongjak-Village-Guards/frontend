import styled from "styled-components";

const ScrollContainer = styled.div`
  position: absolute;
  top: ${({ offsetTop = 0 }) => `${offsetTop}px`};
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
  box-sizing: border-box;

  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #ccc;
  }

  @media (max-width: 500px) {
    &::-webkit-scrollbar {
      width: 0;
    }
  }
`;

export default ScrollContainer;