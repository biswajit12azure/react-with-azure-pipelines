import React from "react";
import { CustomTextArea, AutocompleteInput } from '_components';
import { Typography } from '@mui/material';
import Grid from "@material-ui/core/Grid";

const RejectDetails = ({ register, errors, control,handleBlur,initialData}) => {

    const rejectReasons = initialData?.map(option => ({ value: option.ReasonID, label: option.ReasonName }));
    console.log("sagdagsdasd",rejectReasons)
    return <>
      <Typography component="div" className="Personal-Informationsheading">
            <Typography component="h2" variant="h5"  className='margin-bottom-12'>Reject Reason</Typography>
        </Typography>
        <Grid container spacing={3} className='CompanyDetails-container'>
        <Grid item xs={12} sm={12} md={12} className="Personal-Information CompanyDetails">
            <Grid item xs={12} sm={6} md={6} >
            
                <AutocompleteInput
                    control={control}
                    name="RejectionReasonID"
                    label="Reject Reason"
                    options={rejectReasons}
                    error={!!errors.RejectionReasonID}
                    helperText={errors.RejectionReasonID?.message}
                    handleBlur={handleBlur}
                    disabled={true}
                />
                 </Grid>
                 </Grid>
                <Grid item xs={12} sm={12} md={12} className="Personal-Information CompanyDetails">
                  <CustomTextArea
                    id="RejectionComment"
                    label="Rejection Comment"
                    maxLength={1000}
                    register={register}
                    errors={errors}
                    disabled={true}
                />
                </Grid>
        </Grid>
   
    </>
}

export default RejectDetails;