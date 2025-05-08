import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Button, TextField, InputAdornment, Paper } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { EditPipeLineMatrix,PipelineDownload } from '../../index';
import EditIcon from '@mui/icons-material/Edit';
import { nominationsAction, alertActions, } from '_store';
import { codiconsave, materialsymbolsclose } from "images";
const PipelineDelivery = () => {
    const header = "PipeLine Delivery Guide";
    const [data, setData] = useState();
    const [pipelineGuide, setPipelineGuide] = useState(data?.PipeLines);
    const [pipeLines, setPipeLines] = useState(data?.PipeLines);
    const [editField, setEditField] = useState(null);
    const dispatch = useDispatch();
    const [isMetrixOpen,setIsMetrixopen] = useState(false);
    // const nominations = useSelector(x => x.delivery?.deliveryGuide);
    const authUser = useSelector(x => x.auth?.value);
    const userProfiles = useSelector(x => x.userProfile?.userProfileData);
    const user = authUser?.Data;
    const userAccess= user?.UserAccess;
    const isAdmin = userAccess?.some(access => access.Role.toLowerCase().includes('admin'));
    const [isEdited, setIsEdited] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            dispatch(alertActions.clear());
            try {
                const result = await dispatch(nominationsAction.getDeliveryGuide()).unwrap();
                const deliveryGuide = result?.Data;
                console.log('deliveryguide------------',deliveryGuide);
                setData(deliveryGuide)
                // setData(pipelineGuideData?.Data);
               
            } catch (error) {
                dispatch(alertActions.error({
                    message: error?.message || error,
                    header: `${header} Failed`
                }));
            }
        };
        fetchData();
    }, [dispatch]);
    useEffect(()=>{
        if(data){
            setPipelineGuide(data?.PipelineGuide || {});
            setPipeLines(data?.PipeLines || []);
        }
    },[data])

    const handleGuideChange = (field, value) => {
        setPipelineGuide((prev) => ({ ...prev, [field]: value }));
    };

    const handlePipelineChange = (index, field, value) => {
        setPipeLines((prev) => {
            const updatedPipelines = [...prev];
            updatedPipelines[index] = {
                ...updatedPipelines[index],
                [field]: value
            };
            return updatedPipelines;
        });
    };

    useEffect(() => {
        if (data) {
          setPipelineGuide(data.PipelineGuide || {});
          setPipeLines(data.PipeLines || []);
        }
      }, [data]);
    
      // Check if form is edited
      useEffect(() => {
        if (!data) return;
    
        const guideChanged = isPipelineGuideChanged(data?.PipelineGuide, pipelineGuide);
        const linesChanged = isPipeLinesChanged(data?.PipeLines, pipeLines);
    
        setIsEdited(guideChanged || linesChanged);
      }, [pipelineGuide, pipeLines, data]);
      const isPipelineGuideChanged = (original, current) => {
        return original?.SystemLoad !== current?.SystemLoad ||
          original?.DRVAssigned !== current?.DRVAssigned ||
          original?.StorageWithdraw !== current?.StorageWithdraw;
      };
    
      const isPipeLinesChanged = (originalList = [], currentList = []) => {
        return currentList.some((curr, index) => {
          const orig = originalList[index];
          return curr?.PipeNomination !== orig?.PipeNomination;
        });
      };
    const handleEditClick = (field) => {
        setEditField(field);
    };

    const handleBlur = () => {
        setEditField(null);
    };
    const handleRefresh = async ()=> {

        const result = await dispatch(nominationsAction.getDeliveryGuide()).unwrap();
        const deliveryGuide = result?.Data;
          setData(deliveryGuide);
    }



    const handleLoadSave = async () => {
        try{
            const remainingFTLoad = pipelineGuide?.DRVAssigned - pipelineGuide?.StorageWithdraw;
            const transformedData = {

                PipelineGuide: {
                    SystemLoad: Number(pipelineGuide?.SystemLoad) || 0,
                    DRVAssigned: Number(pipelineGuide?.DRVAssigned) || 0,
                    StorageWithdraw: Number(pipelineGuide?.StorageWithdraw) || 0,
                    RemainingFTLoad: remainingFTLoad
                },
                PipeLines: pipeLines.map(pipeline => ({
                    MatrixID: pipeline?.MatrixID || 0,  // Ensure MatrixID is included
                    PipeNomination: Number(pipeline?.PipeNomination) || 0,
                    PipelineName: pipeline?.PipelineName || "string",
                    MinValue: pipeline?.MinValue?.toString() || "0",
                    MaxValue: pipeline?.MaxValue?.toString() || "0"
                }))
            };
            let result;
            if (transformedData) {
                result = await dispatch(nominationsAction.updateGuide(transformedData));
                
                dispatch(alertActions.success(`System Load Updated Successfully`));
            }
            if (result?.error) {
                dispatch(alertActions.error({ message: result?.payload || result?.error.message, header: header }));
                return;
            }
            handleRefresh();
        }catch (error) {
            dispatch(alertActions.error({ message: error?.message || error, header: header }));
        }
    } 
    const handleSave = async () => {
        try {
            const remainingFTLoad = pipelineGuide?.DRVAssigned - pipelineGuide?.StorageWithdraw;
            const totalPipeNomination = pipeLines?.reduce((sum, pipeline) => sum + Number(pipeline?.PipeNomination || 0), 0);

            if (remainingFTLoad !== totalPipeNomination) {
                dispatch(alertActions.error({
                    message: `Remaining FT Load (${remainingFTLoad} Dth) must be equal to the total pipeline nominations (${totalPipeNomination} Dth).`,
                    header: "Validation Error"
                }));
                return;
            }

            const transformedData = {

                PipelineGuide: {
                    SystemLoad: Number(pipelineGuide?.SystemLoad) || 0,
                    DRVAssigned: Number(pipelineGuide?.DRVAssigned) || 0,
                    StorageWithdraw: Number(pipelineGuide?.StorageWithdraw) || 0,
                    RemainingFTLoad: remainingFTLoad
                },
                PipeLines: pipeLines.map(pipeline => ({
                    MatrixID: pipeline?.MatrixID || 0,  // Ensure MatrixID is included
                    PipeNomination: Number(pipeline?.PipeNomination) || 0,
                    PipelineName: pipeline?.PipelineName || "string",
                    MinValue: pipeline?.MinValue?.toString() || "0",
                    MaxValue: pipeline?.MaxValue?.toString() || "0"
                }))
            };

            console.log("transformed------", JSON.parse(JSON.stringify(transformedData)));
            console.log("transformed--------------",transformedData);
         
            let result;
            if (transformedData) {
                result = await dispatch(nominationsAction.updateGuide(transformedData));
                let message = result?.payload?.Message;
                dispatch(alertActions.success({message}));
            }
            if (result?.error) {
                dispatch(alertActions.error({ message: result?.payload || result?.error.message, header: header }));
                return;
            }
            handleRefresh();
        } catch (error) {
            dispatch(alertActions.error({ message: error?.message || error, header: header }));
        }

    };
    const handleCancelClick = async () => {
        handleRefresh();
    };
    const handleCancelClicked = async () => {
        handleRefresh();
        setEditField(null);
    };

    return (
        <>
            <Typography component="div" className='userprofilelist'>
                <Grid container direction="row" spacing={2} >
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} >
                        <Grid container >
                            <Grid size={{ xs: 12, sm: 12, md: 8 }} >
                                <Typography variant="h2" className='userprofilelistcontent'><span>{isMetrixOpen ? "Pipeline Delivery Matrix" : "PipeLine Delivery"}</span></Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    {/* <Grid size={{ xs: 12, sm: 6, md: 8 }}>
                        <Grid container justifyContent="flex-end" className="PortalName">
                            <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                                <PipelineDownload/>
                                <EditPipeLineMatrix setIsMetrixopen={setIsMetrixopen}/>
                            </Grid>
                        </Grid>
                    </Grid> */}
                    <Grid size={{ xs: 12, sm: 12, md: 8 }} >
                                <Grid container spacing={2} justifyContent="flex-end" className="MarketerManagement">
                                    <Grid size={{ xs: 12, sm: 12, md: 8 }} >
                                        <Grid container spacing={2} justifyContent="flex-end">
                                            <Grid size={{ xs: 6, sm: 6, md: 4 }}>
                                            <PipelineDownload data={data}/>
                                            </Grid>
                                            <Grid size={{ xs: 6, sm: 6, md: 4 }}>
                                            <EditPipeLineMatrix setIsMetrixopen={setIsMetrixopen} handleGuideRefresh={handleRefresh}/>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                </Grid>
                <Grid container direction="row" spacing={2} className="PipeLineDelivery">
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} className="PipeLineDeliveryleft">
                        <Typography component="p" className="systemload"> SYSTEM LOAD<span>(FROM mORNING EMAIL)</span></Typography>



                        { isAdmin && editField === "SystemLoad" ? (
                            // <TextField
                            //     className="margin-20"
                            //     autoFocus
                            //     value={pipelineGuide?.SystemLoad}
                            //     onChange={(e) => handleGuideChange("SystemLoad", e.target.value)}
                            //     onBlur={handleBlur}
                            //     variant="outlined"
                            //     size="small"
                            //     InputProps={{
                            //         endAdornment: <InputAdornment position="end">Dth</InputAdornment>,
                            //     }}
                            // />
                            <Box className="PipeLinecontainer">
                            <TextField
                                className="margin-20"
                                autoFocus
                                value={pipelineGuide?.SystemLoad}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^\d{0,9}$/.test(value)) {
                                        handleGuideChange("SystemLoad", e.target.value)
                                    }
                                  }}
                                // onChange={(e) => }
                                onBlur={handleBlur}
                                variant="outlined"
                                size="small"
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">Dth</InputAdornment>,
                                }}
                            />
                            <Typography component="div" className=" PipeLinesaveicon">
                                
                                <Button className='materialsymbolsclose' type="button" variant="contained" color="primary"  onMouseDown={(e) => e.preventDefault()} onClick={handleCancelClicked}>
                                    <img src={materialsymbolsclose} alt='materialsymbolsclose'></img>
                                </Button>
                                <Button className='Filter' type="button" variant="contained" color="primary" onMouseDown={(e) => e.preventDefault()} onClick={handleLoadSave}>
                                    <img src={codiconsave} alt='codiconsave'></img>
                                </Button>
                            </Typography>
                        </Box>
                        ) : (
                            <Typography component="div" className="PipeLineDeliverycount">
                                {pipelineGuide?.SystemLoad}<span>Dth</span>
                                <EditIcon onClick={() => handleEditClick("SystemLoad")} style={{ cursor: "pointer" }} />
                            </Typography>
                        )}

                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 9 }} className="PipeLineDeliveryright">
                        <Grid container >
                            <Grid size={{ xs: 12, sm: 12, md: 4 }} >
                                <Typography component="p" className="systemload">DRV Assigned <span>(IN PORTAL)</span></Typography>
                                {isAdmin && editField === "DRVAssigned" ? (
                                    <TextField
                                        className="margin-20"
                                        autoFocus
                                        value={pipelineGuide?.DRVAssigned}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^\d{0,9}$/.test(value)) {
                                                handleGuideChange("DRVAssigned", e.target.value)}
                                            }
                                        }
                                        onBlur={handleBlur}
                                        variant="outlined"
                                        size="small"
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">Dth</InputAdornment>,
                                        }}
                                    />
                                ) : (
                                    <Typography component="div" className="PipeLineDeliverycount">
                                        {pipelineGuide?.DRVAssigned}<span>Dth</span>
                                        <EditIcon onClick={() => handleEditClick("DRVAssigned")} style={{ cursor: "pointer" }} />
                                    </Typography>
                                )}
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 4 }} >
                                <Typography component="p" className="systemload">STORAGE WITHDRAWAL</Typography>
                                {isAdmin && editField === "StorageWithdraw" ? (
                                    <TextField
                                        className="margin-20"
                                        autoFocus
                                        value={pipelineGuide?.StorageWithdraw}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^\d{0,9}$/.test(value)) {
                                                handleGuideChange("StorageWithdraw", e.target.value)}
                                            }
                                        }
                                        onBlur={handleBlur}
                                        variant="outlined"
                                        size="small"
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">Dth</InputAdornment>,
                                        }}
                                    />
                                ) : (
                                    <Typography component="div" className="PipeLineDeliverycount">
                                        {pipelineGuide?.StorageWithdraw}<span>Dth</span>
                                        <EditIcon onClick={() => handleEditClick("StorageWithdraw")} style={{ cursor: "pointer" }} />
                                    </Typography>
                                )}
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 4 }} >
                                <Typography component="p" className="systemload">REMAINING FT LOAD</Typography>
                                <Typography className="PipeLineDeliverycount">{pipelineGuide?.DRVAssigned - pipelineGuide?.StorageWithdraw} <span>Dth</span></Typography>
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
                  

                        {pipeLines?.map((pipeline, index) => (
                              <Typography component="div" className="PipeLineDeliveryleft PipeLineDeliverywdith">
                                <Grid container justifyContent="flex-end">
                                    <Grid size={{ xs: 12, sm: 3, md: 12 }} >

                                        <Typography component="p" className="systemload">{pipeline?.PipelineName}</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 3, md: 12 }} className="none-tab">
                                        <Typography component="p" className="assigned">Assigned DRV</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 3, md: 12 }} >
                                    <Typography component="p" className="PipeLinecountmin"><span>MIN</span>{(() => {
  const value =
    (pipelineGuide?.DRVAssigned - pipelineGuide?.StorageWithdraw) *
    (pipeline?.MinValue / 100);

  return Number.isInteger(value) ? value : value.toFixed(2);
})()}
</Typography>
<Typography component="p" className="PipeLinecountmin"><span>MIN</span>{(() => {
  const value =
    (pipelineGuide?.DRVAssigned - pipelineGuide?.StorageWithdraw) *
    (pipeline?.MaxValue / 100);

  return Number.isInteger(value) ? value : value.toFixed(2);
})()}
</Typography>
                                        {/* <Typography component="p" className="PipeLinecountmin"><span>MIN</span>{(pipelineGuide?.DRVAssigned - pipelineGuide?.StorageWithdraw) * (pipeline?.MinValue / 100)}<span>Dth</span></Typography>
                                        <Typography component="p" className="PipeLinecountmin"><span>Max</span>{(pipelineGuide?.DRVAssigned - pipelineGuide?.StorageWithdraw) * (pipeline?.MaxValue / 100)}<span>Dth</span></Typography> */}
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 3, md: 12 }} className="none-tab">
                                        <Typography component="p" className="assigned">Pipe Nomination</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6, md: 12 }} >
                                        <Grid container justifyContent="flex-end">
                                            { isAdmin && editField === `PipeNomination_${index}` ? (

                                                <TextField
                                                    autoFocus
                                                    variant="outlined"
                                                    value={pipeline?.PipeNomination}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        if (/^\d{0,9}$/.test(value)) {
                                                            handlePipelineChange(index, "PipeNomination", e.target.value)}
                                                        }
                                                    }
                                                    onBlur={handleBlur}
                                                    size="small"
                                                    InputProps={{ endAdornment: <InputAdornment position="end">Dth</InputAdornment> }}
                                                />

                                            ) : (
                                                <Grid size={{ xs: 12, sm: 12, md: 12 }} >
                                                    <Typography component="div" className="PipeLinecountmin">
                                                        <Grid container justifyContent="flex-end" className="positionrelative">
                                                            <Grid size={{ xs: 12, sm: 6, md: 12 }} >
                                                                {pipeline?.PipeNomination} <span>Dth</span>
                                                            </Grid>
                                                            <Grid size={{ xs: 12, sm: 6, md: 12 }} className="positionabsolute">
                                                                <EditIcon onClick={() => handleEditClick(`PipeNomination_${index}`)} style={{ cursor: "pointer" }} />
                                                            </Grid>
                                                        </Grid>
                                                    </Typography>
                                                </Grid>
                                            )}

                                        </Grid>
                                    </Grid>
                                </Grid>
                                </Typography>
                        ))}

                    
                </Typography>
            </Typography>
            <Grid size={{ xs: 12, sm: 12, md: 12 }} className="Personal-Information">
                <Button variant="contained" color="red" className="cancelbutton" onClick={handleCancelClick} >
                    Cancel
                </Button>
                <Button type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className='submitbutton'
                    onClick={handleSave}
                    disabled={!isEdited}
                >
                    Save
                </Button>
            </Grid>

        </>
    )
}

export default PipelineDelivery;