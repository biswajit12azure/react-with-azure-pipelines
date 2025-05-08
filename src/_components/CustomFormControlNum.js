
import {FormControl,InputLabel,OutlinedInput,InputAdornment,FormHelperText} from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';

const CustomFormControlNum = ({
  id,
  disable,
  label,
  type,
  register,
  errors,
  handleBlur,
  handleFocus,
  maxLength = 9, // default max length
}) => {
  return (
    <FormControl
      id={id}
      variant="outlined"
      fullWidth
      margin="normal"
      error={!!errors[id]}
    >
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <OutlinedInput
        id={id}
        type="text" // must be text to allow validation/filtering
        inputMode="numeric" // shows numeric keyboard on mobile
        {...register(id, {
          required: `${label} is required`,
          maxLength: {
            value: maxLength,
            message: `${label} cannot exceed ${maxLength} digits`,
          },
          validate: (value) => {
            if (!/^\d*$/.test(value)) {
              return `${label} must contain only digits`;
            }
            return true;
          },
        })}
        onBlur={handleBlur}
        onFocus={handleFocus}
        disabled={disable || false}
        inputProps={{
          maxLength: maxLength,
        }}
        onKeyDown={(e) => {
          // Prevent non-numeric key presses (except backspace, tab, arrows)
          const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
          if (
            !/^\d$/.test(e.key) &&
            !allowedKeys.includes(e.key)
          ) {
            e.preventDefault();
          }
        }}
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
};

export default CustomFormControlNum;
