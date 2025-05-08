import React from 'react';
import { useForm } from 'react-hook-form';
import { CustomTextFieldInput } from '_components';
import { Typography, Button, Box } from '@mui/material';
import Popper from '@mui/material/Popper';
import Grid from "@material-ui/core/Grid";
import FilterListIcon from '@mui/icons-material/FilterList';

const CustomerFilter = ({ isOpen, onClose, onOpen}) => {
    // const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = React.useState(null);

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

    const { register, handleSubmit, control, formState: { errors } } = useForm({
    });

    const onSubmit = async (data) => {
        // try {
        //     dispatch(alertActions.clear());
        //     data= {...data,PortalId:portalId };
        //     const result = await dispatch(userProfileAction.filter(data)).unwrap();
        //     if (result?.error) {
        //         dispatch(alertActions.error({ message: result?.payload || result?.error.message, header: "Fetch Failed" }));
        //         return;
        //     }
        //     handleFilterSubmit(result?.Data);
        //     onClose();
        // } catch (error) {
        //     dispatch(alertActions.error({ message: "No results found matching the search criteria", header: "Fetch Failed" }));
        //     onClose();
        // } finally {
        //     reset();
        // }
    };

    const handleCancelClick = () => {
        onClose();
    };

    // const handleBlur = async (e) => {
    //     const fieldName = e.target.name;
    //     await trigger(fieldName);
    // };

    return (
        <>
            <Button className='Filter' type="button" variant="contained" color="primary" aria-describedby={id} onClick={handleClick}>
                <FilterListIcon />Filter
            </Button>
            <Popper id={id} open={canBeOpen} anchorEl={anchorEl} className="Filtercontainer">
                <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }} className="Filtercontainerinner Border">
                    <form onSubmit={handleSubmit(onSubmit)} className='Registrationcontainer'>
                        <Typography component="div" className='userprofilelist'>
                            <Grid container direction="row" spacing={{ xs: 2, md: 3 }}>
                                <Grid item xs={12} sm={6} md={6}>
                                    <Typography variant="h2" className='userprofilelistcontent'>Search</Typography>
                                </Grid>
                            </Grid>
                        </Typography>

                        <CustomTextFieldInput
                            control={control}
                            name="fullName"
                            label="Account Number"
                            register={register}
                            errors={errors}
                        />

                        <Typography component="div" className="CreateMarketerbutton">
                            <Button
                                type="submit"
                                variant="contained"
                                className='submitbutton'
                                color="primary"
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

export default CustomerFilter;