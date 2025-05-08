import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { alertActions, nominationsAction } from '_store';
import { Typography, Button, Box, TextField, InputAdornment } from '@mui/material';
import Popper from '@mui/material/Popper';
import Grid from "@material-ui/core/Grid";
import { MaterialReactTable } from 'material-react-table';
import { codiconsave, materialsymbolsclose } from "images";
import { CommonSelect } from '_components';
import EditIcon from "@mui/icons-material/Edit";
const EditPipeLineMatrix = ({setIsMetrixopen,handleGuideRefresh}) => {
    const header = "PipeLine Delivery Matrix";
    const dispatch = useDispatch();
    const authUser = useSelector(x => x.auth?.value);
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [data,setData] = useState();
    const [matrixTypeName, setMatrixTypeName] = useState(1);
    const [tableData, setTableData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const authUserId = useSelector(x => x.auth?.userId);
    const [invalidFields, setInvalidFields] = useState({});
    const [invalidRanges, setInvalidRanges] = useState([]);
    const [volumeLimit,setVolumeLimit] = useState([]);
    const [editingIndexes, setEditingIndexes] = useState({});
    const [editedMessages, setEditedMessages] = useState({});
    const PipelineStatus = [
        { value: 1, label: "Actual DRV Consumption" },
        { value: 2, label: "Storage & Payback" }
    ];
    const [highlightIndices, setHighlightIndices] = useState([]); // Declare state variable

    useEffect(() => {
        // console.log('authed-user',`${authUser.Data.UserDetails.FirstName} ${authUser.Data.UserDetails.LastName}`);
        const fetchData = async () => {
            dispatch(alertActions.clear());
            try {
                const result = await dispatch(nominationsAction.getDeliveryMatrix(matrixTypeName)).unwrap();
                const deliveryGuide = result;
                console.log('deliveryguideMatrix------------',deliveryGuide);
                setData(deliveryGuide);
                setVolumeLimit(Object.values(deliveryGuide?.Data?.VolumsLimit));
                // setTableData(deliveryGuide)
                // setData(pipelineGuideData?.Data);
               
            } catch (error) {
                dispatch(alertActions.error({
                    message: error?.message || error,
                    header: `${header} Failed`
                }));
            }
        };
        fetchData();
    }, [dispatch,matrixTypeName,setData]);
    useEffect(() => {
        const { transformedRows, columns } = transformDataForMRT(data);
        setTableData(transformedRows);
        setOriginalData(transformedRows);
        setColumns(columns);
    }, [data]);

    const handleRefresh = async ()=> {

        const result = await dispatch(nominationsAction.getDeliveryMatrix(matrixTypeName)).unwrap();
        const deliveryGuide = result;
        setData(deliveryGuide);
        setVolumeLimit(Object.values(deliveryGuide?.Data?.VolumsLimit));
    }

    const handleClick = (event) => {
        setIsMetrixopen((prev) => !prev);
        setAnchorEl(event.currentTarget);
        setOpen((previousOpen) => !previousOpen);
    };

    const handleCancelClick = async(event) => {
       await  handleRefresh();
        handleClick(event);
    };

    const handleVolumeCancel = async (index) => {
        await  handleRefresh(); 
        setEditingIndexes(prev => ({
            ...prev,
            [index]: false,
          }));
    }

    useEffect(() => {
        if (volumeLimit.length && Object.keys(editedMessages).length === 0) {
          const initMessages = {};
          volumeLimit.forEach(item => {
            initMessages[item.KeyName] = item.Message;
          });
          setEditedMessages(initMessages);
        }
      }, [volumeLimit, editedMessages,data]);

    const handleVolumeEdit = (index, key, currentMessage) => {
        setEditingIndexes(prev => ({ ...prev, [index]: true }));
        setEditedMessages(prev => ({ ...prev, [key]: currentMessage }));
      };

      const handleVolumeChange = (key, value) => {
        setEditedMessages(prev => ({ ...prev, [key]: value }));
        // onMessagesChange?.(key, value); // notify parent if needed
      };
      const handleBlur = (index) => {
        // When input loses focus, exit edit mode
        setEditingIndexes(prev => ({ ...prev, [index]: false }));
      };
    const handleSubmit = async () => {
        try{
            
            const newHighlightIndices = []; // Temporary array to store cells to highlight
            for (const row of tableData) {
                for (const key of Object.keys(row)) {
                  if (key !== 'Range') {
                    const value = row[key];
                    if (!value || !value.includes(" - ")) continue;
          
                    const [minStr, maxStr] = value.split(" - ");
                    const min = parseFloat(minStr.trim());
                    const max = parseFloat(maxStr.trim());
          
                    if (isNaN(min) || isNaN(max)) {
                        dispatch(alertActions.error({
                            message: `pipeline  min and max values should not be null`,
                            header: header,
                        }));
                        return; // stop submission
                    }
          
                    if (min >= max) {
                    //   dispatch(alertActions.error({
                    //     message: `In "${key}" column, Min value (${min}%) should be less than Max value (${max}%) in range "${row.Range}".`,
                    //     header: header,
                    //   }));


                    //   highlightIndices.push({range:row.Range, column:key});
                      newHighlightIndices.push(`${key}-${row.Range}`); // Add the cell to highlight array
                    //   console.log("MismAtch",newHighlightIndices);
                    //   console.log(`Highlighting cell: ${key}-${row.Range}`); // Log the highlighted cel
                    }
                  }
                }
              }
                // Update state with new highlight indices
            setHighlightIndices(newHighlightIndices);
                      // Check if there are any highlight cells
        if (newHighlightIndices.length > 0) {
            dispatch(alertActions.error({
                message: `The maximum value cannot be lower than the minimum value`,
                header: header,
            }));
            // console.log(newHighlightIndices);
            return; // Stop submission if there are errors
        }
        // console.log("saaaaaaaaaaaaaaaaaa",highlightIndices)
            const formattedData = tableData.map((row, index) => {
                // Extract range values
                const rangeParts = row.Range.split("-");
                const isLastRow = index === tableData.length - 1; // Check if it's the last row
        
                const rangeMin = parseInt(rangeParts[0]?.trim().replace(/,/g, ""), 10);
                let rangeMax = 0; // Default 0 for last row
        
                if (!isLastRow) {
                    rangeMax = parseInt(rangeParts[1]?.trim().replace(/,/g, ""), 10);
                }
        
                return {
                    Range: isLastRow ? `${rangeMin}+` : row.Range, // Append + for last row
                    RangeID: index + 1, // Adjust RangeID if needed
                    RangeMinValue: rangeMin,
                    RangeMaxValue: isLastRow ? 0 : rangeMax, // Ensure last row max is 0
                    CreatedBy: `${authUser?.Data?.UserDetails?.FirstName} ${authUser?.Data?.UserDetails?.LastName}`,
                    Matrix: Object.keys(row)
                        .filter((key) => key !== "Range")
                        .map((pipelineName, idx) => {
                            const [min, max] = row[pipelineName]
                                .split(" - ")
                                .map((v) => parseInt(v.trim(), 10));
        
                            // Find matching pipeline from the database data
                            const pipelineData = data?.Data?.Data?.find((item) =>
                                item.Matrix.some((m) => m.PipelineName === pipelineName)
                            )?.Matrix.find((m) => m.PipelineName === pipelineName);
        
                            return {
                                MatrixID: 0, // Use existing ID or generate new one
                                PipelineID: pipelineData?.PipelineID, // Use existing ID or generate new one
                                MatrixTypeID: pipelineData?.MatrixTypeID || 1, // Adjust as needed
                                MatrixTypeName: pipelineData?.MatrixTypeName || "",
                                PipelineName: pipelineName,
                                MinValue: min,
                                MaxValue: max,
                                PipeNomination: pipelineData?.PipeNomination || "", // Use existing or set default
                            };
                        }),
                };
            });
        
            // console.log("Formatted Data:", formattedData);
        
            let result;
            if (formattedData) {
                result = await dispatch(nominationsAction.updateDeliveryMatrix(formattedData));
                let message = result?.payload?.Message;
                dispatch(alertActions.success({message}));
                setHighlightIndices([])
                handleGuideRefresh();
                setHighlightIndices([]);
            }
            // const formatedVolumeData = volumeLimit.map(item => ({
            //     ID: item.ID,
            //     Message: editedMessages[item.KeyName] || item.Message
            //   }))
            //   console.log(formatedVolumeData);
            //   if (formatedVolumeData) {
            //     await dispatch(nominationsAction.updateGasVolume(formatedVolumeData));
           
            // }
            if (result?.error) {
                console.log(result?.error?.message);
                let message = (result?.error?.message ==="Rejected")? `Maximum Daily Requirements Volume (DRV) range limit cannot exceed 999,999,999.`: (result?.payload || result?.error.message);
                dispatch(alertActions.error({ message: message, header: header }));
                return;
            }
        }catch (error) {
            dispatch(alertActions.error({ message: error?.message || error, header: header }));
        }
       
    };

    // const handleVolumeSubmit = () => {
    //                 const formatedVolumeData = volumeLimit.map(item => ({
    //             ID: item.ID,
    //             Message: editedMessages[item.KeyName] || item.Message
    //           }))
    //           console.log(formatedVolumeData);
    //           console.log(editedMessages);
    //           console.log(editingIndexes);
    //         //   if (formatedVolumeData) {
    //         //     await dispatch(nominationsAction.updateGasVolume(formatedVolumeData));
           
    //         // }
    // }

    const handleVolumeSubmit = async (index, keyName) => {
        const updatedMessage = editedMessages[keyName];
        const originalMessage = volumeLimit[index]?.Message;
        const id = volumeLimit[index]?.ID;
        if (updatedMessage !== undefined && updatedMessage !== originalMessage) {

           
          try {
        //     // Make API call to send only keyName and updated message
        //     await axios.post('/your-api-endpoint', {
        //       keyName: keyName,
        //       message: updatedMessage,
        //     });
    
        //     // Update local UI after saving
        //     const updatedVolumeLimit = [...volumeLimit];
        //     updatedVolumeLimit[index].Message = updatedMessage;
        //     setVolumeLimit(updatedVolumeLimit);
        const transformed = {
            ID:id,
            Message: updatedMessage
        }
        console.log(transformed);
        // if (transformed) {
                    let result = await dispatch(nominationsAction.updateGasVolume(transformed));
                    if (result?.error) {
                        dispatch(alertActions.error({ message: result?.payload || result?.error.message, header: header }));
                        return;
                    }
                    handleRefresh();
                    // }
          } catch (error) {
            console.error('Failed to save message:', error);
          }
        }
    
        // Exit editing mode
        setEditingIndexes(prev => ({
          ...prev,
          [index]: false,
        }));
      };
    
    


    const transformDataForMRT = (apiData) => {
        const transformedRows = [];
        const uniquePipelines = new Set();

        apiData?.Data?.Data?.forEach((entry) => {
            const row = { Range: entry.Range };
            entry.Matrix.forEach((matrix) => {
                const pipelineName = matrix.PipelineName;
                uniquePipelines.add(pipelineName);
                row[pipelineName] = `${matrix.Min} - ${matrix.Max}`;
            });
            transformedRows.push(row);
        });

        // const handleRangeInputChange = (rowIndex, newMaxValue) => {
        //     setTableData((prevData) => {
        //         let updatedData = [...prevData];
        
        //         // Parse and sanitize input values
        //         let [minValue, oldMax] = updatedData[rowIndex].Range.split("-").map(val => val.trim());
        
        //         let newMax = newMaxValue.trim() === "" ? "" : parseInt(newMaxValue.trim().replace(/,/g, ""), 10);
        //         minValue = parseInt(minValue, 10);
        
        //         // Update the max of the current row
        //         updatedData[rowIndex].Range = `${minValue} - ${newMax}`;
        
        //         // Automatically update min of the next rows
        //         for (let i = rowIndex + 1; i < updatedData.length; i++) {
        //             let [nextMin, nextMax] = updatedData[i].Range.split("-").map(val => val.trim());
        //             let newMin = newMax + 1;
        
        //             // If it's the last row, only update the min value (no max)
        //             if (i === updatedData.length - 1) {
        //                 updatedData[i].Range = `${newMin}`;
        //             } else if (!isNaN(newMin)) {
        //                 updatedData[i].Range = `${newMin} - ${nextMax}`;
        //             }
        
        //             newMax = parseInt(nextMax); // Move max forward for further rows
        //         }
        
        //         return updatedData;
        //     });
        // };

        const handleRangeInputChange = (rowIndex, newMaxValue) => {
            setTableData((prevData) => {
                let updatedData = [...prevData];
        
                let [minValue] = updatedData[rowIndex].Range.split("-").map(val => val.trim());
                let newMax = newMaxValue.trim() === "" ? "" : parseInt(newMaxValue.trim().replace(/,/g, ""), 10);
                minValue = parseInt(minValue, 10);
        
                // Update max of the current row
                updatedData[rowIndex].Range = `${minValue} - ${newMax}`;
        
                // Ensure last row updates immediately
                for (let i = rowIndex + 1; i < updatedData.length; i++) {
                    let [nextMin, nextMax] = updatedData[i].Range.split("-").map(val => val.trim());
                    let newMin = newMax + 1;
        
                    if (i === updatedData.length - 1) {
                        //  Force update last row immediately
                        updatedData[i].Range = `${newMin}`;
                    } else {
                        updatedData[i].Range = `${newMin} - ${nextMax}`;
                    }
        
                    newMax = parseInt(nextMax); // Move max forward for further rows
                }
        
                return updatedData;
            });
        };
        
        
        
        
        


        // const handleMinUpdate = (rowIndex, newMinValue) => {
        //     setTableData((prevData) => {
        //         let updatedData = [...prevData];
        //         let [_, max] = updatedData[rowIndex].Range.split("-").map(val => val.trim());

        //         // Ensure last row min value is updated correctly
        //         updatedData[rowIndex].Range = `${newMinValue} - ${max}`;

        //         return updatedData;
        //     });
        // };







        const handleInputChange = (rowIndex, pipeline, index, value) => {
            let numericValue = value.replace("%", "").trim();
            const regex = /^\d*\.?\d{0,2}$/;

        if (!regex.test(numericValue)) {
            return;
        }

            numericValue = numericValue === "" ? "" : parseFloat(numericValue);
            if (isNaN(numericValue)) return;
            if (numericValue < 0) numericValue = 0;
            if (numericValue > 100) numericValue = 100;

            setTableData((prevData) => {
                const updatedData = [...prevData];
                const existingValues = updatedData[rowIndex][pipeline].split(" - ");
                existingValues[index] = numericValue;
                updatedData[rowIndex][pipeline] = `${existingValues[0]} - ${existingValues[1]}`;
               
                const [min, max] = existingValues.map(Number);
        const cellKey = `${pipeline}-${rowIndex}`;

        setInvalidRanges((prev) => {
            const isInvalid = min > max;
            const alreadyInvalid = prev.includes(cellKey);
            if (isInvalid && !alreadyInvalid) {
                return [...prev, cellKey];
            } else if (!isInvalid && alreadyInvalid) {
                return prev.filter((key) => key !== cellKey);
            }
            return prev;
        });
                return updatedData;
            });
        };

        // Create dynamic MRT columns
        const columns = [
            {
                accessorKey: "Range",
                header: "Dry Load Range",
                // Prevents full-cell editing
                Cell: ({ cell }) => {
                    //  const rowIndex = cell.row.index;
                    const rangeValue = cell.getValue();
                    let min = "", max = "";
                    const totalRows = tableData.length;
                    let isLastRow = cell.row.index === totalRows - 1; // Check if it's the last row

                    if (rangeValue.includes("-")) {
                        [min, max] = rangeValue.split("-").map(val => val.trim());
                    }else {
                        min = rangeValue.split("+")[0].trim();
                    }
                    if (isLastRow && cell.row.index > 0) {
                        const prevRowMax = tableData[cell.row.index - 1]?.Range.split("+")[1]?.trim();
                        if (prevRowMax) {
                            min = (parseInt(prevRowMax.replace(/,/g, ""), 10) + 1).toString();
                        }
                    }
                    return (
                        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                            <TextField
                                size="small"
                                value={min} // Non-editable min value
                                style={{ width: "115px" }}
                                InputProps={{ readOnly: true }}

                            />

                            {isLastRow ? (
                                <span style={{ fontSize: "20px", fontWeight: "bold" }}>+</span>
                            ) : (
                                <>
                                    -
                                    <TextField
                                        size="small"
                                        type="number"
                                        value={isLastRow ? `${max}+` : `${max}`}
                                        onChange={(e) => !isLastRow && handleRangeInputChange(cell.row.index, e.target.value)}
                                        style={{ width: "115px" }}
                                        InputProps={isLastRow ? { readOnly: true } : {}}
                                    />
                                </>
                            )}
                        </div>
                    );
                },
            },

            ...Array.from(uniquePipelines).map((pipeline) => ({
                accessorKey: pipeline,
                header: `${pipeline}`,
                Cell: ({ cell }) => {
                    // console.log("@@@@@@@@@@@@@@@@@@@@@@",cell);
                    const [Min, Max] = cell.getValue().split(" - ");
                    // let abc =(`${pipeline}-${cell.row.original.Range}`).toString();
                    // console.log("sadsadsad",abc)
                    // const isInvalid = highlightIndices.includes(`'${pipeline}-${cell.row.original.Range}'`);
                    const cellIdentifier = `${pipeline}-${cell.row.original.Range}`;
                    const isInvalid = highlightIndices.includes(cellIdentifier);
                    // console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@",`'${pipeline}-${cell.row.original.Range}'`);
                    // console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%",isInvalid);
                    const cellClass = isInvalid ? 'invalid-cell' : 'valid-cell';
                    // const cellClass = isInvalid ? 'invalid-cell' : 'valid-cell'; // Determine
                    return (
                        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                            <TextField
                                size="small"
                                type='number'
                                value={Min}
                                className={cellClass}
                                inputProps={{ Min: 0, Max: 100 }}
                                InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                                onChange={(e) => handleInputChange(cell.row.index, pipeline, 0, e.target.value)}
                                style={{
                                    width: "100px"
                                }}
                            />
                            -
                            <TextField
                                size="small"
                                type='number'
                                value={Max}
                                className={cellClass}
                                inputProps={{ Min: 0, Max: 100 }}
                                InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                                onChange={(e) => handleInputChange(cell.row.index, pipeline, 1, e.target.value)}
                                style={{
                                    width: "100px"
                                }}
                            />
                        </div>
                    );
                },
            })),
        ];

        return { transformedRows, columns};
    };

    const id = open ? "simple-popper" : undefined;
    const datalist = [
        {
            title: "GAS FLOW LIMIT ",
            description: "Total gas of 1000 DTHs or less can flow up to 100% on any pipe. (Excludes storage injection gas)"
        },
        {
            title: "VOLUME PRE-APPROVAL",
            description: "Volumes exceeding posted % for Day Ahead require pre-approval before 8:45 AM EST."
        },
        {
            title: "MONTHLY PRE-APPROVAL",
            description: "Volumes exceeding posted % for the next month require pre-approval before the first day of bid week."
        }
    ];
    return (
        <>
            <Button className="Filter EditPipeLineMatrix" variant="contained" color="primary" aria-describedby={id} onClick={handleClick}>
                Edit Matrix
            </Button>
            <Box className="container">
                <Popper id={id} open={open} anchorEl={anchorEl} className="marketrtableContainer EditPipeLineMatrixcontainer">
                    <Box sx={{ border: 1, p: 1, bgcolor: "background.paper" }} className="marketrtableContainertable">
                        <Typography component="div" className="marketrtableContainertableinner">
                            <Typography component="div" className="userprofilelist">
                            <Grid container direction="row" spacing={{ xs: 2, md: 3 }}>
                                <Grid item xs={12} sm={6} md={6}>
                                    <Grid container direction="row" spacing={{ xs: 2, md: 3 }}>
                                        <Grid item xs={12} sm={12} md={8}>
                                            <CommonSelect value={matrixTypeName} onChange={(value) => setMatrixTypeName(value)} options={PipelineStatus} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} >
                                    <Grid container direction="row" spacing={{ xs: 2, md: 3 }} justifyContent="flex-end">
                                        <Grid item xs={12} sm={12} md={4} className='Deactivate'>

                                            <Button className='Filter' type="button" variant="contained" color="primary" onClick={handleSubmit}>
                                                <img src={codiconsave} alt='codiconsave'></img>
                                            </Button>
                                            <Button className='materialsymbolsclose' type="button" variant="contained" color="primary" onClick={handleCancelClick}>

                                                <img src={materialsymbolsclose} alt='materialsymbolsclose'></img>

                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                {/* <Grid item xs={5}>
                                        <Grid container justifyContent="flex-end">
                                            <Button className="Filter" onClick={handleSubmit} variant="contained" color="primary">
                                                <img src={codiconsave} alt="Save" />
                                            </Button>
                                            <Button className="materialsymbolsclose" variant="contained" color="primary" onClick={handleClick}>
                                                <img src={materialsymbolsclose} alt="Close" />
                                            </Button>
                                        </Grid>
                                    </Grid> */}
                            </Grid>
                        </Typography>
                        <MaterialReactTable columns={columns} data={tableData} enableSorting={false} enableEditing={false} enablePagination={false} />
                        <Box className="gasflowpadding">
                            <Grid container spacing={2} className='gasflowcontainer '>
                                {volumeLimit?.map((item, index) => (
                                    <Grid item xs={12} md={4} key={index}>
                                        <Typography className='subtitle' variant="subtitle1" fontWeight="bold" sx={{ display: "flex", alignItems: "center" }}>
                                            {item.KeyName}

                                            {!editingIndexes[index] ? (<EditIcon fontSize="small" onClick={() => handleVolumeEdit(index, item.KeyName, item.Message)}/> )
                                            : (
                                                <Box sx={{ display: "flex", gap: 1 }}  className='Deactivate'>
                                                  <Button className='materialsymbolsclose' type="button" variant="contained" color="primary" onClick={()=>handleVolumeCancel(index)}>
                                    <img src={materialsymbolsclose} alt='materialsymbolsclose'></img>
                                </Button>
                                <Button className='Filter' type="button" variant="contained" color="primary" onClick={()=> handleVolumeSubmit(index, item.KeyName)}>
                                    <img src={codiconsave} alt='codiconsave'></img>
                                </Button>
                                                </Box>
                                              )}

                                        </Typography>
                                        {editingIndexes[index] ? (
                                            <>
                                            <Box className="PipeLinettext">
                                            <TextField
                                            className="margin-20"
                                            variant="outlined"
                                            size="small"
                                            autoFocus
                                                fullWidth
                                                multiline
                                                minRows={3}
                                                value={editedMessages[item.KeyName] || ''}
                                                onChange={(e) => handleVolumeChange(item.KeyName, e.target.value)}
                                                // onBlur={() => handleBlur(index)}
                                            />
                                            </Box>
                                            </>
                                        ) : (
                                            <Typography className="gasflowdescription" variant="body2">
                                                {item.Message}
                                            </Typography>
                                        )}
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </Typography>
            </Box>
        </Popper >
            </Box >
        </>
    );
};

export default EditPipeLineMatrix;
