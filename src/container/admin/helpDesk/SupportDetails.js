import React from 'react';
import Grid from "@material-ui/core/Grid";
import { Typography } from '@mui/material';
import { MobileNumberInput, AutocompleteInput, CustomMultiTextFieldInput} from '_components';

const SupportDetails = ({register, control, errors, handleBlur,trigger, handlePortalChange, portalData, selectedPortal}) => {
    return(
    <Grid item xs={12} sm={6} md={4} className='supplierDetailes Personal-Informationsheading'>
      <Typography component="h2">Support Details</Typography>
      <Typography className="passwordcheck marbottom0 selecticon" component="div">
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
      {/* <CustomFormControl
        id="EmailAddress"
        label="Email Address"
        type="text"
        register={register}
        errors={errors}
        handleBlur={handleBlur}       
      /> */}
           {/* <CustomFormControl
                    id="EmailAddress"
                    label="Email Address"
                    type="text"
                    register={register}
                   
                /> */}
                   {/* <TextField
          id="EmailAddress"
          label="Email Address"
          type="text"
          multiline
          register={register}
        /> */}
        <CustomMultiTextFieldInput
           id="EmailAddress"
           label="Email Address"
           type="text"
           register={register}
          rows={1}
           minRows={1}
           maxRows={5}
           handleBlur={handleBlur}
           errors={errors}
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