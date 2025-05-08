import React, { useState } from "react";
import { Box, Typography, Button, TextField, InputAdornment } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { EditPipeLineMatrix } from '../index';
import EditIcon from '@mui/icons-material/Edit';
const PipelineDelivery = () => {
    const [editField, setEditField] = useState(null);
    const [values, setValues] = useState({
        systemLoad: 600000,
        drvAssigned: 5000,
        storageWithdraw: 1000,
        covePipeNomination: 500,
        dtiPipeNomination: 200,
        tcoPipeNomination: 3000,
        zone6PipeNomination: 200,
        zone5PipeNomination: 1000
    });

    const handleEditClick = (field) => {
        setEditField(field);
    };

    const handleChange = (e) => {
        setValues({ ...values, [editField]: e.target.value });
    };

    const handleBlur = () => {
        setEditField(null);
    };

    return (
        <>
            <Typography component="div" className='userprofilelist'>
                <Grid container direction="row" spacing={2} >
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} >
                        <Grid container >
                            <Grid size={{ xs: 12, sm: 12, md: 8 }} >
                                <Typography variant="h2" className='userprofilelistcontent'>PipeLine Delivery</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 8 }}>
                        <Grid container justifyContent="flex-end" className="PortalName">
                            <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                                <EditPipeLineMatrix />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container direction="row" spacing={2} className="PipeLineDelivery">
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} className="PipeLineDeliveryleft">
                        <Typography component="p" className="systemload"> SYSTEM LOAD<span>(FROM mORNING EMAIL)</span></Typography>



                        {editField === "systemLoad" ? (
                            <TextField
                                className="margin-20"
                                autoFocus
                                value={values.systemLoad}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                variant="outlined"
                                size="small"
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">Dth</InputAdornment>,
                                }}
                            />
                        ) : (
                            <Typography component="div" className="PipeLineDeliverycount">
                                {values.systemLoad}<span>Dth</span>
                                <EditIcon onClick={() => handleEditClick("systemLoad")} style={{ cursor: "pointer" }} />
                            </Typography>
                        )}

                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 9 }} className="PipeLineDeliveryright">
                        <Grid container >
                            <Grid size={{ xs: 12, sm: 12, md: 4 }} >
                                <Typography component="p" className="systemload">DRV Assigned <span>(IN PORTAL)</span></Typography>
                                {editField === "drvAssigned" ? (
                                    <TextField
                                        className="margin-20"
                                        autoFocus
                                        value={values.drvAssigned}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        variant="outlined"
                                        size="small"
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">Dth</InputAdornment>,
                                        }}
                                    />
                                ) : (
                                    <Typography component="div" className="PipeLineDeliverycount">
                                        {values.drvAssigned}<span>Dth</span>
                                        <EditIcon onClick={() => handleEditClick("drvAssigned")} style={{ cursor: "pointer" }} />
                                    </Typography>
                                )}
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 4 }} >
                                <Typography component="p" className="systemload">STORAGE WITHDRAW</Typography>
                                {editField === "storageWithdraw" ? (
                                    <TextField
                                        className="margin-20"
                                        autoFocus
                                        value={values.storageWithdraw}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        variant="outlined"
                                        size="small"
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">Dth</InputAdornment>,
                                        }}
                                    />
                                ) : (
                                    <Typography component="div" className="PipeLineDeliverycount">
                                        {values.storageWithdraw}<span>Dth</span>
                                        <EditIcon onClick={() => handleEditClick("storageWithdraw")} style={{ cursor: "pointer" }} />
                                    </Typography>
                                )}
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 4 }} >
                                <Typography component="p" className="systemload">REMAINING FT LOAD</Typography>
                                <Typography className="PipeLineDeliverycount">{values.drvAssigned - values.storageWithdraw} <span>Dth</span></Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container justifyContent="flex-end" className="PipeLineDeliverynone">
                    <Grid size={{ xs: 12, sm: 6, md: 12 }} >
                        <Typography component="p" className="assigned nomination Drymar-15">ASSIGNED DRV</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 12 }} >
                        <Typography component="p" className="assigned nomination">PIPE NOMINATION</Typography>
                    </Grid>
                </Grid>

                <Typography component="div" className="PipeLineDeliveryGrid PipeLineDelivery">
                    <Typography component="div" className="PipeLineDeliveryleft PipeLineDeliverywdith">
                        <Grid container justifyContent="flex-end">
                            <Grid size={{ xs: 12, sm: 3, md: 12 }} >
                                <Typography component="p" className="systemload">TCO</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 3, md: 12 }} className="none-tab">
                                <Typography component="p" className="assigned">ASSIGNED DRV</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 3, md: 12 }} >
                                <Typography component="p" className="PipeLinecountmin"><span>MIN</span>{(values.drvAssigned - values.storageWithdraw) * 0.45}<span>Dth</span></Typography>

                                <Typography component="p" className="PipeLinecountmin"><span>MAX</span> {(values.drvAssigned - values.storageWithdraw) * 0.80}<span>Dth</span></Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 3, md: 12 }} className="none-tab">
                                <Typography component="p" className="assigned">PIPE NOMINATION</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 12 }} >
                                <Grid container justifyContent="flex-end">
                                    {editField === "tcoPipeNomination" ? (

                                        <Grid size={{ xs: 12, sm: 12, md: 12 }} >
                                            <TextField
                                                autoFocus
                                                value={values.tcoPipeNomination}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                variant="outlined"
                                                size="small"
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="end">Dth</InputAdornment>,
                                                }}

                                            />
                                        </Grid>


                                    ) : (
                                        <Grid size={{ xs: 12, sm: 12, md: 12 }} >
                                            <Typography component="div" className="PipeLinecountmin">
                                                <Grid container justifyContent="flex-end" className="positionrelative">
                                                    <Grid size={{ xs: 12, sm: 6, md: 12 }} >
                                                        {values.tcoPipeNomination} <span>Dth</span>
                                                    </Grid>
                                                    <Grid size={{ xs: 12, sm: 6, md: 12 }} className="positionabsolute">
                                                        <EditIcon onClick={() => handleEditClick("tcoPipeNomination")} style={{ cursor: "pointer" }} />
                                                    </Grid>
                                                </Grid>
                                            </Typography>
                                        </Grid>


                                    )}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Typography>
                    <Typography component="div" className="PipeLineDeliveryleft PipeLineDeliverywdith">
                        <Grid container justifyContent="flex-end">
                            <Grid size={{ xs: 12, sm: 3, md: 12 }} >
                                <Typography component="p" className="systemload">ZONE 5</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 3, md: 12 }} className="none-tab">
                                <Typography component="p" className="assigned">ASSIGNED DRV</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 3, md: 12 }} >
                                <Typography component="p" className="PipeLinecountmin"><span>MIN</span>{(values.drvAssigned - values.storageWithdraw) * 0.10}<span>Dth</span></Typography>
                                <Typography component="p" className="PipeLinecountmin"><span>MAX</span>{(values.drvAssigned - values.storageWithdraw) * 0.30}<span>Dth</span></Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 3, md: 12 }} className="none-tab">
                                <Typography component="p" className="assigned">PIPE NOMINATION</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 12 }} >
                                <Grid container justifyContent="flex-end">
                                    {editField === "zone5PipeNomination" ? (
                                        <Grid size={{ xs: 12, sm: 12, md: 12 }} >
                                            <TextField
                                                autoFocus
                                                value={values.zone5PipeNomination}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                variant="outlined"
                                                size="small"
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="end">Dth</InputAdornment>,
                                                }}
                                            />
                                        </Grid>
                                    ) : (
                                        <Grid size={{ xs: 12, sm: 12, md: 12 }} >
                                            <Typography component="div" className="PipeLinecountmin">
                                                <Grid container justifyContent="flex-end" className="positionrelative">
                                                    <Grid size={{ xs: 12, sm: 6, md: 12 }} >

                                                        {values.zone5PipeNomination} <span>Dth</span>
                                                    </Grid>
                                                    <Grid size={{ xs: 12, sm: 6, md: 12 }} className="positionabsolute">
                                                        <EditIcon onClick={() => handleEditClick("zone5PipeNomination")} style={{ cursor: "pointer" }} />
                                                    </Grid>
                                                </Grid>
                                            </Typography>
                                        </Grid>
                                    )}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Typography>
                    <Typography component="div" className="PipeLineDeliveryleft PipeLineDeliverywdith">
                        <Grid container justifyContent="flex-end">
                            <Grid size={{ xs: 12, sm: 3, md: 12 }} >
                                <Typography component="p" className="systemload">ZONE 6</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 3, md: 12 }} className="none-tab">
                                <Typography component="p" className="assigned">ASSIGNED DRV</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 3, md: 12 }} >
                                <Typography component="p" className="PipeLinecountmin"><span>MIN</span>{(values.drvAssigned - values.storageWithdraw) * 0.05}<span>Dth</span></Typography>
                                <Typography component="p" className="PipeLinecountmin"><span>MAX</span>{(values.drvAssigned - values.storageWithdraw) * 0.15}<span>Dth</span></Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 3, md: 12 }} className="none-tab">
                                <Typography component="p" className="assigned">PIPE NOMINATION</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 12 }} >
                                <Grid container justifyContent="flex-end">
                                    {editField === "zone6PipeNomination" ? (
                                        <Grid size={{ xs: 12, sm: 12, md: 12 }} >
                                            <TextField
                                                autoFocus
                                                value={values.zone6PipeNomination}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                variant="outlined"
                                                size="small"
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="end">Dth</InputAdornment>,
                                                }}
                                            />
                                        </Grid>
                                    ) : (
                                        <Grid size={{ xs: 12, sm: 12, md: 12 }} >
                                            <Typography component="div" className="PipeLinecountmin">
                                                <Grid container justifyContent="flex-end" className="positionrelative">
                                                    <Grid size={{ xs: 12, sm: 6, md: 12 }} >
                                                    {values.zone6PipeNomination} <span>Dth</span>
                                                    </Grid>
                                                    <Grid size={{ xs: 12, sm: 6, md: 12 }} className="positionabsolute">
                                                        <EditIcon onClick={() => handleEditClick("zone6PipeNomination")} style={{ cursor: "pointer" }} />
                                                    </Grid>
                                                </Grid>
                                            </Typography>
                                        </Grid>
                                    )}
                                </Grid>
                            </Grid>
                          
                        </Grid>
                    </Typography>
                    <Typography component="div" className="PipeLineDeliveryleft PipeLineDeliverywdith">
                        <Grid container justifyContent="flex-end">
                            <Grid size={{ xs: 12, sm: 3, md: 12 }} >
                                <Typography component="p" className="systemload">DTI</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 3, md: 12 }} className="none-tab">
                                <Typography component="p" className="assigned">ASSIGNED DRV</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 3, md: 12 }} >
                                <Typography component="p" className="PipeLinecountmin"><span>MIN</span>{(values.drvAssigned - values.storageWithdraw) * 0.05}<span>Dth</span></Typography>
                                <Typography component="p" className="PipeLinecountmin"><span>MAX</span> {(values.drvAssigned - values.storageWithdraw) * 0.10}<span>Dth</span></Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 3, md: 12 }} className="none-tab"><Typography component="p" className="assigned">PIPE NOMINATION</Typography></Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 12 }} >
                                <Grid container justifyContent="flex-end">
                                    {editField === "dtiPipeNomination" ? (
                                        <Grid size={{ xs: 12, sm: 12, md: 12 }} >
                                            <TextField
                                                autoFocus
                                                value={values.dtiPipeNomination}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                variant="outlined"
                                                size="small"
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="end">Dth</InputAdornment>,
                                                }}
                                            />
                                        </Grid>
                                    ) : (
                                        <Grid size={{ xs: 12, sm: 12, md: 12 }} >
                                            <Typography component="div" className="PipeLinecountmin">
                                                <Grid container justifyContent="flex-end" className="positionrelative">
                                                    <Grid size={{ xs: 12, sm: 6, md: 12 }} >
                                                    {values.dtiPipeNomination} <span>Dth</span>
                                                    </Grid>
                                                    <Grid size={{ xs: 12, sm: 6, md: 12 }} className="positionabsolute">
                                                        <EditIcon onClick={() => handleEditClick("dtiPipeNomination")} style={{ cursor: "pointer" }} />
                                                    </Grid>
                                                </Grid>
                                            </Typography>
                                        </Grid>
                                    )}
                                </Grid>
                            </Grid>
                            {/* {editField === "dtiPipeNomination" ? (
                                <TextField
                                    autoFocus
                                    value={values.dtiPipeNomination}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    variant="outlined"
                                    size="small"
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">Dth</InputAdornment>,
                                    }}
                                />
                            ) : (
                                <Typography component="p" className="PipeLinecountmin">
                                    {values.dtiPipeNomination} <span>Dth</span>
                                    <EditIcon onClick={() => handleEditClick("dtiPipeNomination")} style={{ cursor: "pointer" }} />
                                </Typography>
                            )} */}
                        </Grid>
                    </Typography>
                    <Typography component="div" className="PipeLineDeliveryleft PipeLineDeliverywdith">
                        <Grid container justifyContent="flex-end">
                            <Grid size={{ xs: 12, sm: 3, md: 12 }} >
                                <Typography component="p" className="systemload">COVE POINT</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 3, md: 12 }} className="none-tab">
                                <Typography component="p" className="assigned">ASSIGNED DRV</Typography></Grid>
                            <Grid size={{ xs: 12, sm: 3, md: 12 }} ><Typography component="p" className="PipeLinecountmin"><span>MIN</span>{(values.drvAssigned - values.storageWithdraw) * 0.0}<span>Dth</span></Typography>
                                <Typography component="p" className="PipeLinecountmin"><span>MAX</span>{(values.drvAssigned - values.storageWithdraw) * 0.45}<span>Dth</span></Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 3, md: 12 }} className="none-tab"> <Typography component="p" className="assigned">PIPE NOMINATION</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 12 }} >
                                <Grid container justifyContent="flex-end">
                                    {editField === "covePipeNomination" ? (
                                        <Grid size={{ xs: 12, sm: 12, md: 12 }} >
                                            <TextField
                                                autoFocus
                                                value={values.covePipeNomination}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                variant="outlined"
                                                size="small"
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="end">Dth</InputAdornment>,
                                                }}
                                            />
                                        </Grid>
                                    ) : (
                                        <Grid size={{ xs: 12, sm: 12, md: 12 }} >
                                            <Typography component="div" className="PipeLinecountmin">
                                                <Grid container justifyContent="flex-end" className="positionrelative">
                                                    <Grid size={{ xs: 12, sm: 6, md: 12 }} >
                                                    {values.covePipeNomination} <span>Dth</span>
                                                    </Grid>
                                                    <Grid size={{ xs: 12, sm: 6, md: 12 }} className="positionabsolute">
                                                        <EditIcon onClick={() => handleEditClick("covePipeNomination")} style={{ cursor: "pointer" }} />
                                                    </Grid>
                                                </Grid>
                                            </Typography>
                                        </Grid>
                                    )}
                                </Grid>
                            </Grid>
                            {/* {editField === "covePipeNomination" ? (
                                <TextField
                                    autoFocus
                                    value={values.covePipeNomination}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    variant="outlined"
                                    size="small"
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">Dth</InputAdornment>,
                                    }}
                                />
                            ) : (
                                <Typography component="p" className="PipeLinecountmin">
                                    {values.covePipeNomination} <span>Dth</span>
                                    <EditIcon onClick={() => handleEditClick("covePipeNomination")} style={{ cursor: "pointer" }} />
                                </Typography>
                            )} */}
                        </Grid>
                    </Typography>





                </Typography>
            </Typography >
            <Grid size={{ xs: 12, sm: 12, md: 12 }} className="Personal-Information">
                <Button variant="contained" color="red" className="cancelbutton"  >
                    Cancel
                </Button>
                <Button type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className='submitbutton'
                >
                    Save
                </Button>
            </Grid>

        </>
    )
}

export default PipelineDelivery;