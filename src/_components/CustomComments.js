import React from 'react';
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import { FormControl, FormHelperText, InputLabel } from '@mui/material';
import { styled } from '@mui/system';

const StyledTextarea = styled(BaseTextareaAutosize)(
    () => `
    box-sizing: border-box;
    width: 100%;
    min-height: 150px; 
    max-height: 300px; 
    font-family: 'Arial', sans-serif;
    font-size: 14px;
    line-height: 1.5;
    padding: 12px 14px;  
    border-radius: 8px;
    border: 1px solid #ccc;
    background: #fff;
    transition: border 0.2s ease-in-out;
    resize: both; 
    overflow: auto; 

    &:hover {
        border-color: #3399FF;
    }

    &:focus {
        border-color: #007FFF;
        box-shadow: 0 0 8px rgba(0, 127, 255, 0.5);
        outline: none;
    }

    &:focus-visible {
        outline: none;
    }
`
);

const CustomComments = ({ label, value, onChange, maxLength = 1000, placeholder = "Enter your comments..." }) => {
    return (
        <FormControl fullWidth margin="normal">
            <InputLabel shrink>{label}</InputLabel>

            <StyledTextarea
                value={value}
                onChange={onChange}  
                placeholder={placeholder}
                maxLength={maxLength}
                aria-label={label}
            />

            {/* <FormHelperText>
                {`${value.length}/${maxLength} characters`}
            </FormHelperText> */}
        </FormControl>
    );
};

export default CustomComments;


// export default CustomComments;
