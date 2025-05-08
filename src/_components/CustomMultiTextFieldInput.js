import { TextField } from '@mui/material';

const CustomMultiTextFieldInput = ({ id, label, minRows,maxRows, register, errors, disabled }) => {
    return (
        <TextField
            id={id}
            label={label}
            multiline
            minRows={minRows}
            maxRows={maxRows}
            {...register(id, { required: `${label} is required` })} // Registering the field
            error={!!errors[id]} // Checking for errors
            helperText={errors[id]?.message} // Displaying error message
            fullWidth
            variant="outlined"
            disabled={disabled}
        />
    );
};

export default CustomMultiTextFieldInput;
