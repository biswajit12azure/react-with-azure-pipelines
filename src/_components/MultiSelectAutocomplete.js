import React, { useEffect } from 'react';
import { FormControl, TextField, InputAdornment, Autocomplete } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import { createFilterOptions } from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import ErrorIcon from '@mui/icons-material/Error';

const MultiSelectAutocomplete = ({ options, onChange, label, error, helperText, name, value }) => {
// Convert comma-separated value to array of selected options
const selectedOptions = value
? value.split(',').map(val => options.find(option => option.value.toString() === val))
: [];

const handleSelectAll = () => {
if (selectedOptions.length === options.length) {
  onChange('');
} else {
  onChange(options.map(option => option.value).join(','));
}
};

const handleOptionChange = (checkedValue, isChecked) => {
let filteredValue;
if (isChecked) {
  filteredValue = [...selectedOptions, options.find(option => option.value.toString() === checkedValue)];
} else {
  filteredValue = selectedOptions.filter(option => option.value.toString() !== checkedValue);
}
filteredValue = filteredValue.filter(option => option.value.toString() !== 'Select All');
onChange(filteredValue.map(option => option.value).join(','));
};

const handleChange = (event, value, reason) => {
if (reason === 'clear') {
  onChange('');
} else if (reason === 'removeOption') {
  const removedValue = value.map(option => option.value.toString());
  const filteredValue = selectedOptions.filter(option => removedValue.includes(option.value));
  onChange(filteredValue.map(option => option.value).join(','));
} else {
  const checkedValue = event.target.value;
  const isChecked = event.target.checked;
  if (checkedValue === 'Select All') {
    handleSelectAll();
  } else {
    handleOptionChange(checkedValue, isChecked);
  }
}
};

const isOptionSelected = (option) => {
return selectedOptions.some(selectedOption => selectedOption.value === option.value);
};

return (
<FormControl fullWidth margin="normal">
  <Autocomplete
    name={name}
    multiple
    options={[{ label: 'Select All', value: 'Select All' }, ...options]}
    disableCloseOnSelect
    getOptionLabel={(option) => option?.label}
    filterOptions={createFilterOptions({ matchFrom: 'start' })}
    renderOption={(props, option) => {
      const isSelected = option.value === 'Select All' ? selectedOptions.length === options.length : isOptionSelected(option);
      return (
        <li  {...props}>
          <Checkbox
            name={name}
            style={{ marginRight: 8 }}
            checked={isSelected}
            value={option.value}
            onChange={(e) => handleChange(e, null, null)}
          />
          {option?.label}
        </li>
      );
    }}
    renderInput={(params) => (
      <TextField
        {...params}
        name={name}
        label={label}
        placeholder="Search options"
        error={!!error}
        helperText={helperText}
        slotProps={{
          input: {
            ...params.InputProps,
            endAdornment: (
              <>
                {params.InputProps.endAdornment}
                {error && (
                  <InputAdornment position="end">
                    <ErrorIcon style={{ color: 'red' }} />
                  </InputAdornment>
                )}
              </>
            ),
          },
        }}
      />
    )}
    renderTags={(value, getTagProps) =>
      value.length > 1
        ? <Chip label={`${value.length} options selected`} />
        : value.map((option, index) => (
          <Chip label={option?.label} {...getTagProps({ index })} />
        ))
    }
    value={selectedOptions}
    onChange={handleChange}
  />
</FormControl>
);
};

export default MultiSelectAutocomplete;