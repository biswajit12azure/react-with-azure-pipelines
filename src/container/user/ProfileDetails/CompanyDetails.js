import React from 'react';
import Grid from "@material-ui/core/Grid";
import { AutocompleteInput, CustomFormControl,CustomFormControlNum } from '_components';

const CompanyDetails = ({ register, errors, control,trigger, stateData, handleBlur, isDisabled }) => {
    return <>
        <CustomFormControl
            id="CompanyName"
            label="Company Name"
            type="text"
            register={register}
            errors={errors}
            handleBlur={handleBlur}
            //disable={isDisabled || false}
        />
        {/* <CustomFormControl
            id="TaxIdentificationNumber"
            label="Tax Identification Number"
            type="number"
            register={register}
            errors={errors}
            handleBlur={handleBlur}
            disable={isDisabled || false}
        /> */}
        <CustomFormControlNum
            id="TaxIdentificationNumber"
            label="Tax Identification Number"
            type="text"
            register={register}
            errors={errors}
            handleBlur={handleBlur}
            maxLength={9}
            onlyNumbers={true}
            disable={isDisabled || false}
        />
        <CustomFormControl
            id="CompanyStreetAddress1"
            label="Street Address"
            type="text"
            register={register}
            errors={errors}
            handleBlur={handleBlur}
            disable={isDisabled || false}
        />
        <CustomFormControl
            id="CompanyCity"
            label="City"
            type="text"
            register={register}
            errors={errors}
            handleBlur={handleBlur}
            disable={isDisabled || false}
        />
        <Grid container spacing={3} >
            <Grid item xs={12} sm={12} md={6} className="Personal-Information marbottom0 selecticon  CompanyDetails passwordcheck">
                <AutocompleteInput
                    control={control}
                    name="CompanyState"
                    label="State"
                    options={stateData}
                    error={!!errors.CompanyState}
                    helperText={errors.CompanyState?.message}
                    handleBlur={handleBlur}
                    trigger={trigger}
                    disabled={isDisabled || false}
                />
                </Grid>
                <Grid item xs={12} sm={12} md={6} className="Personal-Information marbottom0  CompanyDetails">
                {/* <CustomFormControl
                    id="CompanyZipCode"
                    label="Zip Code"
                    type="number"
                    register={register}
                    errors={errors}
                    handleBlur={handleBlur}
                    disable={isDisabled || false}
                /> */}
                <CustomFormControlNum
                    id="CompanyZipCode"
                    label="Zip Code"
                    type="text"
                    register={register}
                    errors={errors}
                    handleBlur={handleBlur}
                    maxLength={5}
                    onlyNumbers={true}
                    disable={isDisabled || false}
                />
            </Grid>  
           
        </Grid>
    </>
};

export default CompanyDetails;