import React, { useState } from 'react';
import { Modal, Button, TextField, MenuItem, Select, FormControl, InputLabel, TextareaAutosize, Box, Typography } from '@mui/material';
import Grid from "@material-ui/core/Grid";
import { labels } from "_utils/labels";
import Link from "@material-ui/core/Link";
import { logo } from 'images';
import { CustomTextArea,CommonSelect,CustomComments ,AutocompleteInput,DropdownTableInput} from '_components';

const RejectReason = ({ open, onConfirm, handleClose,initialData }) => {
    const [reason, setReason] = useState('');
    const [newReason, setNewReason] = useState('');
    const [comments, setComments] = useState('');
    const reasonList = initialData;
    // const reasonList = [
    //     { label: 'Invalid or unknown company', value: 'invalidCompany' },
    //     { label: 'Invalid email address', value: 'invalidEmail' },
    //     { label: 'Invalid tax ID', value: 'invalidTaxID' },
    //     { label: 'Other (add new reason)', value: 'other' }
    // ]

    const PipelineStatus = [
        { value: 1, label: "Actual DRV Consumption" },
        { value: 2, label: "Storage & Payback" }
    ];

    const reasons = initialData?.map(option => ({ value: option.ReasonID, label: option.ReasonName })) || [];

console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaa",initialData);
    const handleReasonChange = (event) => {
        setReason(event.target.value);
        if (event.target.value !== 'other') {
            setNewReason('');
        }
    };

    const [isDisable,setIsDisable] = useState(false);

    const handleNewReasonChange = (value) => {
        setNewReason(value);
        console.log('ajgdjasgdjagda',value);
        if(value === 0){
            setIsDisable(false)
        }
        else{
            setIsDisable(true);
        }
    };

    const handleCommentsChange = (value) => {
        setComments(value);
        console.log("comments=====================",value);
        console.log("hasdkhdkhsakdh",comments)
    };

    const handleConfirm = () => {
        // const rejectionReason = reason === 'other' ? newReason : reason;
        onConfirm(newReason, comments);
    };

    return (
        <Modal
            open={open}
            aria-labelledby="child-modal-title"
            aria-describedby="child-modal-description"
        >
            <Box className="modalpopup inputtags RejectioninputModal ">
                <Box className="row modalpopupinner">
                    <Grid item xs={12} className="forgotpassword p-0">
                        <Link href="#" variant="logo" className="wgllogo">
                            <img src={logo} alt="logo"></img>
                            {labels.eServicePortal}
                        </Link>
                        <Typography component="h2" variant="body1">
                            Rejection Reason
                        </Typography>
                    </Grid>
                    <Box className="p-0">
                        {/* <FormControl fullWidth margin="normal"className='Rejectioninput'>
                            <InputLabel id="reject-reason-label">Select Reason for Rejection</InputLabel>
                            <Select
                                labelId="reject-reason-label"
                                value={reason}
                                onChange={(value)=>handleNewReasonChange(value)}
                            >
                                {reasonList.map((option) => (
                                    <MenuItem key={option.ReasonID} value={option.ReasonID}>
                                        {option.ReasonName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl> */}
                        <Grid container>
                            <Grid xs={12} sm={12} md={12}>
                                <Grid component='div' style={{ width:'100%'}}>
                                <DropdownTableInput
              value={newReason}
              label={`Select Reason`}
              onChange={(value) => handleNewReasonChange(value)}
              options={reasons}
            
            />

                                </Grid>
            

                            </Grid>


                        </Grid>
           
                        {/* <CommonSelect placeholder="Select Reason to Reject" value={newReason} onChange={(value) => handleNewReasonChange(value)} options={reasons} /> */}
                        {/* <CommonSelect
                        label="Select Reason"
                        options={initialData}/>
                        {reason === 'other' && (
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Enter new reason"
                                value={newReason}
                                onChange={handleNewReasonChange}
                                aria-label="Enter new reason"
                            />
                        )} */}
                                <CustomComments
                                label="Comments (Optional)"
                                maxLength={1000}
                                value={comments}
                                onChange={(e)=>handleCommentsChange(e.target.value)}
                            
                            />
                        {/* <TextareaAutosize
                            minRows={4}
                            label="Comments"
                            placeholder="Comments (optional)"
                            style={{ width: '100%', marginTop: '16px' }}
                            value={comments}
                            onChange={(value)=>handleCommentsChange(value)}
                            aria-label="Comments"
                        />  */}

                        {/* <Typography component="div" className="CreateMarketerbutton"> */}
                        {/* <Button
                            variant="contained"
                            className='submitbutton'
                            color="primary"
                            onClick={handleConfirm}
                            disabled={reason === '' || (reason === 'other' && newReason.trim() === '')} w
                        >
                            Confirm
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            className="cancelbutton"
                            onClick={handleClose}
                        >
                            Cancel
                        </Button> */}
                        {/* </Typography> */}
                        <Box className="Filtercontainerinner">
                                                <Typography component="div" className="CreateMarketerbutton">
                                                    <Button
                                                        type="submit"
                                                        variant="contained"
                                                        className='submitbutton'
                                                        color="primary"
                                                        //disabled={!isFormValid}
                                                        onClick={handleConfirm}
                                                        disabled={!isDisable}
                                                    >
                                                        Confirm
                                                    </Button>
                                                    <Button variant="contained" color="red" className="cancelbutton" 
                                                    // onClick={handleCancelClick}
                                                    onClick={handleClose}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </Typography>
                                                </Box>
                        {/* <Box className="Filtercontainerinner">
                        <Typography component="div" className="CreateMarketerbutton ">
                        <Button variant="contained" color="red" className="cancelbutton"  onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className='submitbutton'

                            // disabled={!isDataChanged} >
                            >
                                Save
                            </Button>
                             
                            
                             
                       
                        </Typography>
                        </Box> */}
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};

export default RejectReason;