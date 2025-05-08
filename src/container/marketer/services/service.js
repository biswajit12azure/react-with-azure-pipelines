import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import ServiceCardComponent from './FuelWithDrawCardComponent';
import { runningIcon, errorIcon,reset } from 'images';
import ServiceCardDetail from './ServiceCardDetail';
import { manageServiceActions, fuelChargeActions, alertActions } from '_store';

const Service = () => {
  const header = "Manage Service";
  const dispatch = useDispatch();

  const [serviceData, setServiceData] = useState(null);
  const [injectionCharge, setInjectionCharge] = useState(null);
  const [withDrawCharge, setwithDrawCharge] = useState(null);
  const [fuelChargeEffectiveDate, setFuelChargeEffectiveDate] = useState(null);
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);
  const { data, loading, error } = useSelector((state) => state.manageService || {});
  

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const res = await dispatch(manageServiceActions.getManagerServiceDetails()).unwrap();
        setServiceData(res);
        setwithDrawCharge(res.Data.Withdraw);
        setInjectionCharge(res.Data.Injection);
        setFuelChargeEffectiveDate(res.Data.FuelChargeEffectiveDate);
        setIsSaveEnabled(false);
      } catch (err) {
        console.error("Error fetching service data:", err);
      }
    };

    fetchServiceData();
  }, [dispatch]);

  const handleCancelClick = async () => { };

  const handleRefresh = async () =>{
    dispatch(alertActions.clear());
   const res= await dispatch(manageServiceActions.getManagerServiceDetails()).unwrap();
   setServiceData(res);
   setIsSaveEnabled(false);
  }

  const handleSubmit = async () => {
    try {
      // Validate charges
      if ((0.0001 <= withDrawCharge && withDrawCharge <= 100) && (0.0001 <= injectionCharge && injectionCharge <= 100)) {
        // If validation passes, prepare the data for update
        const fuelChargeData = {
          WithdrawalValue: withDrawCharge,
          InjectionValue: injectionCharge,
          EffectiveDate: fuelChargeEffectiveDate ? new Date(fuelChargeEffectiveDate).toISOString() : null
        };
  
        // Dispatch the updateFuelCharge action with the prepared data
        const res = await dispatch(fuelChargeActions.updateFuelCharge(fuelChargeData)).unwrap();
        
        // Handle the response as needed
        if (res && res.Succeeded ) {
          handleRefresh();
         dispatch(alertActions.success({ message: "Fuel charge updated successfully!", header: "Add Fuel Charges"}));
        } else {
          //alert('Failed to update fuel charge');
          dispatch(alertActions.error({
            message: `Failed to update fuel charge`,
            header: "Add Fuel Charges"
          }));
        }
      } else {
        dispatch(alertActions.error({
          message: `Only numeric values and single decimal point allowed. Value must be between 0.0001% and 100%.`,
          header: "Validation Error"
        }));
        return;
      }
    } catch (error) {
      dispatch(alertActions.error({ message: error?.message || error, header: header }));
    }
  };
  

  const handleChargeChange = (chargeType, newCharge) => {
    if(newCharge){
      setIsSaveEnabled(true);
    }
    
    switch (chargeType) {
      case "FUEL CHARGE EFFECTIVE DATE":
        setFuelChargeEffectiveDate(newCharge);
        break;

      case "CHARGES FOR WITHDRAW":
        setwithDrawCharge(newCharge)
        break;

      case "CHARGE FOR INJECTION":
        setInjectionCharge(newCharge);
        break;

      default:
        break;
    }
  };


  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography>Error: {error.message}</Typography>;
  }

  if (!serviceData) {
    return <Typography>No service data available</Typography>;
  }

  // Reorder the services array to the desired sequence (Alpha -> Beta -> End of Month)
  const reorderServices = (services) => {
    const serviceOrder = ["Alpha Service", "Beta Service", "End Of Month"];

    // Create a copy of the array to avoid mutation of the original
    const servicesCopy = [...services];

    // Reorder based on the defined order
    return servicesCopy.sort((a, b) => {
      return serviceOrder.indexOf(a.ServiceName) - serviceOrder.indexOf(b.ServiceName);
    });
  };

  // Reorder services
  const sortedServices = reorderServices(serviceData?.Data?.Service);

  return (
    <>
      <Typography component="div" className="userprofilelist">
        <Grid container direction="row" spacing={2}>
          <Grid size={{ xs: 12, sm: 12, md: 4 }}>
            <Typography variant="h2" className="userprofilelistcontent">SERVICES</Typography>
          </Grid>
        </Grid>
      </Typography>

      <Grid container spacing={2}>
        {/* Render the reordered services */}
        {sortedServices?.map((service) => (
          <ServiceCardDetail
            key={service.ServiceName}
            title={service.ServiceName}
            value={service.RunningTitle}
            icon={service.IsRunning ? runningIcon : errorIcon}
            resetIcon={reset}
            time={service.LastRun}
          />
        ))}

        <ServiceCardComponent
          label={serviceData?.Data?.InjectionChargeLable}
          charge={serviceData?.Data?.Injection}
          currentcharge={serviceData?.Data?.InjectionCurrentCharge}
          isChargeApplicable={true}
          onChargeChange={handleChargeChange}
          isFuleChargeDtDisplay={false}
        />
        <ServiceCardComponent
          label={serviceData?.Data?.WithdrawChargeLabel}
          charge={serviceData?.Data?.Withdraw}
          currentcharge={serviceData?.Data?.WithdrawCurrentCharge}
          isChargeApplicable={true}
          onChargeChange={handleChargeChange}
          isFuleChargeDtDisplay={false}
        />
        <ServiceCardComponent
          label={serviceData?.Data?.FuelChargeEffectiveLabel}
          fuelChargeEffectiveDate={serviceData?.Data?.FuelChargeEffectiveDate}
          isFuleChargeDtDisplay={true}
          onChargeChange={handleChargeChange}
        />
      </Grid>

      <Grid item xs={12} sm={12} md={12} className="Personal-Information">
        <Button variant="contained" color="red" className="cancelbutton" onClick={handleCancelClick}>
          Cancel
        </Button>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className="submitbutton"
          onClick={handleSubmit}
          disabled={!isSaveEnabled}
        >
          Save
        </Button>
      </Grid>
    </>
  );
};

export default Service;
