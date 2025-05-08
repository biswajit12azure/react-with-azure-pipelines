import { FormControl, InputLabel, OutlinedInput, InputAdornment, FormHelperText } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
const CustomFormControl = ({ id,disable, label, type, register, errors, handleBlur, handleFocus }) => (
    <FormControl  id={id} variant="outlined" fullWidth margin="normal"  error={!!errors[id]}>
        <InputLabel htmlFor={id}>{label}</InputLabel>
        <OutlinedInput
            id={id}
            type={type}
            {...register(id, { required: `${label} is required` })}
            onBlur={handleBlur}
            onFocus={handleFocus}
            disabled={disable || false}
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