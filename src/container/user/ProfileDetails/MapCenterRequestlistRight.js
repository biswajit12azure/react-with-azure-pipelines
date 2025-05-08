import React , { useState } from 'react';
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Switch, FormControlLabel } from "@mui/material";
import { AutocompleteInput, CustomFormControl, MobileNumberInput } from '_components';
const MapCenterRequestlistRight = ({ register, errors, control, trigger, stateData, handleBlur, isAdmin, isDisabled }) => {
    const [checked, setChecked] = useState(true); // Initially enabled

    const handleChange = (event) => {
      setChecked(event.target.checked);
    };
    return < Box className="Mapcenterlistconatiner">
    
        
    < Box  className="BCANumber">
        <CustomFormControl
            id="HomeCity"
           
            label="BCA Number"
            type="text"
            register={register}
            errors={errors}
            handleBlur={handleBlur}
            disable={isDisabled || false}
        />
        </Box>
          <CustomFormControl
            id="HomeCity"
            label="Reason Map is Needed"
            type="text"
            register={register}
            errors={errors}
            handleBlur={handleBlur}
            disable={isDisabled || false}
        />
         <CustomFormControl
            id="HomeCity"
            label="Address or Description for Location"
            type="text"
            register={register}
            errors={errors}
            handleBlur={handleBlur}
            disable={isDisabled || false}
        />
        
        <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 12, md: 4 }} className="Personal-Information marbottom0 selecticon CompanyDetails passwordcheck ">
            <CustomFormControl
            id="HomeCity"
            label="Map #"
            type="text"
            register={register}
            errors={errors}
            handleBlur={handleBlur}
            disable={isDisabled || false}
        />
              


            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 4 }} className=" SelectedDatedatepiker Personal-Information marbottom0 selecticon CompanyDetails passwordcheck">
            <CustomFormControl
            id="HomeCity"
            label="Book Name"
            type="text"
            register={register}
            errors={errors}
            handleBlur={handleBlur}
            disable={isDisabled || false}
        />
               


            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 4 }} className="Personal-Information marbottom0 selecticon CompanyDetails passwordcheck SelectedDatedatepiker">
            <CustomFormControl
            id="HomeCity"
            label="Book Edition"
            type="text"
            register={register}
            errors={errors}
            handleBlur={handleBlur}
            disable={isDisabled || false}
        />
                
            </Grid>
            
            </Grid>
            <Grid container  spacing={{ xs: 2, md: 2 }}>
            <Grid size={{ xs: 12, sm: 12, md: 6 }} className="Personal-Information marbottom0 selecticon CompanyDetails passwordcheck">
            <CustomFormControl
            className="marbottom0"
            id="CrossStreet1"
            label="Grid X Axis"
            type="text"
            register={register}
            errors={errors}
            handleBlur={handleBlur}
            disable={isDisabled || false}
        />
    </Grid>
            
    <Grid size={{ xs: 12, sm: 12, md: 6 }} className=" SelectedDatedatepiker Personal-Information paddingtop-0 marbottom0 selecticon CompanyDetails passwordcheck">
          
                 <CustomFormControl
            id="CrossStreet2"
            label="Grid Y Axis"
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

export default MapCenterRequestlistRight;