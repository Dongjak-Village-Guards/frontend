import styled from 'styled-components';

// Styled Components
export const TestContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

export const TestTitle = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 30px;
`;

export const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
`;

export const TestButton = styled.button`
  padding: 12px 24px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: background 0.2s ease;
  
  &:hover:not(:disabled) {
    background: #0056b3;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

export const CategoryGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
`;

export const CategoryLabel = styled.span`
  font-weight: 500;
  color: #666;
  margin-right: 10px;
`;

export const CategoryButton = styled.button`
  padding: 8px 16px;
  background: ${props => props.$active ? '#28a745' : '#f8f9fa'};
  color: ${props => props.$active ? 'white' : '#333'};
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: ${props => props.$active ? '#218838' : '#e9ecef'};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const ErrorMessage = styled.div`
  padding: 12px;
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 6px;
  margin-bottom: 20px;
`;

export const StoreList = styled.div`
  margin-bottom: 30px;
  
  h3 {
    color: #333;
    margin-bottom: 15px;
  }
`;

export const StoreItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 10px;
  background: white;
  transition: box-shadow 0.2s ease;
  
  &:hover {
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
`;

export const StoreInfo = styled.div`
  flex: 1;
`;

export const StoreName = styled.h4`
  margin: 0 0 5px 0;
  color: #333;
  font-size: 16px;
`;

export const StoreCategory = styled.span`
  display: inline-block;
  padding: 4px 8px;
  background: #e9ecef;
  color: #495057;
  border-radius: 4px;
  font-size: 12px;
  margin-right: 10px;
`;

export const StoreAddress = styled.p`
  margin: 5px 0 0 0;
  color: #666;
  font-size: 14px;
`;

export const StoreActions = styled.div`
  display: flex;
  gap: 10px;
`;

export const DetailButton = styled.button`
  padding: 6px 12px;
  background: #17a2b8;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background 0.2s ease;
  
  &:hover {
    background: #138496;
  }
`;

export const StoreDetail = styled.div`
  margin-top: 30px;
  
  h3 {
    color: #333;
    margin-bottom: 15px;
  }
`;

export const DetailCard = styled.div`
  display: flex;
  gap: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  margin-bottom: 15px;
`;

export const DetailImage = styled.img`
  width: 200px;
  height: 150px;
  object-fit: cover;
  border-radius: 6px;
  background: #f8f9fa;
`;

export const DetailContent = styled.div`
  flex: 1;
`;

export const DetailName = styled.h2`
  margin: 0 0 10px 0;
  color: #333;
  font-size: 24px;
`;

export const DetailCategory = styled.p`
  margin: 5px 0;
  color: #666;
  font-size: 14px;
`;

export const DetailOwner = styled.p`
  margin: 5px 0;
  color: #666;
  font-size: 14px;
`;

export const DetailAddress = styled.p`
  margin: 5px 0;
  color: #666;
  font-size: 14px;
`;

export const DetailDescription = styled.p`
  margin: 10px 0;
  color: #333;
  line-height: 1.5;
`;

export const DetailStatus = styled.p`
  margin: 5px 0;
  font-weight: 500;
`;

export const DetailDates = styled.div`
  margin-top: 10px;
  font-size: 12px;
  color: #666;
  
  div {
    margin: 2px 0;
  }
`;

export const CloseButton = styled.button`
  padding: 8px 16px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s ease;
  
  &:hover {
    background: #5a6268;
  }
`; 