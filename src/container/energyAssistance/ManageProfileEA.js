import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Box, Typography, Button } from '@mui/material';
import { userActions, alertActions } from '_store';
import { profileValidationSchema } from '_utils/validationSchema';
import { PersonalDetails } from 'container/user';

const ManageProfileEA = () => {
    const authUser = useSelector(state => state.auth.value);
    const id = authUser.id;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(x => x.users?.item);
    
    const { register, handleSubmit, control, reset, watch, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(profileValidationSchema(id))
    });

    useEffect(() => {
        dispatch(userActions.clear());
        if (id) {
            dispatch(userActions.getById(id)).unwrap().then(user => reset(user));
        } else {

            reset(user); // Reset form state when adding a new user
        }
    }, [id, dispatch, reset]);

    const onSubmit = async (data) => {
        dispatch(alertActions.clear());
        try {
            let message;
            if (id) {
                const portalName="EnergyAssistance";
                await dispatch(userActions.update({ id, data,portalName })).unwrap();
                message = 'User updated';
            } 
            navigate('/energyAssistance/dashboard');
            dispatch(alertActions.success({ message, showAfterRedirect: true }));
        } catch (error) {
            dispatch(alertActions.error(error));
        }
    };

    return (
             <Box>
                {!(user?.loading || user?.error) &&
                    (<Typography component="div" className="mobilebanner">
                        <Typography component="h1" variant="h5">Profile</Typography>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <PersonalDetails id={id} register={register} errors={errors} watch={watch} control={control}></PersonalDetails>
                            <Button type="submit" fullWidth variant="contained" color="primary" disabled={isSubmitting}>
                                {isSubmitting ? 'Submitting...' : 'Submit'}
                            </Button>
                        </form>
                    </Typography>
                    )}
                {user?.error &&
                    <div class="text-center m-5">
                        <div class="text-danger">Error loading user: {user.error}</div>
                    </div>
                }
            </Box>
    );
};

export default ManageProfileEA;

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    maxHeight: '90vh', // Ensure the modal does not exceed the viewport height
    overflowY: 'auto' // Add vertical scroll bar
};