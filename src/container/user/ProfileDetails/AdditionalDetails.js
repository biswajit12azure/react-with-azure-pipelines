import React from 'react';
import Grid from "@material-ui/core/Grid";
import { AutocompleteInput, CustomFormControl } from '_components';
const AdditionalDetails = ({ register, errors, control,trigger, stateData, handleBlur }) => {
    return <>
        <CustomFormControl
            id="FullName"
            label="Full Name"
            type="text"
            register={register}
            errors={errors}
            handleBlur={handleBlur}
        />
        <CustomFormControl
            id="HomeStreetAddress1"
            label="Street Address"
            type="text"
            register={register}
            errors={errors}
            handleBlur={handleBlur}
        />
        <CustomFormControl
            id="HomeCity"
            label="City"
            type="text"
            register={register}
            errors={errors}
            handleBlur={handleBlur}
        />
        <Grid container spacing={3}>
            <Grid item xs={12} sm={12} md={6} className="Personal-Information CompanyDetails passwordcheck">
                <AutocompleteInput
                    id="HomeState"
                    control={control}
                    name="HomeState"
                    label="State"
                    options={stateData}
                    error={!!errors.HomeState}
                    helperText={errors.HomeState?.message}
                    handleBlur={handleBlur}
                    trigger={trigger}
                />
                <CustomFormControl
                    id="DLNumber"
                    label="Driving License"
                    type="text"
                    register={register}
                    errors={errors}
                    handleBlur={handleBlur}
                />


            </Grid>
            <Grid item xs={12} sm={12} md={6} className="Personal-Information CompanyDetails passwordcheck">
                <CustomFormControl
                    id="HomeZipCode"
                    label="Zip Code"
                    type="text"
                    register={register}
                    errors={errors}
                    handleBlur={handleBlur}
                />
                <AutocompleteInput
                    id="DLState"
                    control={control}
                    name="DLState"
                    label="License State"
                    options={stateData}
                    error={!!errors.DLState}
                    helperText={errors.DLState?.message}
                    handleBlur={handleBlur}
                    trigger={trigger}
                />
            </Grid>
        </Grid>
    </>
};

export default AdditionalDetails;