import React from 'react';
import { CustomFormControl, MobileNumberInput } from '_components';
import { Typography } from '@mui/material';
import Grid from "@material-ui/core/Grid";

const CompanyPOC = ({ register, errors, control,handleBlur,isDisabled}) => {
    return <>
        <Typography component="div" className="Personal-Informationsheading">
            <Typography component="h2" variant="h5"  className='margin-bottom-12'>Company Point of Contact</Typography>
        </Typography>
        <Grid container spacing={3} className='CompanyDetails-container'>
            <Grid item xs={12} sm={6} md={6} className="Personal-Information CompanyDetails">
        <CustomFormControl
            id="CompanyContactName"
            label="Full Name"
            type="text"
            register={register}
            errors={errors}
            handleBlur={handleBlur}
            disable={isDisabled || false}
        />
        </Grid>
       <Grid item xs={12} sm={6} md={6} className="Personal-Information CompanyDetails">
        <CustomFormControl
            id="CompanyContactEmailAddress"
            label="Email Address"
            type="email"
            register={register}
            errors={errors}
            handleBlur={handleBlur}
            disable={isDisabled || false}
        />
        </Grid>
        <Grid item xs={12} sm={6} md={6} className="Personal-Information CompanyDetails">
        <MobileNumberInput
            control={control}
            name="CompanyContactTelephone"
            label="Phone Number"
            rules={{ required: 'Phone Number is required' }}
            errors={errors}
            handleBlur={handleBlur}
            disabled={isDisabled || false}
        />
        </Grid>
       < Grid item xs={12} sm={6} md={6} className="Personal-Information CompanyDetails">
           <CustomFormControl
            id="AuthorizedWGLContact"
            label="Authorized WGL Contact (Optional)"
            type="text"
            register={register}
            errors={errors}
            handleBlur={handleBlur}
            disable={isDisabled || false}
        />
        </Grid>
        </Grid>
        
     
    </>;
};

export default CompanyPOC;