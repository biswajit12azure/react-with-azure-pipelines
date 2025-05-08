import React from 'react';
import { Autocomplete, TextField } from '@mui/material';

const AutocompleteTable = ({ value, onChange, options, error, helperText }) => {

  return (
    <Autocomplete
      value={options.find(option => option?.value === value) || null}
      onChange={(event, newValue) => onChange(newValue)}
      options={options}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, value) => option?.value === value}
      renderInput={(params) => (
        <TextField
          {...params}
          error={error}
          helperText={helperText}
        />
      )}
    />
  );
};

export default AutocompleteTable;