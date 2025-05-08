import React, { useState } from 'react';
import { FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton, FormHelperText } from '@mui/material';
import { Controller } from 'react-hook-form';
import ErrorIcon from '@mui/icons-material/Error';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const PasswordInput = ({ control, name, label, rules, errors, handleBlur, handleFocus, isPasswordValid }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [touched, setTouched] = useState(false);

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = (event) => event.preventDefault();

    const handleBlurWithTouch = (e) => {
        setTouched(true);
        handleBlur(e);
    };

    return (
        <Controller
            name={name}
            control={control}
            defaultValue=""
            rules={rules}
            render={({ field }) => (
                <FormControl variant="outlined" fullWidth margin="normal"  error={!!errors[name] || (!isPasswordValid && touched)}>
                    <InputLabel htmlFor={name}>{label}</InputLabel>
                    <OutlinedInput
                        {...field}
                        id={name}
                        type={showPassword ? 'text' : 'password'}
                        onBlur={handleBlurWithTouch}
                        onFocus={handleFocus}
                        endAdornment={
                            <InputAdornment position="end">
                                {(errors[name] || (!isPasswordValid && touched)) && (
                                    <ErrorIcon style={{ color: 'red' }} />
                                )}
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                        label={label}
                    />
                    <FormHelperText>{errors[name]?.message}</FormHelperText>
                </FormControl>
            )}
        />
    );
};

export default PasswordInput;