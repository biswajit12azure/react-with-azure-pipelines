import React from 'react';
import { TextField } from '@mui/material';

const AutocompleteTableInput = ({ value, onChange, label, error, helperText,mapping = [] }) => {
      // Finding the label for the current value
  const displayLabel = mapping.find(item => item.value === value)?.label || '';
  return (
    <TextField
      value={value}
      onChange={(event) => {
        const newValue = mapping.find(item => item.label === event.target.value)?.value || event.target.value;
        onChange(newValue); // Pass the ID back to the parent
      }}
      error={error}
      helperText={helperText}
      fullWidth
    />
  );
};

export default AutocompleteTableInput;