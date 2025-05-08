import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { alertActions, nominationsAction } from '_store';
import { Typography, Button, Box, TextField, InputAdornment } from '@mui/material';
import Popper from '@mui/material/Popper';
import Grid from "@material-ui/core/Grid";
import { MaterialReactTable } from 'material-react-table';
import { codiconsave, materialsymbolsclose } from "../../../images";
import {CommonSelect} from '_components';
import { pipelineMatrixData } from '../../../_utils/constant';



  // useEffect(() => {
  //   const fetchData = async () => {
  //     dispatch(alertActions.clear());
  //     try {
  //       const result = await dispatch(nominationsAction.getDeliveryMatrix()).unwrap();
  //       const deliveryMatrix = result?.Data;
  //       setData1(deliveryMatrix);
  //     } catch (error) {
  //       dispatch(alertActions.error({
  //         message: error?.message || error,
  //         header: `${header} Failed`
  //       }));
  //     }
  //   };
  //   fetchData();
  // }, [dispatch]);
  const EditPipeLineMatrix = () => {
    const dispatch = useDispatch();
    const nominations = useSelector(x => x.delivery?.deliveryMatrix);
    const [open, setOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [matrixTypeName, setMatrixTypeName] = useState('Actual DRV Consumption');
    const [tableData, setTableData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [originalData, setOriginalData] = useState([]);
  const PipelineStatus =[
    { value: "Actual DRV Consumption", label: "Actual DRV Consumption" },
    { value: "Storage&Payback", label: "Storage & Payback" }
]; 
    useEffect(() => {
        const { transformedRows, columns } = transformDataForMRT(pipelineMatrixData, matrixTypeName);
        setTableData(transformedRows);
        setOriginalData(transformedRows);
        setColumns(columns);
    }, [matrixTypeName]);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
      setOpen((previousOpen) => !previousOpen);
    };
    const handleSubmit = () =>{
      console.log("updated data",tableData);
    }
    const transformDataForMRT = (apiData, matrixTypeName) => {
      const transformedRows = [];
      const uniquePipelines = new Set();
  
      const filteredData = apiData.Data.filter(entry =>
          entry.Matrix.some(matrix => matrix.MatrixTypeName === matrixTypeName)
      );
  
      filteredData.forEach((entry) => {
          const row = { Range: entry.Range };
  
          entry.Matrix.forEach((matrix) => {
              if (matrix.MatrixTypeName === matrixTypeName) {
                  const pipelineName = matrix.PipelineName;
                  uniquePipelines.add(pipelineName);
                  row[pipelineName] = `${matrix.Min} - ${matrix.Max}`;
              }
          });
  
          transformedRows.push(row);
      });
      const handleRangeInputChange = (rowIndex, value) => {
        setTableData((prevData) => {
          const updatedData = [...prevData];
          updatedData[rowIndex].Range = value;
    
          const rangeParts = value.split("-");
          if (rangeParts.length === 2) {
            const startValue = parseInt(rangeParts[0].trim().replace(/,/g, ""), 10);
            const endValue = parseInt(rangeParts[1].trim().replace(/,/g, ""), 10);
    
            if (!isNaN(startValue) && !isNaN(endValue) && rowIndex + 1 < updatedData.length) {
              updatedData[rowIndex + 1].Range = `${endValue + 1} - ${parseInt(endValue) + 100000}`;
            }
          }
          return updatedData;
        });
      };

      const handleInputChange = (rowIndex, pipeline, index, value) => {
        let numericValue = value.replace("%", "").trim();
    
        // Convert to number and validate range
        numericValue = numericValue === "" ? "" : parseFloat(numericValue);
        if (isNaN(numericValue)) return; // Block non-numeric input
        if (numericValue < 0) numericValue = 0;
        if (numericValue > 100) numericValue = 100;
    
        setTableData((prevData) => {
          const updatedData = [...prevData];
          const existingValues = updatedData[rowIndex][pipeline].split(" - ");
          existingValues[index] = numericValue; 
          updatedData[rowIndex][pipeline] = `${existingValues[0]} - ${existingValues[1]}`;
          return updatedData;
        });
      };


      // Create dynamic MRT columns
      const columns = [
        {
          accessorKey: "Range",
          header: "Dry Load Range",
          enableEditing: true,
          Cell: ({ cell }) => (
              <TextField
                  size="small"
                  value={cell.getValue()}
                  onChange={(e) => handleRangeInputChange(cell.row.index, e.target.value)}
                  style={{ width: "220px" }}
              />
          ),
      },
          ...Array.from(uniquePipelines).map((pipeline) => ({
              accessorKey: pipeline,
              header: `${pipeline}`,
              Cell: ({ cell }) => {
                  const [min, max] = cell.getValue().split(" - ");
                  return (
                      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                          <TextField
                              size="small"
                              type='number'
                              value={min}
                              inputProps={{ min: 0, max: 100 }}
                              InputProps={{
                                endAdornment: <InputAdornment position="end">%</InputAdornment>
                            }}
                            onChange={(e) => handleInputChange(cell.row.index, pipeline, 0, e.target.value)}
                              style={{ width: "70px" }}
                          />
                          -
                          <TextField
                              size="small"
                              type='number'
                              value={max}
                              inputProps={{ min: 0, max: 100 }}
                              InputProps={{
                                endAdornment: <InputAdornment position="end">%</InputAdornment>
                            }}
                            onChange={(e) => handleInputChange(cell.row.index, pipeline, 1, e.target.value)}
                              style={{ width: "70px" }}
                          />
                          
                      </div>
                  );
              },
          })),
      ];
  
      return { transformedRows, columns };
  };
  
    // const handleInputChange = (rowIndex, key, index, value) => {
    //     const updatedData = [...tableData];
    //     let minMax = updatedData[rowIndex][key].split(" - ");
    //     minMax[index] = value;
    //     updatedData[rowIndex][key] = `${minMax[0]} - ${minMax[1]}`;
    //     setTableData(updatedData);
    // };

    const id = open ? "simple-popper" : undefined;

    return (
        <>
            <Button
                className="Filter EditPipeLineMatrix"
                type="button"
                variant="contained"
                color="primary"
                aria-describedby={id}
                onClick={handleClick}
            >
                Edit Matrix
            </Button>
            <Box className="container">
                <Popper id={id} open={open} anchorEl={anchorEl} className="marketrtableContainer EditPipeLineMatrixcontainer">
                    <Box sx={{ border: 1, p: 1, bgcolor: "background.paper" }} className="marketrtableContainertable">
                        <Typography component="div" className="marketrtableContainertableinner">
                            <Typography component="div" className="userprofilelist">
                                <Grid container direction="row" spacing={{ xs: 2, md: 3 }}>
                                    <Grid item xs={7} sm={6} md={6}>
                                        <CommonSelect
                                            value={matrixTypeName}
                                            onChange={(value) => setMatrixTypeName(value)}
                                            options={PipelineStatus}
                                        />
                                    </Grid>
                                    <Grid item xs={5} sm={6} md={6}>
                                        <Grid container direction="row" spacing={{ xs: 2, md: 3 }} justifyContent="flex-end">
                                            <Grid item xs={12} sm={12} md={4} className="Deactivate">
                                                <Button className="Filter" onClick={()=>handleSubmit()} type="button" variant="contained" color="primary">
                                                    <img src={codiconsave} alt="Save" />
                                                </Button>
                                                <Button
                                                    className="materialsymbolsclose"
                                                    type="button"
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={handleClick}
                                                >
                                                    <img src={materialsymbolsclose} alt="Close" />
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Typography>

                            <MaterialReactTable
                                className="EditPipeLineMatrixMaterialReactTable"
                                columns={columns}
                                data={tableData}
                                enableSorting={false}
                                enableEditing={false}
                                editingMode="cell"
                                enableGlobalFilter={false}
                                enableColumnFilters={false}
                                enableColumnVisibilityToggle={false}
                                enableDensityToggle={false}
                               
                                enableFullScreenToggle={false}
                                enableColumnActions={false}
                                enableToolbarInternalActions={false}
                                enablePagination={false}
                            />
                        </Typography>
                    </Box>
                </Popper>
            </Box>
        </>
    );
};

export default EditPipeLineMatrix;
