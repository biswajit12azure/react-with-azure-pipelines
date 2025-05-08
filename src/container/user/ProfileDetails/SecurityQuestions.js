import React, { useState } from 'react';
import { CustomFormControl,AutocompleteInput } from '_components';
import { selectOptions } from '_utils/tempData';

const SecurityQuestions = ({ id, register, errors, control, trigger }) => 
{   
    const [inputColors, setInputColors] = useState({});

    const handleBlur = async (e) => {
        const fieldName = e.target.name;
        await trigger(fieldName); 
        // const fieldError = errors[fieldName];
        // setInputColors(prevColors => ({
        //     ...prevColors,
        //     [fieldName]: !fieldError && e.target.value ? 'inputBackground' : ''
        // }));
    };
    
   return (
    
    <>
        <AutocompleteInput
            control={control}
            name="firstSecurityQuestion"
            label="First Security Question"
            options={selectOptions}
            error={!!errors.firstSecurityQuestion}
            helperText={errors.firstSecurityQuestion?.message}
            handleBlur={handleBlur}
            inputColor={inputColors['firstSecurityQuestion']}
            trigger={trigger}
        />
        <CustomFormControl
            id="firstSecurityAnswer"
            label="First Security Answer"
            type={id ? 'password' : 'text'}
            register={register}
            errors={errors}
            handleBlur={handleBlur}
            inputColors={inputColors}
        />
        <AutocompleteInput
            control={control}
            name="secondSecurityQuestion"
            label="Second Security Question"
            options={selectOptions}
            error={!!errors.secondSecurityQuestion}
            helperText={errors.secondSecurityQuestion?.message}
            handleBlur={handleBlur}
            inputColor={inputColors['secondSecurityQuestion']}
            trigger={trigger}
        />
        <CustomFormControl
            id="secondSecurityAnswer"
            label="Second Security Answer"
            type={id ? 'password' : 'text'}
            register={register}
            errors={errors}
            handleBlur={handleBlur}
            inputColors={inputColors}
        />
        <AutocompleteInput
            control={control}
            name="thirdSecurityQuestion"
            label="Third Security Question"
            options={selectOptions}
            error={!!errors.thirdSecurityQuestion}
            helperText={errors.thirdSecurityQuestion?.message}
            handleBlur={handleBlur}
            inputColor={inputColors['thirdSecurityQuestion']}
            trigger={trigger}
        />
        <CustomFormControl
            id="thirdSecurityAnswer"
            label="Third Security Answer"
            type={id ? 'password' : 'text'}
            register={register}
            errors={errors}
            handleBlur={handleBlur}
            inputColors={inputColors}
        />
    </>
);

};

export default SecurityQuestions;