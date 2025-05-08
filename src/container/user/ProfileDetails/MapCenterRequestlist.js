import React , { useState } from 'react';
import { Box } from '@mui/material';
import Grid from "@mui/material/Grid2";
import {   CustomStaticDateRangePicker } from '_components';
import { Switch, FormControlLabel } from "@mui/material";
import { AutocompleteInput, CustomFormControl, MobileNumberInput } from '_components';
const MapCenterRequestlist = ({ register, errors, control, trigger, stateData, handleBlur, isAdmin, isDisabled }) => {
    const [checked, setChecked] = useState(true); // Initially enabled

    const handleChange = (event) => {
      setChecked(event.target.checked);
    };
    return <Box className="Mapcenterlist">
     <Grid container spacing={2}>
     <Grid size={{ xs: 12, sm: 12, md: 6 }} className="Personal-Information marbottom0 selecticon CompanyDetails passwordcheck">
                    <AutocompleteInput
                    id="DLState"
                    control={control}
                    name="DLState"
                    label="Requestor Type"
                    options={stateData}
                    error={!!errors.DLState}
                    helperText={errors.DLState?.message}
                    handleBlur={handleBlur}
                    trigger={trigger}
                    disabled={isDisabled || false}
                />
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 6 }} className=" SelectedDate  SelectedDatedatepiker">
                            
                            <CustomStaticDateRangePicker
                                id="SelectedDate"
                                control={control}
                                trigger={trigger}
                                name="SelectedDate"
                                label="From - To"
                              
                            />

                        </Grid>
                        </Grid>
      
        <CustomFormControl
            id="HomeCity"
            label="City"
            type="text"
            register={register}
            errors={errors}
            handleBlur={handleBlur}
            disable={isDisabled || false}
        />
        <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 12, md: 4 }} className="Personal-Information marbottom0 selecticon CompanyDetails passwordcheck ">
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
                    disabled={isDisabled || false}
                />
                {/* <CustomFormControl
                    id="DLNumber"
                    label="Driving License"
                    type="text"
                    register={register}
                    errors={errors}
                    handleBlur={handleBlur}
                    disable={isDisabled || false}
                /> */}


            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 4 }} className="Personal-Information marbottom0 selecticon CompanyDetails passwordcheck  SelectedDatedatepiker">
                <AutocompleteInput
                    id="HomeState"
                    control={control}
                    name="HomeState"
                    label="County"
                    options={stateData}
                    error={!!errors.HomeState}
                    helperText={errors.HomeState?.message}
                    handleBlur={handleBlur}
                    trigger={trigger}
                    disabled={isDisabled || false}
                />
               


            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 4 }} className="Personal-Information marbottom0 selecticon CompanyDetails passwordcheck  SelectedDatedatepiker">
                <CustomFormControl
                    id="HomeZipCode"
                    label="Zip Code"
                    type="number"
                    register={register}
                    errors={errors}
                    handleBlur={handleBlur}
                    disable={isDisabled || false}
                />
                
            </Grid>
            
            </Grid>
            <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 12, md: 6 }} className="Personal-Information marbottom0 selecticon CompanyDetails passwordcheck p-t-b-0">
            <CustomFormControl
            className="marbottom0"
            id="CrossStreet1"
            label="Cross Street1"
            type="text"
            register={register}
            errors={errors}
            handleBlur={handleBlur}
            disable={isDisabled || false}
        />
    </Grid>
            
    <Grid size={{ xs: 12, sm: 12, md: 6 }} className=" SelectedDatedatepiker Personal-Information marbottom0 selecticon CompanyDetails passwordcheck p-t-b-0">
          
                 <CustomFormControl
            id="CrossStreet2"
            label="Cross Street2"
            type="text"
            register={register}
            errors={errors}
            handleBlur={handleBlur}
            disable={isDisabled || false}
        />
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 12 }} className='p-0'>
        <Box className='FormControlLabel'>
         <FormControlLabel
         
       control={
        <Switch 
          checked={checked} 
          onChange={handleChange} 
          color="primary"  
        />
      }
      label="Request on behalf of a government agency"
    />
    
    </Box>
    </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 6 }} className=" SelectedDatedatepiker Personal-Information marbottom0 selecticon CompanyDetails passwordcheck">
          
           
                <CustomFormControl
            id="Agencyname"
            label="Agency name"
            type="text"
            register={register}
            errors={errors}
            handleBlur={handleBlur}
            disable={isDisabled || false}
        />
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 6 }} className=" SelectedDatedatepiker Personal-Information marbottom0 selecticon CompanyDetails passwordcheck">
          
              
                 <CustomFormControl
            id="ProjectNumber"
            label="Project Number"
            type="text"
            register={register}
            errors={errors}
            handleBlur={handleBlur}
            disable={isDisabled || false}
        />
        </Grid>
        </Grid>
           
        
    </Box>
};

export default MapCenterRequestlist;