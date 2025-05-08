import React from 'react';
import TextField from '@mui/material/TextField';
import { Controller } from 'react-hook-form';

const CustomTextFieldInput = ({ control, name, label, rules, defaultValue, error, helperText, ...props }) => {
    return (
        <Controller
            name={name}
            control={control}
            defaultValue={defaultValue}
            rules={rules}
            render={({ field }) => (
                <TextField
                    {...field}
                    label={label}
                    error={error}
                    helperText={helperText}
                    variant="outlined"
                    fullWidth
                    {...props}
                />
            )}
        />
    );
};

CustomTextFieldInput.defaultProps = {
    error: false,
    helperText: '',
};

export default CustomTextFieldInput;