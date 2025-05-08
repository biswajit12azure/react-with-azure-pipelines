import React from 'react';
import { FormControl, TextField, InputAdornment, Autocomplete } from '@mui/material';
import { Controller } from 'react-hook-form';
import ErrorIcon from '@mui/icons-material/Error';

const AutocompleteInput = ({ control, trigger, name, value, label, options,disabled, error, helperText, handleBlur, onFocus, onChange }) => {
   return ( <FormControl fullWidth margin="normal">
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <Autocomplete
                    name={name}
                    disablePortal
                    selectOnFocus
                    clearOnBlur
                    options={options}
                    disabled={disabled || undefined}
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value) => option.value === value}
                    value={options?.find(option => option.value === (value || field.value)) || null}
                    onChange={(e, newValue) => {
                        const newValueOrNull = newValue ? newValue.value : null;
                        field.onChange(newValueOrNull);
                        if (trigger) trigger(name);
                        if (onChange) onChange(e, newValueOrNull);
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            name={name}
                            label={label}
                            error={!!error}
                            helperText={helperText}
                            onBlur={(e) => {
                                field.onBlur(e);
                                if (handleBlur) handleBlur(e);
                            }}
                            onFocus={onFocus}
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
                />
            )}
        />
    </FormControl>
)
}

export default AutocompleteInput;