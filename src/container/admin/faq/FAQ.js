import React, { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSelector, useDispatch } from 'react-redux';
import Grid from '@mui/material/Grid2';
import { Box, TextareaAutosize, Typography, Button, Input, InputAdornment } from '@mui/material';
import { alertActions, faqAction } from '_store';
import { useForm } from 'react-hook-form';
import { AutocompleteInput } from '_components';
import { newFaqSchema } from '_utils/validationSchema';
import FAQDetails from './FQADetails';

const FAQ = () => {
    const header = "FAQ";
    const dispatch = useDispatch();

    const [faqData, setFaqData] = useState([]);
    const [selectedPortal, setSelectedPortal] = useState(null);
    const [editingFaq, setEditingFaq] = useState(null);

    const id = editingFaq?.ID;

    const authUser = useSelector(x => x.auth?.value);
    const authUserId = useSelector(x => x.auth?.userId);
    const user = authUser?.Data;

    const adminList = user?.UserAccess?.filter(access => access.Role.toLowerCase() === "admin");

    const portalsList = adminList ? adminList.map(admin => ({
        PortalId: admin.PortalId,
        PortalName: admin.PortalName,
        PortalKey: admin.PortalKey,
    })) : [];

    const portalData = portalsList ? portalsList.map(x => ({
        label: x.PortalName,
        value: x.PortalId
    })) : [];

    portalData.push({ label: "Global", value: 99 });

    const { register, handleSubmit, setValue, reset, control, formState: { errors, isValid }, trigger } = useForm({
        resolver: yupResolver(newFaqSchema),
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch(alertActions.clear());
                const faq = await dispatch(faqAction.getByAdminRole(authUserId)).unwrap();
                setFaqData(faq?.Data);
            } catch (error) {
                dispatch(alertActions.error({
                    message: error?.message || error,
                    header: header
                }));
                reset(faqData);
            }
        };
        fetchData();
    }, [dispatch, reset, authUserId]);

    useEffect(() => {
        setValue('PortalID', selectedPortal);
    }, [selectedPortal, setValue]);

    const onSubmit = async (data) => {
        dispatch(alertActions.clear());
        try {
            const transformedData = {
                ID: editingFaq?.ID || 0,
                PortalID: data.PortalID,
                Question: data.Question,
                Answer: data.Answer,
                IsActive: true,
            }

            let result;
            if (editingFaq && editingFaq?.ID) {
                result = await dispatch(faqAction.update({ transformedData }));
            } else {
                result = await dispatch(faqAction.insert({ transformedData }));
            }
            if (result?.error) {
                dispatch(alertActions.error({ message: result?.payload || result?.error.message, header: header }));
                return;
            }
            resetAllValues();
            handleRefresh();
            dispatch(alertActions.success({ message: "FAQ published Successfully.", header: header, showAfterRedirect: true }));
        } catch (error) {
            dispatch(alertActions.error({ message: error?.message || error, header: "Fetch Failed" }));
        }
    };

    const handleRefresh = async () => {
        const faq = await dispatch(faqAction.getByAdminRole(authUserId)).unwrap();
        setFaqData(faq?.Data);
    }

    const handleBlur = async (e) => {
        const fieldName = e.target.name;
        await trigger(fieldName);
       // console.log(`Validation result for ${fieldName}:`, result);
    };

    const handleEditClick = async (faq) => {
        setEditingFaq(faq);
        setValue('Question', faq.Question);
        setValue('Answer', faq.Answer);
        setSelectedPortal(faq.PortalID);

        await trigger(['Question', 'Answer', 'PortalID']);
    };

    const handleCancelClick = async () => {
        resetAllValues();
    };

    const resetAllValues = () => {
        setEditingFaq(null);
        setValue('Question', null);
        setValue('Answer', null);
        setSelectedPortal(null);
        reset();
    };

    return (
        <Box className="Announcementcontainerlist">
            <Typography component="h2" className='Announcementcontent'>FAQ MANAGEMENT</Typography>
            <form onSubmit={handleSubmit(onSubmit)} className='Registrationcontainer'>
                <Grid container direction="row" spacing={{ xs: 2, md: 3 }} >
                    <Grid size={{ xs: 12, sm: 12, md: 4 }} className='CardDetailContainer-right'>
                        <Typography variant="div" component="div" className="">
                            {(faqData && !(faqData?.loading || faqData?.error)) &&
                                <FAQDetails portalData={portalData} faqData={faqData} onEditClick={handleEditClick} handleRefresh={handleRefresh} />
                            }
                        </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 12, md: 8 }} className='CardDetailContainer'>
                        <Grid container direction="row" spacing={{ xs: 2, md: 3 }}>
                            <Grid size={{ xs: 12, sm: 12, md: 6 }} >
                                <Grid container>
                                    <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                        <Typography component="div" className='passwordcheck '>
                                            <AutocompleteInput
                                                id="PortalID"
                                                control={control}
                                                name="PortalID"
                                                label="Select Portal"
                                                options={portalData}
                                                error={!!errors.PortalID}
                                                helperText={errors.PortalID?.message}
                                                handleBlur={handleBlur}
                                            />
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Box className="faqtextarea">
                            <Input
                                {...register("Question")}
                                name="Question"
                                id="Question"
                                placeholder="Question"
                                startAdornment={
                                    <InputAdornment position="start">
                                        Q
                                    </InputAdornment>
                                }
                            />
                            <TextareaAutosize
                                {...register("Answer")}
                                name="Answer"
                                id="Answer"
                                placeholder="Answer"
                                startAdornment={
                                    <InputAdornment position="start">
                                        A
                                    </InputAdornment>
                                }
                            />
                        </Box>
                    </Grid>
                
                <Grid size={{ xs: 12, sm: 12, md: 12 }} className="Personal-Information">
                    <Button variant="contained" color="red" className="cancelbutton" onClick={handleCancelClick}>
                        Cancel
                    </Button>
                    <Button type="submit"
                        fullWidth
                        variant="contained"
                        color="primary" className='submitbutton'
                        disabled={!isValid}
                    >Publish</Button>
                </Grid>
                </Grid>
            </form>
        </Box>
    );
};

export default FAQ;