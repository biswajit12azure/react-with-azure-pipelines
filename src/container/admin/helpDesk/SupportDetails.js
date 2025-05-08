import React from 'react';
import Grid from "@material-ui/core/Grid";
import { Typography } from '@mui/material';
import { MobileNumberInput, CustomFormControl, AutocompleteInput } from '_components';

const SupportDetails = ({register, control, errors, handleBlur,trigger, handlePortalChange, portalData, selectedPortal}) => {
    return(
    <Grid item xs={12} sm={6} md={4} className='supplierDetailes Personal-Informationsheading'>
      <Typography component="h2">Support Details</Typography>
      <Typography className="passwordcheck" component="div">
        <AutocompleteInput       
          id="PortalID"
          control={control}
          name="PortalID"
          label="Select Portal"
          value={selectedPortal}
          options={portalData}
          error={!!errors.PortalID}
          helperText={errors.PortalID?.message}
          handleBlur={handleBlur}
          trigger={trigger}
          onChange={handlePortalChange}
        />
      </Typography>
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
        name="PhoneNumber"
        label="Phone Number"
        rules={{ required: 'Phone Number is required' }}
        errors={errors}
        handleBlur={handleBlur}
      />
      <MobileNumberInput
        control={control}
        name="Fax"
        label="Fax"
        rules={{ required: 'Fax is required' }}
        errors={errors}
        handleBlur={handleBlur}
      />
    </Grid>
 );
}

  export default SupportDetails;