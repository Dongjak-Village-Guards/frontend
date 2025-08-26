import React from 'react';
import { Button } from './TimeToggle.styles';

const TimeToggle = ({ label, onClick }) => {
  return (
    <Button type="button" onClick={onClick} aria-pressed={true}>
      <span>{label}</span>
    </Button>
  );
};

export default TimeToggle; 