import styled from 'styled-components';

// Styled Components
export const TestContainer = styled.div`
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

export const TestTitle = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 24px;
  font-weight: 600;
`;

export const TestButton = styled.button`
  width: 100%;
  padding: 16px;
  background: #4285f4;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover:not(:disabled) {
    background: #3367d6;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

export const LoadingMessage = styled.div`
  text-align: center;
  margin: 20px 0;
  color: #666;
  font-style: italic;
`;

export const ResultContainer = styled.div`
  margin: 20px 0;
  padding: 16px;
  background: #f0f9ff;
  border: 1px solid #0ea5e9;
  border-radius: 8px;
`;

export const ResultTitle = styled.h3`
  color: #0c4a6e;
  margin-bottom: 12px;
  font-size: 18px;
`;

export const ResultItem = styled.div`
  margin: 8px 0;
  color: #0c4a6e;

  pre {
    background: #fff;
    padding: 8px;
    border-radius: 4px;
    overflow-x: auto;
    font-size: 12px;
  }
`;

export const ErrorContainer = styled.div`
  margin: 20px 0;
  padding: 16px;
  background: #fef2f2;
  border: 1px solid #ef4444;
  border-radius: 8px;
`;

export const ErrorTitle = styled.h3`
  color: #991b1b;
  margin-bottom: 12px;
  font-size: 18px;
`;

export const ErrorItem = styled.div`
  margin: 8px 0;
  color: #991b1b;

  pre {
    background: #fff;
    padding: 8px;
    border-radius: 4px;
    overflow-x: auto;
    font-size: 12px;
  }
`;

export const InfoContainer = styled.div`
  margin-top: 30px;
  padding: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
`;

export const InfoTitle = styled.h4`
  color: #475569;
  margin-bottom: 12px;
  font-size: 16px;
`;

export const InfoItem = styled.div`
  margin: 4px 0;
  color: #64748b;
  font-size: 14px;
`; 