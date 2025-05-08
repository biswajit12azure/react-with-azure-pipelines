import React from 'react';
import Grid from "@material-ui/core/Grid";
import { AutocompleteInput, MobileNumberInput, MultiSelectInput, CustomFormControl,CustomDatePicker } from '_components';
import { Typography } from '@mui/material';
import dayjs from 'dayjs';

const SupplierDetails = ({ register,
    stateData,
    agencyData,
    classificationData,
    businessCategoryData,
    control,
    errors,
    trigger,
    setValue,
    handleBlur,
    handleClassificationChange,
    classification
}) => {

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={6} className='supplierDetailes'>
                <CustomFormControl
                    id="CompanyName"
                    label="Company Name"
                    type="text"
                    register={register}
                    errors={errors}
                    handleBlur={handleBlur}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={6} className='supplierDetailes'>
                <CustomFormControl
                    id="CompanyWebsite"
                    label="Company Website"
                    type="text"
                    register={register}
                    errors={errors}
                    handleBlur={handleBlur}
                />
            </Grid>

            <Grid item xs={12} sm={6} md={6} className='supplierDetailes'>
                <Typography component="div" className="passwordcheck border-none marbottom0 selecticon">
                    <AutocompleteInput
                        id="CategoryID"
                        name="CategoryID"
                        label="Business Category"
                        control={control}
                        options={businessCategoryData}
                        error={!!errors.CategoryID}
                        helperText={errors.CategoryID?.message}
                        handleBlur={handleBlur}
                        trigger={trigger}
                    />
                </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={6} className='supplierDetailes'>
                <Typography component="div" className="passwordcheck  border-none marbottom0 selecticon">
                    <MultiSelectInput
                        id="ClassificationID"
                        control={control}
                        name="ClassificationID"
                        label="Classification"
                        options={classificationData}
                        value={classification}
                        onChange={handleClassificationChange}
                        error={!!errors.ClassificationID}
                        helperText={errors.ClassificationID?.message}
                        handleBlur={handleBlur}
                        setValue={setValue}
                        trigger={trigger}
                    />
                </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={6} className='supplierDetailes'>
                <CustomFormControl
                    id="ServicesProductsProvided"
                    label="Services / Products Provided"
                    type="text"
                    register={register}
                    errors={errors}
                    handleBlur={handleBlur}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={6} className='supplierDetailes'>
            <Typography component="div" className="passwordcheck border-none SelectedDate">
                <CustomDatePicker 
            
                    id="ExpiryDate"
                    control={control}
                    name="ExpiryDate"
                    label="Expiry Date of the Certificate"
                    error={!!errors.ExpiryDate}
                    helperText={errors.ExpiryDate?.message}
                    handleBlur={handleBlur}
                    trigger={trigger}
                    minimumDate={dayjs()}
                />
                </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={6} className='supplierDetailes'>
                <Typography component="div" className="passwordcheck border-none marbottom0 selecticon">
                    <AutocompleteInput
                        id="AgencyID"
                        name="AgencyID"
                        label="Name of Agency"
                        control={control}
                        options={agencyData}
                        error={!!errors.AgencyID}
                        helperText={errors.AgencyID?.message}
                        handleBlur={handleBlur}
                        trigger={trigger}
                    />
                </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={6} className='supplierDetailes'>
                <Typography component="div" className="passwordcheck border-none marbottom0 selecticon">
                    <AutocompleteInput
                        id="AgencyStateID"
                        name="AgencyStateID"
                        label="Agency State"
                        control={control}
                        options={stateData}
                        error={!!errors.AgencyStateID}
                        helperText={errors.AgencyStateID?.message}
                        handleBlur={handleBlur}
                        trigger={trigger}
                    />
                </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={6} className='supplierDetailes'>
                <CustomFormControl
                    id="Title"
                    label="Title"
                    type="text"
                    register={register}
                    errors={errors}
                    handleBlur={handleBlur}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={6} className='supplierDetailes'>
                <CustomFormControl
                    id="ContactPerson"
                    label="Contact Person"
                    type="text"
                    register={register}
                    errors={errors}
                    handleBlur={handleBlur}
                />
            </Grid>
            <Grid item xs={12} sm={4} md={4} className='supplierDetailes'>
                <CustomFormControl
                    id="Email"
                    label="Email"
                    type="text"
                    register={register}
                    errors={errors}
                    handleBlur={handleBlur}
                />
            </Grid>
            <Grid item xs={12} sm={4} md={4} className='supplierDetailes'>
                <MobileNumberInput
                    control={control}
                    name="PhoneNumber"
                    label="Phone Number"
                    rules={{ required: 'Phone Number is required' }}
                    errors={errors}
                    handleBlur={handleBlur}
                />
            </Grid>
            <Grid item xs={12} sm={4} md={4} className='supplierDetailes'>
                <CustomFormControl
                    id="Fax"
                    label="Fax"
                    type="text"
                    register={register}
                    errors={errors}
                    handleBlur={handleBlur}
                />
            </Grid>
            <Grid item xs={12} sm={12} md={12} className='supplierDetailes'>
                <CustomFormControl
                    id="Street"
                    label="Address"
                    type="text"
                    register={register}
                    errors={errors}
                    handleBlur={handleBlur}
                />
            </Grid>
            <Grid item xs={12} sm={4} md={4} className='supplierDetailes'>
                <CustomFormControl
                    id="City"
                    label="City"
                    type="text"
                    register={register}
                    errors={errors}
                    handleBlur={handleBlur}
                />
            </Grid>
            <Grid item xs={12} sm={4} md={4} className='supplierDetailes'>
                <Typography component="div" className="passwordcheck border-none marbottom0 selecticon" >
                    <AutocompleteInput
                        id="State"
                        control={control}
                        name="State"
                        label="State"
                        options={stateData}
                        error={!!errors.State}
                        helperText={errors.State?.message}
                        handleBlur={handleBlur}
                        trigger={trigger}
                    />
                </Typography>
            </Grid>
            <Grid item xs={12} sm={4} md={4} className='supplierDetailes'>
                <CustomFormControl
                    id="ZipCode"
                    label="ZipCode"
                    type="text"
                    register={register}
                    errors={errors}
                    handleBlur={handleBlur}
                />
            </Grid>
        </Grid>
    );
};

export default SupplierDetails;