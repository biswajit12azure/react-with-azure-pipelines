import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AutocompleteInput } from '_components';

import { Typography, Button, Box } from '@mui/material';
import Popper from '@mui/material/Popper';
import Grid from "@material-ui/core/Grid";
import FilterListIcon from '@mui/icons-material/FilterList';

import { yupResolver } from '@hookform/resolvers/yup';
import { accountInquirySchema } from '_utils/validationSchema';
import { CustomFormControl, MobileNumberInput } from '_components';
import { useDispatch } from 'react-redux';
import { accountInquiryData } from '_utils/constant';
import { alertActions } from '_store';

const AccountInquiryFilter = ({ handleFilterSubmit, isOpen, onClose, onOpen }) => {
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState(null);
    const canBeOpen = isOpen && Boolean(anchorEl);
    const id = canBeOpen ? 'simple-popper' : undefined;

    const searchByList = [
        { value: "Washington Gas Account", label: "Washington Gas Account" },
        { value: "Account Holder", label: "Account Holder" },
        { value: "Phone Number", label: "Phone Number" },
        { value: "Service Address", label: "Service Address" }
    ]

    const { register, control, handleSubmit, watch, reset, trigger, formState: { errors, isValid } } = useForm({
        resolver: yupResolver(accountInquirySchema),
    });

    const searchType = watch('searchType');
    const firstName = watch("accountHolder.firstName");
    const lastName = watch("accountHolder.lastName");
    const streetAddress = watch("serviceAddress.streetAddress");

    const isSearchDisabled =
        (searchType === 'Account Holder' && !firstName && !lastName) ||
        (searchType === 'Service Address' && !streetAddress) ||
        !isValid;

    useEffect(() => {
        reset({
            searchType,
            washingtonGasAccount: '',
            accountHolder: { firstName: '', lastName: '' },
            phoneNumber: '',
            serviceAddress: { houseNumber: '', apartmentSuite: '', streetAddress: '', city: '', state: '' }
        });
    }, [searchType, reset]);

    const onSubmit = (data) => {
        
        dispatch(alertActions.clear());
        try {
          const  transformedData = {
                WashingtonGasAccount: data?.washingtonGasAccount || '',
                PhoneNumber:data?.phoneNumber || null,
                AccountHolder: {
                    FirstName: data?.accountHolder?.firstName || '' ,
                    LastName: data?.accountHolder?.lastName || ''
                },
                ServiceAddress: {
                    HouseNumber: data?.serviceAddress?.houseNumber || '',
                    ApartmentSuite: data?.serviceAddress?.apartmentSuite ||  '',
                    StreetAddress:data?.serviceAddress?.streetAddress || '',
                    City: data?.serviceAddress?.city || '',
                    State: data?.serviceAddress?.state || '',
                }
            }  
            console.log('Searching for:', transformedData);          
            // const result = accountInquiryData; //await dispatch(marketerAction.filter(transformedData)).unwrap();
            // if (result?.error) {
            //     dispatch(alertActions.error({ message: result?.payload || result?.error.message, header: "Fetch Failed" }));
            //     return;
            // }
            handleFilterSubmit(false,transformedData);
            resetValues();
            onClose();
        } catch (error) {
            dispatch(alertActions.error({ message: error?.message || error, header: "Fetch Failed" }));
        }
    };

    const resetValues = () => {
        reset({
            searchType,
            washingtonGasAccount: '',
            accountHolder: { firstName: '', lastName: '' },
            phoneNumber: '',
            serviceAddress: { houseNumber: '', apartmentSuite: '', streetAddress: '', city: '', state: '' }
        });
    }

    const handleBlur = async (e) => {
        const fieldName = e.target.name;
        await trigger(fieldName);
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        if (isOpen) {
            onClose();
        } else {
            onOpen();
        }
    };

    const handleCancelClick = () => {
        reset();
        onClose();
    };

    return (
        <>
            <Button className='Filter' type="button" variant="contained" color="primary" aria-describedby={id} onClick={handleClick}>
                <FilterListIcon />Filter
            </Button>
            <Popper id={id} open={canBeOpen} anchorEl={anchorEl} className="Filtercontainer">
                <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }} className="Filtercontainerinner Border">
                    <form onSubmit={handleSubmit(onSubmit)} className='Registrationcontainer marketerFiltercontainer'>
                        <Typography component="div" className='userprofilelist'>
                            <Grid container direction="row" spacing={{ xs: 2, md: 3 }}>
                                <Grid item xs={12} sm={12} md={12}>
                                    <Typography variant="h2" className='userprofilelistcontent'>Account Inquiry Filter</Typography>
                                </Grid>
                            </Grid>
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid item xs={12} className='paddingbottom8'>
                                <Typography className='marbottom0 selecticon'>
                                    <AutocompleteInput
                                        control={control}
                                        name="searchType"
                                        label="Search By"
                                        options={searchByList}
                                    />
                                </Typography>
                            </Grid>

                            {searchType === 'Washington Gas Account' && (
                                <Grid item xs={12} className='paddingbottom8'>
                                    <CustomFormControl
                                        id="washingtonGasAccount"
                                        label="Washington Gas Account"
                                        type="text"
                                        register={register}
                                        errors={errors}
                                        handleBlur={handleBlur}
                                    />
                                </Grid>
                            )}

                            {searchType === 'Account Holder' && (
                                <>
                                    <Grid item xs={12} className='paddingbottom8'>
                                        <CustomFormControl
                                            id="accountHolder.firstName"
                                            label="First Name"
                                            type="text"
                                            register={register}
                                            errors={errors}
                                            handleBlur={handleBlur}
                                        />
                                    </Grid>
                                    <Grid item xs={12} className='paddingbottom8'>
                                        <CustomFormControl
                                            id="accountHolder.lastName"
                                            label="Last Name / Organization"
                                            type="text"
                                            register={register}
                                            errors={errors}
                                            handleBlur={handleBlur}
                                        />
                                    </Grid>
                                </>
                            )}

                            {searchType === 'Phone Number' && (
                                <Grid item xs={12} className='paddingbottom8'>
                                    <MobileNumberInput
                                        control={control}
                                        name="phoneNumber"
                                        label="Phone Number"
                                        errors={errors}
                                        rules={{ required: "Phone Number is required" }}
                                        handleBlur={handleBlur}
                                    />

                                </Grid>
                            )}

                            {searchType === 'Service Address' && (
                                <>
                                    <Grid item xs={12} className='paddingbottom8'>
                                        <CustomFormControl
                                            id="serviceAddress.houseNumber"
                                            label="House Number"
                                            type="text"
                                            register={register}
                                            errors={errors}
                                            handleBlur={handleBlur}
                                        />
                                    </Grid>
                                    <Grid item xs={12} className='paddingbottom8'>
                                        <CustomFormControl
                                            id="serviceAddress.apartmentSuite"
                                            label="Apartment/Suite#"
                                            type="text"
                                            register={register}
                                            errors={errors}
                                            handleBlur={handleBlur}
                                        />
                                    </Grid>
                                    <Grid item xs={12} className='paddingbottom8'>

                                        <CustomFormControl
                                            id="serviceAddress.streetAddress"
                                            label="Street Address"
                                            type="text"
                                            register={register}
                                            errors={errors}
                                            handleBlur={handleBlur}
                                        />
                                    </Grid>
                                    <Grid item xs={12} className='paddingbottom8'>

                                        <CustomFormControl
                                            id="serviceAddress.city"
                                            label="City"
                                            type="text"
                                            register={register}
                                            errors={errors}
                                            handleBlur={handleBlur}
                                        />
                                    </Grid>
                                    <Grid item xs={12} className='paddingbottom8'>
                                        <CustomFormControl
                                            id="serviceAddress.state"
                                            label="State"
                                            type="text"
                                            register={register}
                                            errors={errors}
                                            handleBlur={handleBlur}
                                        />
                                    </Grid>
                                </>
                            )}
                        </Grid>
                        <Typography component="div" className="CreateMarketerbutton">
                            <Button
                                type="submit"
                                variant="contained"
                                className='submitbutton'
                                color="primary"
                                disabled={isSearchDisabled}
                            >
                                Search
                            </Button>
                            <Button variant="contained" color="red" className="cancelbutton"
                                onClick={handleCancelClick}>
                                Cancel
                            </Button>
                        </Typography>

                    </form>
                </Box>
            </Popper>
        </>
    );
};

export default AccountInquiryFilter;