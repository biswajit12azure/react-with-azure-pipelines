import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import { CustomTextFieldInput, CustomFormControl } from '_components';
import { alertActions, userProfileAction } from '_store';
import { Typography, Button, Box } from '@mui/material';
import Popper from '@mui/material/Popper';
import Grid from "@material-ui/core/Grid";
import FilterListIcon from '@mui/icons-material/FilterList';
import { userProfileFilterSchema } from '_utils/validationSchema';

const UserFilter = ({ isOpen, onClose, onOpen, portalsList, handleFilterSubmit, handleportal, portalId, changePortalName }) => {
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = React.useState(null);
    // const [selectedPortId, setSelectedPortalId] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        if (isOpen) {
            onClose();
        } else {
            onOpen();
        }
    };

    const canBeOpen = isOpen && Boolean(anchorEl);
    const id = canBeOpen ? 'simple-popper' : undefined;

    // const portalData = portalsList ? portalsList.map(x => ({
    //     label: x.PortalName,
    //     value: x.PortalId
    // })) : [];

    const { register, handleSubmit, control, reset, formState: { errors, isValid }, trigger } = useForm({
        resolver: yupResolver(userProfileFilterSchema)
    });

    // const handlePortalchange = (e, value) => {
    //     setSelectedPortalId(value);
    //     trigger('PortalId');
    // }

    // useEffect(() => {
    //     if (portalId) {
    //         setSelectedPortalId(portalId);
    //         setValue('PortalId', portalId);
    //     }
    // }, [portalId]);

    const onSubmit = async (data) => {
        try {
            dispatch(alertActions.clear());
            data= {...data,PortalId:portalId };
            const result = await dispatch(userProfileAction.filter(data)).unwrap();
            if (result?.error) {
                dispatch(alertActions.error({ message: result?.payload || result?.error.message, header: "Fetch Failed" }));
                return;
            }
           //changePortalName(data.PortalId);
           // handleportal(data);
            handleFilterSubmit(result?.Data);
            onClose();
        } catch (error) {
            dispatch(alertActions.error({ message: "No results found matching the search criteria", header: "Fetch Failed" }));
            onClose();
        } finally {
            reset();
        }
    };

    const handleCancelClick = () => {
        reset();
        onClose();
    };

    const handleBlur = async (e) => {
        const fieldName = e.target.name;
        await trigger(fieldName);
    };

    // const handleClickAway = () => {
    //     reset();
    //     onClose();
    // };

    return (
        <>
            <Button className='Filter' type="button" variant="contained" color="primary" aria-describedby={id} onClick={handleClick}>
                <FilterListIcon />Filter
            </Button>
           
            <Popper id={id}  open={canBeOpen} anchorEl={anchorEl} className="Filtercontainer">
                <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }} className="Filtercontainerinner Border">
                    <form onSubmit={handleSubmit(onSubmit)} className='Registrationcontainer'>
                        <Typography component="div" className='userprofilelist'>
                            <Grid container direction="row" spacing={{ xs: 2, md: 3 }}>
                                <Grid item xs={12} sm={6} md={6}>
                                    <Typography variant="h2" className='userprofilelistcontent'>User Profile</Typography>
                                </Grid>
                            </Grid>
                        </Typography>
                        {/* <Typography component="div" className='marbottom0 selecticon '>
                            <AutocompleteInput
                                control={control}
                                name="PortalId"
                                value={selectedPortId}
                                label="Select Portal"
                                options={portalData}
                                error={!!errors.PortalId}
                                helperText={errors.PortalId?.message}
                                handleBlur={handleBlur}
                                trigger={trigger}
                                onChange={handlePortalchange}
                            />
                        </Typography> */}
                        <CustomFormControl

                            id="email"
                            label="Email Address"
                            type="text"
                            register={register}
                            errors={errors}
                            handleBlur={handleBlur}
                        />
                        <CustomTextFieldInput
                            control={control}
                            name="fullName"
                            label="Full Name"
                        />

                        <Typography component="div" className="CreateMarketerbutton">
                            <Button
                                type="submit"
                                variant="contained"
                                className='submitbutton'
                                color="primary"
                                disabled={!isValid}
                            >
                                Search
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                className="cancelbutton"
                                onClick={handleCancelClick}
                            >
                                Cancel
                            </Button>
                        </Typography>
                    </form>
                </Box>
            </Popper>
           
        </>
    );
}

export default UserFilter;