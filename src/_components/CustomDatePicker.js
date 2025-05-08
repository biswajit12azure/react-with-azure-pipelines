import React from 'react';
import { Controller } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { FormControl, InputAdornment } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';

const CustomDatePicker = ({
  control,
  trigger,
  name,
  minDate,
  maxDate,
  label,
  error,
  helperText,
  handleBlur
}) => {
  return (
    <FormControl fullWidth margin="normal">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <DatePicker
              {...field}
              label={label}
              value={field.value || null}
              onChange={(newValue) => {
                field.onChange(newValue);
                if (trigger) trigger(name);
              }}
              minDate={minDate}
              maxDate={maxDate}
              slotProps={{
                textField: {
                  name,
                  variant: 'outlined',
                  onBlur: (e) => {
                    field.onBlur(e);
                    if (handleBlur) {
                      handleBlur(e);
                    }
                  },
                  helperText,
                  error: !!error,
                  InputProps: (params) => {
                    const endAdornment = (
                      <>
                        {params.endAdornment}
                        {error && (
                          <InputAdornment position="end">
                            <ErrorIcon style={{ color: 'red' }} />
                          </InputAdornment>
                        )}
                      </>
                    );

                    return {
                      ...params,
                      endAdornment,
                    };
                  }
                }
              }}
            />
          )}
        />
      </LocalizationProvider>
    </FormControl>
  );
};

export default CustomDatePicker;
