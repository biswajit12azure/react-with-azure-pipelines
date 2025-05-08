import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AutocompleteInput, CustomFormControl, MobileNumberInput, DisplayUploadedFile } from '_components';
import { Grid } from "@material-ui/core";
import { Box } from "@mui/material";
import { alertActions, myprofileAction } from "_store";
import { profileInformationMCUpdateSchema } from '_utils/validationSchema';
const MyProfileMC = () => {
  const header = "My Profile";
  const authUserId = useSelector((x) => x.auth?.userId);
  // const [userId, setUserId] = useState(authUserId);
  const [mcdata, setMCData] = useState();
  const dispatch = useDispatch();

  const profileDetails = useSelector((x) => x.profileupdate?.individualMCDetails);
  const states = profileDetails?.State || [];
  const [expandedAccordion, setExpandedAccordion] = useState(""); // Default open
  const [initialData, setInitialData] = useState({});
  const [isModified, setIsModified] = useState(false);
  const authUser = useSelector(x => x.auth?.value);

  const user = authUser?.Data;
  const userdetails = user?.UserDetails;
  const authUserName = `${userdetails.FirstName} ${userdetails.LastName}`;
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedAccordion(isExpanded ? panel : false);
    handleRefresh();
  }

  const { register, handleSubmit, control, reset, formState: { errors,isValid }, trigger, watch } = useForm({
    resolver: yupResolver(profileInformationMCUpdateSchema),
    mode: 'onChange'

  });
  
  const isDeepEqual = (obj1, obj2) => {
    if (obj1 === obj2) return true;

    if (typeof obj1 !== "object" || typeof obj2 !== "object" || obj1 === null || obj2 === null) {
        return obj1 === obj2;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    for (let key of keys1) {
        if (!isDeepEqual(obj1[key], obj2[key])) {
            return false;
        }
    }
    return true;
};
useEffect(() => {
  const subscription = watch((currentData) => {
      const isChanged = !isDeepEqual(initialData, currentData);
      setIsModified(isChanged);
  });

  return () => subscription.unsubscribe();
}, [watch, initialData]);
  useEffect(() => {

    const fetchData = async () => {
      dispatch(alertActions.clear());
      try {
        const result = await dispatch(myprofileAction.getMCUserDetails(authUserId)).unwrap();
        setMCData(result?.Data);
        setInitialData(result?.Data);
        console.log("MC Result----------------------", result);
        reset(result.Data);

      } catch (error) {
        dispatch(
          alertActions.error({
            message: error?.message || error,
            header: `${header} Failed`,
          })
        );
      }
    };
    fetchData();
  }, [dispatch, authUserId, reset]);

  const handleBlur = async (e) => {
    const fieldName = e.target.name;
    // console.log(`Triggering validation for: ${fieldName}`);
    await trigger(fieldName);
    //  console.log(`Validation result for ${fieldName}:`, result);
  };

  const handleRefresh = async() => {
    const result = await dispatch(myprofileAction.getMCUserDetails(authUserId)).unwrap();
    setMCData(result?.Data);
    setInitialData(result?.Data);
    console.log("MC Result----------------------", result);
    reset(result.Data);
    // setIsModified(false);
  }
  const stateData = states.map(x => ({
    label: x.StateName,
    value: x.StateId
  }));

  const onSubmit = async (data) => {
    dispatch(alertActions.clear());

    try {
      console.log("formed Data", data);
      const transformedData = {
        AdditionalID: profileDetails.AdditionalID,
        UserID: authUserId,
        FullName: data?.FullName,
        EmailID: data?.EmailID,
        AlternateEmail: data?.AlternateEmail,
        CompanyName: data.CompanyName || null,
        MobileNumber: data?.MobileNumber,
        AlternatePhoneNumber:data?.AlternatePhoneNumber,
        HomeStreetAddress1: data?.HomeStreetAddress1,
        HomeStreetAddress2: profileDetails.HomeStreetAddress2,
        HomeCity: data?.HomeCity,
        HomeState: data?.HomeState,
        HomeZipCode: data?.HomeZipCode,
        DLNumber: data?.DLNumber,
        DLState: data.DLState,
        CompanyName: data?.CompanyName,
        TaxIdentificationNumber: data?.TaxIdentificationNumber,
        CompanyStreetAddress1: data?.CompanyStreetAddress1,
        CompanyStreetAddress2: profileDetails.CompanyStreetAddress2,
        CompanyCity: data?.CompanyCity,
        CompanyState: data?.CompanyState,
        CompanyZipCode: data?.CompanyZipCode,
        CompanyContactName: data?.CompanyContactName,
        CompanyContactTelephone: data?.CompanyContactTelephone,
        CompanyContactEmailAddress: data?.CompanyContactEmailAddress,
        AuthorizedWGLContact: data?.AuthorizedWGLContact || " ",
        StatusID: profileDetails.StatusID,
        ModifiedBy: authUserName,
       
        // CompanyContactEmailAddress:data.CompanyContactEmailAddress
      };
      console.log("MC updated data", transformedData);


      let result;
      if (transformedData) {
        result = await dispatch(myprofileAction.updateMCProfile(transformedData)).unwrap();
      }
      if (result?.error) {
        dispatch(alertActions.error({ message: result?.payload || result?.error.message, header: header }));
        return;
      }
      dispatch(alertActions.success({ message: "Personal information updated successfully", header: header, showAfterRedirect: true }));

    } catch (error) {
      dispatch(alertActions.error({ message: error?.message || error, header: header }));
    }


  };
  return (
    <>
      {!(profileDetails?.loading) && (
        <div className="Filtercontainerinner Border">
        <form onSubmit={handleSubmit(onSubmit)} className='Registrationcontainer marketerFiltercontainer'>
          {/* Basic Information */}
          <Accordion expanded={expandedAccordion === "basic"} onChange={handleAccordionChange("basic")}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" className="AccordionSummaryheading">Personal Information</Typography>
            </AccordionSummary>
            <AccordionDetails >
              <Box className="heightmin">
                <Grid container>
                  <Grid item xs={12}>
                    <CustomFormControl
                      id="FullName"
                      label="Full Name"
                      type="text"
                      register={register}
                      errors={errors}
                      handleBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomFormControl
                      id="EmailID"
                      label="Email ID"
                      type="text"
                      register={register}
                      errors={errors}
                      disable={true}
                      handleBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomFormControl
                      id="AlternateEmail"
                      label="Alternative Email"
                      type="text"
                      register={register}
                      errors={errors}
                      handleBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <MobileNumberInput
                      control={control}
                      name="MobileNumber"
                      label="Phone Number"
                      rules={{ required: "Phone Number is required" }}
                      errors={errors}
                      handleBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <MobileNumberInput
                    control={control}
                    name="AlternatePhoneNumber"
                    label="Alternative Phone Number"
                    errors={errors}
                  handleBlur={handleBlur}
                  />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomFormControl
                      id="HomeStreetAddress1"
                      label="Street Address"
                      type="text"
                      register={register}
                      errors={errors}
                      handleBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomFormControl
                      id="HomeCity"
                      label="City"
                      type="text"
                      register={register}
                      errors={errors}
                      handleBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <AutocompleteInput
                      className="selecticon marbottom0"
                      control={control}
                      name="HomeState"
                      label="State"
                      options={stateData}
                      handleBlur={handleBlur}
                      error={!!errors.HomeState}
                      helperText={errors.HomeState?.message}
                      trigger={trigger}

                    />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomFormControl
                      id="HomeZipCode"
                      label="Zip Code"
                      type="text"
                      register={register}
                      errors={errors}
                      handleBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomFormControl
                      id="DLNumber"
                      label="Driving License"
                      type="text"
                      register={register}
                      errors={errors}
                      handleBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <AutocompleteInput
                      className="selecticon marbottom0"
                      control={control}
                      name="DLState"
                      label="License State"
                      options={stateData}
                      handleBlur={handleBlur}
                      error={!!errors.DLState}
                      helperText={errors.DLState?.message}
                      trigger={trigger}
                    />
                  </Grid>
                </Grid>
              </Box>

            </AccordionDetails>
          </Accordion>

          {/* Contact Details */}
          <Accordion expanded={expandedAccordion === "contact"} onChange={handleAccordionChange("contact")}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" className="AccordionSummaryheading">Company Information</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box className="heightmin">
                <Grid container>
                  <Grid item xs={12}>
                    <CustomFormControl
                      id="CompanyName"
                      label="Company Name"
                      type="text"
                      register={register}
                      errors={errors}
                      disable={true}
                      handleBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomFormControl
                      id="TaxIdentificationNumber"
                      label="TaxId Number"
                      type="text"
                      register={register}
                      errors={errors}
                      disable={true}
                      handleBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomFormControl
                      id="CompanyStreetAddress1"
                      label="Street Address"
                      type="text"
                      register={register}
                      errors={errors}
                      handleBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={12} >
                    <CustomFormControl
                      id="CompanyCity"
                      label="City"
                      type="text"
                      register={register}
                      errors={errors}
                      handleBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={12} >

                    <AutocompleteInput
                      className="selecticon marbottom0"
                      control={control}
                      name="CompanyState"
                      label="State"
                      options={stateData}
                      error={!!errors.CompanyState}
                      helperText={errors.CompanyState?.message}
                      trigger={trigger}

                    />
                  </Grid>

                  <Grid item xs={12}>
                    <CustomFormControl
                      id="CompanyZipCode"
                      label="Zip Code"
                      type="text"
                      register={register}
                      errors={errors}
                      handleBlur={handleBlur}
                    />
                  </Grid>
                  {/* <Grid size={{ xs: 12, sm: 12, md: 12 }}> */}
                </Grid>
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Address Information */}
          <Accordion expanded={expandedAccordion === "address"} onChange={handleAccordionChange("address")}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" className="AccordionSummaryheading">Company Point of Contact</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box className="heightmin">
                <Grid container>
                  <Grid item xs={12}>
                    <CustomFormControl
                      id="CompanyContactName"
                      label="Full Name"
                      type="text"
                      register={register}
                      errors={errors}
                      handleBlur={handleBlur}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <MobileNumberInput
                      control={control}
                      name="CompanyContactTelephone"
                      label="Phone Number"
                      errors={errors}
                      rules={{ required: "Phone Number is required" }}
                      handleBlur={handleBlur}
                    />

                  </Grid>
                  <Grid item xs={12}>
                    <CustomFormControl
                      id="CompanyContactEmailAddress"
                      label="Email"
                      type="text"
                      register={register}
                      errors={errors}
                      handleBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomFormControl
                      id="AuthorizedWGLContact"
                      label="Authorized WGL Contact"
                      type="text"
                      register={register}
                      errors={errors}
                      handleBlur={handleBlur}
                    />
                  </Grid>
                </Grid>
              </Box>
            </AccordionDetails>
          </Accordion>


          <Grid container>
            <DisplayUploadedFile exsistingFiles={mcdata?.FileData} />
          </Grid>

          <Grid container>
            <Grid item xs={12}>
              <Typography component="div" className="CreateMarketerbutton">
                <Button
                  type="submit"
                  variant="contained"
                  className='submitbutton'
                  color="primary"
                  disabled={!isModified || !isValid}
                >
                  Save
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  className="cancelbutton"
                  onClick={handleAccordionChange(false)}
                >
                  Cancel
                </Button>
              </Typography>
            </Grid>

          </Grid>

        </form>
        </div>
      )}
    </>
    
  );
}

export default MyProfileMC;