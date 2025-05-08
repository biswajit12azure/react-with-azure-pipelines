import { FormControl, InputLabel, OutlinedInput, InputAdornment, FormHelperText } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';

const CustomNumberField = ({ id, label, register, errors, handleBlur, disable, maxLength }) => {
    const handleKeyDown = (e) => {
        if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
            e.preventDefault();
        }
    };

    return (
        <FormControl id={id} variant="outlined" fullWidth margin="normal" error={!!errors[id]}>
            <InputLabel htmlFor={id}>{label}</InputLabel>
            <OutlinedInput
                id={id}
                type="text"
                {...register(id, {
                    required: {
                        value: true,
                        message: `${label} is required`
                    },
                    pattern: {
                        value: /^[0-9]*$/,
                        message: 'Only numeric values are allowed'
                    },
                    maxLength: {
                        value: maxLength || 50, 
                        message: `Maximum length is ${maxLength || 50} characters`
                    }
                })}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                disabled={disable || false}
                inputProps={{ maxLength: maxLength || 50 }} 
                endAdornment={
                    errors[id] ? (
                        <InputAdornment position="end">
                            <ErrorIcon style={{ color: 'red' }} />
                        </InputAdornment>
                    ) : null
                }
                label={label}
            />
             <FormHelperText>{(errors[id]?.message?'ServiceProvider must be a `number` type':'')}</FormHelperText>
        </FormControl>
    );
};

export default CustomNumberField;
