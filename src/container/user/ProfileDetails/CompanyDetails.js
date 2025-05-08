import React, { useState } from 'react';
import Grid from "@material-ui/core/Grid";
import { AutocompleteInput, CustomFormControl } from '_components';

const CompanyDetails = ({ register, errors, control,trigger, stateData, handleBlur }) => {
    return <>
        <CustomFormControl
            id="CompanyName"
            label="Company Name"
            type="text"
            register={register}
            errors={errors}
            handleBlur={handleBlur}
        />
        <CustomFormControl
            id="TaxIdentificationNumber"
            label="Tax Identification Number"
            type="text"
            register={register}
            errors={errors}
            handleBlur={handleBlur}
        />
        <CustomFormControl
            id="CompanyStreetAddress1"
            label="Street Address"
            type="text"
            register={register}
            errors={errors}
            handleBlur={handleBlur}
        />
        <CustomFormControl
            id="CompanyCity"
            label="City"
            type="text"
            register={register}
            errors={errors}
            handleBlur={handleBlur}
        />
        <Grid container spacing={3} >
            <Grid item xs={12} sm={12} md={6} className="Personal-Information CompanyDetails passwordcheck">
                <AutocompleteInput
                    control={control}
                    name="CompanyState"
                    label="State"
                    options={stateData}
                    error={!!errors.CompanyState}
                    helperText={errors.CompanyState?.message}
                    handleBlur={handleBlur}
                    trigger={trigger}
                />
                </Grid>
                <Grid item xs={12} sm={12} md={6} className="Personal-Information CompanyDetails">
                <CustomFormControl
                    id="CompanyZipCode"
                    label="Zip Code"
                    type="text"
                    register={register}
                    errors={errors}
                    handleBlur={handleBlur}
                />
            </Grid>  
           
        </Grid>
    </>
};

export default CompanyDetails;