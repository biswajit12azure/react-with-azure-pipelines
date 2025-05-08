import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, Chip, FormHelperText, Popper, TextField } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';

const MultiSelectMenu = React.memo(({ options, onChange, label, error, helperText, name, value, disabled,style }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const selectedOptions = value ? value.split(',') : [];

  const handleSelectAll = () => {
    if (selectedOptions.length === options.length) {
      onChange('');
    } else {
      onChange(options.map(option => option.value).join(','));
    }
  };

  const handleChange = (event) => {
    const { value } = event.target;
    if (value.includes('Select All')) {
      handleSelectAll();
    } else {
      const newValue = value.includes('Select All')
        ? options.map(option => option.value)
        : value;
      onChange(newValue.join(','));
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLabelForValue = (value) => {
    const option = options.find(option => option.value.toString() === value);
    return option ? option.label : value;
  };

  return (
    <FormControl fullWidth margin="normal" error={!!error} sx={{ height: '45px' }}>
      <Select
        multiple
        displayEmpty
        disabled={disabled || undefined}
        value={selectedOptions}
        onChange={handleChange}
        renderValue={(selected) => {
          if (selected.length === 0) {
            return <em>{label}</em>;
          }
          return selected.length > 1 
            ? <Chip label={`${selected.length} options selected`} /> 
            : selected.map(value => getLabelForValue(value)).join(', ');
        }}
        MenuProps={{
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
          transformOrigin: {
            vertical: 'top',
            horizontal: 'left',
          },
          getContentAnchorEl: null,
          PopperComponent: (props) => <Popper {...props} disablePortal placement="bottom-start" />,
          disableScrollLock: true,
        }}
        sx={style}
      >
        <MenuItem value="Select All" sx={{ height: '35px' }}>
          <Checkbox checked={selectedOptions.length === options.length} />
          <ListItemText primary="Select All" />
        </MenuItem>
        {filteredOptions.map((option) => (
          <MenuItem key={option.value} value={option.value} sx={{ height: '35px' }}>
            <Checkbox checked={selectedOptions.includes(option.value.toString())} />
            <ListItemText primary={option.label} />
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
      {error && <ErrorIcon style={{ color: 'red' }} />}
    </FormControl>
  );
});

MultiSelectMenu.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    label: PropTypes.string.isRequired,
  })).isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
};

MultiSelectMenu.defaultProps = {
  error: false,
  helperText: '',
  name: '',
  value: '',
};

export default MultiSelectMenu;
