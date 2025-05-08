import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Box, Typography, Button } from '@mui/material';
import { userActions, alertActions } from '_store';
import {registerValidationSchema, profileValidationSchema } from '_utils/validationSchema';
import { PersonalDetails ,SecurityQuestions} from 'container/user';

const ManageProfile = ({ title, open, handleClose, selectedrowId }) => {
    const id = selectedrowId;
    const dispatch = useDispatch();
    const user = useSelector(x => x.users?.item);
    const combinedSchema = registerValidationSchema.concat(profileValidationSchema());

    const { register, handleSubmit, control,trigger, reset, watch, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(combinedSchema)
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
                await dispatch(userActions.update({ id, data })).unwrap();
                message = 'User updated';
            } else {
                await dispatch(userActions.register(data)).unwrap();
                message = 'User added';
            }
            handleClose();
            dispatch(alertActions.success({ message, showAfterRedirect: true }));
        } catch (error) {
            dispatch(alertActions.error(error));
        }
    };

    return (
        <Modal open={open} onClose={handleClose} aria-labelledby="edit-modal-title" aria-describedby="edit-modal-description">
            <Box sx={{ ...style, width: 800 }}>
                {!(user?.loading || user?.error) &&
                    (<Typography component="div" className="mobilebanner">
                        <Typography component="h1" variant="h5">{title}</Typography>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <PersonalDetails  register={register} errors={errors} watch={watch} control={control} trigger={trigger}></PersonalDetails>
                            <SecurityQuestions id={id}  register={register} errors={errors}  control={control} trigger={trigger}/>
                           
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
        </Modal>
    );
};

export default ManageProfile;

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