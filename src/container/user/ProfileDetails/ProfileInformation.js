import React from 'react';
import Grid from "@material-ui/core/Grid";
import { AutocompleteInput, MobileNumberInput, CustomFormControl } from '_components';
import { Typography } from '@mui/material';

const ProfileInformation = ({ register,
    stateData,
    control,
    errors,
    trigger,
    handleBlur,
}) => {
    return (
        <Grid container className='proflepage'>
            {/* <Grid item xs={12} sm={12} md={12} className='supplierDetailes'> */}

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
                    id="EmailID"
                    label="Email Address"
                    type="text"
                    register={register}
                    errors={errors}
                    handleBlur={handleBlur}
                    disable={true}
                />

                <MobileNumberInput
                    control={control}
                    name="MobileNumber"
                    label="Phone Number"
                    rules={{ required: 'Phone Number is required' }}
                    errors={errors}
                    handleBlur={handleBlur}
                />

                <CustomFormControl
                    id="Address"
                    label="Address"
                    type="text"
                    register={register}
                    errors={errors}
                    handleBlur={handleBlur}
                />

                <Typography component="div" className="passwordcheck border-none">
                    <AutocompleteInput
                        id="StateID"
                        control={control}
                        name="StateID"
                        label="State"
                        options={stateData}
                        error={!!errors.StateID}
                        helperText={errors.StateID?.message}
                        handleBlur={handleBlur}
                        trigger={trigger}
                    />
                </Typography>

                <CustomFormControl
                    id="ZipCode"
                    label="ZipCode"
                    type="text"
                    register={register}
                    errors={errors}
                    handleBlur={handleBlur}
                />
            {/* </Grid> */}
        </Grid>

        // <Grid container spacing={2} className='proflepage'>
        //     <Grid item xs={12} sm={12} md={8}>
        //     <Grid container spacing={2}>
        //     <Grid item xs={12} sm={6} md={6} className='supplierDetailes'>
        //         <CustomFormControl
        //             id="FullName"
        //             label="Full Name"
        //             type="text"
        //             register={register}
        //             errors={errors}
        //             handleBlur={handleBlur}
        //         />
        //     </Grid>
        //     <Grid item xs={12} sm={6} md={6} className='supplierDetailes'>
        //         <CustomFormControl
        //             id="CompanyName"
        //             label="Company Name"
        //             type="text"
        //             register={register}
        //             errors={errors}
        //             handleBlur={handleBlur}
        //         />
        //     </Grid>
        //     <Grid item xs={12} sm={6} md={6} className='supplierDetailes'>
        //         <CustomFormControl
        //             id="EmailID"
        //             label="Email Address"
        //             type="text"
        //             register={register}
        //             errors={errors}
        //             handleBlur={handleBlur}
        //             disable={true}
        //         />
        //     </Grid>
        //     <Grid item xs={12} sm={6} md={6} className='supplierDetailes'>
        //         <MobileNumberInput
        //             control={control}
        //             name="MobileNumber"
        //             label="Phone Number"
        //             rules={{ required: 'Phone Number is required' }}
        //             errors={errors}
        //             handleBlur={handleBlur}
        //         />
        //     </Grid>
        //     <Grid item xs={12} sm={6} md={6} className='supplierDetailes'>
        //         <CustomFormControl
        //             id="Address"
        //             label="Address"
        //             type="text"
        //             register={register}
        //             errors={errors}
        //             handleBlur={handleBlur}
        //         />
        //     </Grid>
        //     <Grid item xs={12} sm={6} md={3} className='supplierDetailes'>
        //         <Typography component="div" className="passwordcheck border-none">
        //             <AutocompleteInput
        //                 id="StateID"
        //                 control={control}
        //                 name="StateID"
        //                 label="State"
        //                 options={stateData}
        //                 error={!!errors.StateID}
        //                 helperText={errors.StateID?.message}
        //                 handleBlur={handleBlur}
        //                 trigger={trigger}
        //             />
        //         </Typography>
        //     </Grid>
        //     <Grid item xs={12} sm={6} md={3} className='supplierDetailes'>
        //         <CustomFormControl
        //             id="ZipCode"
        //             label="ZipCode"
        //             type="text"
        //             register={register}
        //             errors={errors}
        //             handleBlur={handleBlur}
        //         />
        //     </Grid>
        //     </Grid>
        //     </Grid>
        //     {/* <Grid item xs={12} sm={6} md={4} className='supplierDetailes'>
        //         <CustomFormControl
        //             id="TaxIdentificationNumber"
        //             label="Tax Identification Number"
        //             type="text"
        //             register={register}
        //             errors={errors}
        //             handleBlur={handleBlur}
        //         />
        //     </Grid> */}
        // </Grid>
    );
}

export default ProfileInformation;