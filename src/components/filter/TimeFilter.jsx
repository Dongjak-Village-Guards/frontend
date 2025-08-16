import React from 'react';
import styled from 'styled-components';

// 현재 시간의 다음 정각을 계산하는 함수
const getNearestHour = (currentTime) => {
  const [currentHour, currentMinute] = String(currentTime).split(':').map(Number);
  
  // 현재가 정각이면 다음 시간, 아니면 다음 정각
  const nextHour = currentMinute === 0 ? (currentHour + 1) % 24 : (currentHour + 1) % 24;
  
  return `${String(nextHour).padStart(2, '0')}:00`;
};

// 현재 시간 이후부터 12시간, 1시간 단위로 생성
const generateTimeOptions = (currentTime) => {
  const [currentHour, currentMinute] = String(currentTime).split(':').map(Number);
  
  const result = [];
  // 다음 정각부터 시작 (현재가 정각이면 그 다음 시간)
  let startHour = currentMinute === 0 ? (currentHour + 1) % 24 : (currentHour + 1) % 24;
  
  for (let i = 0; i < 12; i++) {
    const hour = (startHour + i) % 24;
    result.push(`${String(hour).padStart(2, '0')}:00`);
  }
  
  return result;
};

const TimeFilter = ({ currentTime, selectedTime, onTimeSelect, onClose }) => {
  const handleTimeClick = (time) => {
    onTimeSelect(time);
    onClose();
  };

  // 선택된 시간을 표시 형식으로 변환 (25~36 → 01:00~12:00)
  const getDisplayTime = (time) => {
    if (!time) return '';
    const [hour, minute] = time.split(':').map(Number);
    const displayHour = hour % 24; // 25~36을 1~12로 변환
    return `${String(displayHour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  };

  return (
    <TimeList>
      {generateTimeOptions(getNearestHour(currentTime)).map((time) => (
        <TimeItem
          key={time}
          onClick={() => handleTimeClick(time)}
          $selected={getDisplayTime(selectedTime) === time}
          aria-label={`시간 ${time} 선택`}
        >
          {time}
        </TimeItem>
      ))}
    </TimeList>
  );
};

export default TimeFilter;

const TimeList = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
`;

const TimeItem = styled.button`
  padding: 12px 16px;
  border: none;
  border-bottom: 1px solid #CCC;
  background: #fff;
  font-size: 15px;
  display: flex;
  justify-content: flex-start;
  color: ${props => props.$selected ? '#DA2538' : '#000'};
  font-weight: ${props => props.$selected ? '600' : '400'};

  &:hover {
    color: #DA2538;
  }

  &:last-child {
    border-bottom: none;
  }
`;