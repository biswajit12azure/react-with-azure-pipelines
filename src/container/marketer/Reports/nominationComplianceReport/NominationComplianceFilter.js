import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import {
  AutocompleteInput,
  CustomDatePicker,
  CustomStaticDateRangePicker1,
} from "_components";
import { alertActions, nominationComplianceAction } from "_store";
import { Typography, Button, Box } from "@mui/material";
import Popper from "@mui/material/Popper";
import Grid from "@material-ui/core/Grid";
import dayjs from "dayjs";
import FilterListIcon from "@mui/icons-material/FilterList";

const NominationComplianceFilter = ({
  handleFilterSubmit,
  isAdmin,
  userdetails,
  data,
  fromDate,
  toDate,
  isOpen,
  onClose,
  onOpen,
  setFromDate,
  setToDate,
}) => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [marketerList,setMarketerList] =useState([])
  const [marketer,setMarketer] = useState('')

  useEffect(()=>{
    const marketers = data?.MarketerList?.map((x) => ({
      label: x.Description,
      value: x.CompanyID,
    }));
    setMarketerList(marketers)
  },[data])
  const {
    handleSubmit,
    control,
    watch,
    trigger,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      MarketerName: marketer,
      StartDate: null,
      
    },
  });

  const watchedValues = watch();
  useEffect(() => {
    if (fromDate & toDate) {
      setValue("SelectedDate", [dayjs(fromDate), dayjs(toDate)]);
    }
  }, [fromDate, toDate, setValue]);
  useEffect(() => {
    const hasValue = Object.values(watchedValues).some(
      (value) => value !== "" && value !== null
    );
    setIsFormValid(hasValue);
  }, [watchedValues]);

  const canBeOpen = isOpen && Boolean(anchorEl);
  const id = canBeOpen ? "simple-popper" : undefined;

  const onSubmit = async (data) => {
    dispatch(alertActions.clear());
    setMarketer(data?.MarketerName)
    try {
      const formattedStartDate = dayjs(data.SelectedDate[0]).format(
        "YYYY-MM-DDTHH:mm:ss"
      );
      const formattedEndDate = dayjs(data.SelectedDate[1]).format(
        "YYYY-MM-DDTHH:mm:ss"
      );
      const transformed = {
        CompanyID: data?.MarketerName.toString(),
        StartDate: formattedStartDate,
        EndDate: formattedEndDate,
      };

      setFromDate(transformed?.StartDate);
      setToDate(transformed.EndDate);
      // handleFilterSubmit({});
      const result = await dispatch(
        nominationComplianceAction.get(transformed)
      ).unwrap();
      const reportData = result?.Data;
      await handleFilterSubmit(reportData);

      if (result?.error) {
        dispatch(
          alertActions.error({
            message: result?.payload || result?.error.message,
            header: "Fetch Failed",
          })
        );
        
      }

      // resetValues();
      onClose();
    } catch (error) {
      
      dispatch(
        alertActions.error({
          message: error?.message || error,
          header: "Fetch Failed",
        })
      );
    }
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    if (isOpen) {
      onClose();
    } else {
      onOpen();
    }
  };

  const handleCancelClick = () => {
    resetValues();
    onClose();
  };

  const resetValues = () => {
    reset({
      MarketerName: "",
      ServiceProvider: "",
      StartDate: null,
      IsActive: null,
    });
  };

  const handleClickAway = () => {
    resetValues();
    onClose();
  };

  return (
    <>
      <Button
        className="Filter"
        type="button"
        variant="contained"
        color="primary"
        aria-describedby={id}
        onClick={handleClick}
      >
        <FilterListIcon />
        Filter
      </Button>
      <Popper
        id={id}
        open={canBeOpen}
        anchorEl={anchorEl}
        className="Filtercontainer"
      >
        <Box
          sx={{ border: 1, p: 1, bgcolor: "background.paper" }}
          className="Filtercontainerinner Border"
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="Registrationcontainer marketerFiltercontainer"
          >
            <Typography component="div" className="userprofilelist">
              <Grid container direction="row" spacing={{ xs: 2, md: 3 }}>
                <Grid item xs={12} sm={6} md={6}>
                  <Typography variant="h2" className="userprofilelistcontent">
                    Reports
                  </Typography>
                </Grid>
              </Grid>
            </Typography>
            <AutocompleteInput
              control={control}
              name="MarketerName"
              label="Marketer Name"
              options={marketerList}
            />

            <Typography className="marbottom0 selecticon">
              <CustomStaticDateRangePicker1
                id="SelectedDate"
                control={control}
                trigger={trigger}
                name="SelectedDate"
                label="From - To"
                // handleBlur={handleBlur}
                minDate={dayjs().subtract(12, "month")}
                maxDate={dayjs().add(12, "month")}
                maxDays={31}
              />
            </Typography>

            <Typography component="div" className="CreateMarketerbutton">
              <Button
                type="submit"
                variant="contained"
                className="submitbutton"
                color="primary"
                disabled={!isFormValid}
              >
                Search
              </Button>
              <Button
                variant="contained"
                color="red"
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
};

export default NominationComplianceFilter;
