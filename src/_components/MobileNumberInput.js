import React from 'react';
import { FormControl, InputLabel, OutlinedInput, InputAdornment, FormHelperText } from '@mui/material';
import { Controller } from 'react-hook-form';
import InputMask from 'react-input-mask';
import ErrorIcon from '@mui/icons-material/Error';

const MobileNumberInput = ({ control, name, label, rules, errors, handleBlur, handleFocus }) => (
    <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => (
            <InputMask
                mask="999-999-9999"
                maskChar=""
                value={field.value}
                onChange={field.onChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
            >
                {(inputProps) => (
                    <FormControl variant="outlined" fullWidth margin="normal" error={!!errors[name]}>
                        <InputLabel htmlFor={name}>{label}</InputLabel>
                        <OutlinedInput
                            {...inputProps}
                            id={name}
                            name={name}
                            endAdornment={
                                errors[name] ? (
                                    <InputAdornment position="end">
                                        <ErrorIcon style={{ color: 'red' }} />
                                    </InputAdornment>
                                ) : null
                            }
                            label={label}
                        />
                        <FormHelperText>{errors[name]?.message}</FormHelperText>
                    </FormControl>
                )}
            </InputMask>
        )}
    />
);

export default MobileNumberInput;