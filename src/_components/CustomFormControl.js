import { FormControl, InputLabel, OutlinedInput, InputAdornment, FormHelperText } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
const CustomFormControl = ({ id,disable, label, type, register, errors, handleBlur, handleFocus, maxLength}) => (
    <FormControl  id={id} variant="outlined" fullWidth margin="normal"  error={!!errors[id]}>
        <InputLabel htmlFor={id}>{label}</InputLabel>
        <OutlinedInput
            id={id}
            type={type}
            {...register(id, {
                required: type === 'number' ? `${label} is required` : `${label} cannot be empty`,
                maxLength: maxLength
                    ? { value: maxLength, message: `${label} cannot exceed ${maxLength} characters` }
                    : undefined,
                validate: (value) => {
                    if (type === 'number' && value && isNaN(value)) {
                        return 'Please enter a valid number';
                    }
                    return true;
                },
            })}
            onBlur={handleBlur}
            onFocus={handleFocus}
            disabled={disable || false}
            inputProps={{ maxLength: maxLength }}
            endAdornment={
                errors[id] ? (
                    <InputAdornment position="end">
                        <ErrorIcon style={{ color: 'red' }} />
                    </InputAdornment>
                ) : null
            }
            label={label}           
        />
        <FormHelperText>{errors[id]?.message}</FormHelperText>
    </FormControl>
);

export default CustomFormControl;