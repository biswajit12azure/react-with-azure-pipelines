import React from "react";
import { FormControl,Select,OutlinedInput ,MenuItem  } from '@mui/material';


const DropdownTableInput=({ label, value, onChange, options,disabled})=>{
    return(
        <FormControl sx={{ width: 200 }}>
        <Select
          displayEmpty
          disabled={disabled || undefined}
          value={value || ''} // Default to empty if no selection
          onChange={(event) => onChange(event.target.value)} // Call parent's handler
          input={<OutlinedInput />}
          renderValue={(selected) => {
            if (!selected) {
              return <em>{label}</em>;
            }
            const selectedOption = options.find((item) => item.value === selected);
            return selectedOption ? selectedOption.label : 'Select an option';
          }}
        >
          <MenuItem value="">
            <em>{label}</em>
          </MenuItem>
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
   
    )
}

export default DropdownTableInput;