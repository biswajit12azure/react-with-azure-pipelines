import React, { useState, useEffect } from 'react';
import { PasswordCheck, CustomFormControl, MobileNumberInput, PasswordInput, AutocompleteInput } from '_components';
import { Typography } from '@mui/material';

const PersonalDetails = ({ isPasswordValid, register, errors, watch, control, trigger, setIsPasswordValid, portalData, portalList }) => {
    const [showPasswordCheck, setShowPasswordCheck] = useState(false);

    const Password = watch('Password', '');
    const FullName = watch('FullName', '');

    useEffect(() => {
        if (errors.Password) {
            setShowPasswordCheck(true);
        } else {
            setShowPasswordCheck(false);
        }
    }, [errors.Password]);

    const handlePasswordFocus = () => {
        if (!isPasswordValid) {
            setShowPasswordCheck(true);
        }
    };

    const handleBlur = async (e) => {
        const fieldName = e.target.name;
        await trigger(fieldName);
    };

    const handlePasswordValidation = (isValid) => {
        setIsPasswordValid(isValid);
        if (isValid) {
            setShowPasswordCheck(false);
        }
    };

    return (
        <>
            <Typography component="div" className='passwordcheck mobile-padding'>
                <AutocompleteInput
                    control={control}
                    name="PortalId"
                    label="Select Portal"
                    options={portalData}
                    error={!!errors.PortalId}
                    helperText={errors.PortalId?.message}
                    handleBlur={handleBlur}
                    trigger={trigger}
                 //   onChange={handlePortalChange}
                />
            </Typography>
            <CustomFormControl
                id="FullName"
                label="Full Name"
                type="text"
                register={register}
                errors={errors}
                handleBlur={handleBlur}
            />
            <CustomFormControl
                id="CompanyName"
                label="Company Name"
                type="text"
                register={register}
                errors={errors}
                handleBlur={handleBlur}
            />
            <CustomFormControl
                id="EmailAddress"
                label="Email Address"
                type="text"
                register={register}
                errors={errors}
                handleBlur={handleBlur}
            />
            <MobileNumberInput
                control={control}
                name="MobileNumber"
                label="Phone Number"
                rules={{ required: 'Phone Number is required' }}
                errors={errors}
                handleBlur={handleBlur}
            />
            <Typography component="div" className='passwordcheck'>
                <PasswordInput
                    control={control}
                    name="Password"
                    label="Password"
                    rules={{ required: 'Password is required' }}
                    errors={errors}
                    handleBlur={handleBlur}
                    handleFocus={handlePasswordFocus}
                    isPasswordValid={isPasswordValid}
                />
                {showPasswordCheck && (
                    <PasswordCheck password={Password} userName={FullName} onValidationChange={handlePasswordValidation} />
                )}
            </Typography>

            
        </>
    );
};

export default PersonalDetails;