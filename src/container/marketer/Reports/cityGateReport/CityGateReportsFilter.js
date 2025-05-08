import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import {
  CustomTextFieldInput,
  AutocompleteInput,
  CustomDatePicker,
} from "_components";
import { alertActions } from "_store";
import {
  Typography,
  Button,
  Box,
  ClickAwayListener,
  TextField,
} from "@mui/material";
import { cityGateAction } from "_store/cityGate.slice";
import Popper from "@mui/material/Popper";
import Grid from "@material-ui/core/Grid";
import dayjs from "dayjs";
import FilterListIcon from "@mui/icons-material/FilterList";
import { marketerAction } from "_store/marketer.slice";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
const CityGateReportsFilter = ({
  handleFilterSubmit,
  isOpen,
  onClose,
  onOpen,
  marketers,
}) => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);

  const statusData = [
    { value: 1, label: "Active" },
    { value: 0, label: "Inactive" },
  ];
  const marketerList =
    marketers?.map((x) => ({
      label: x.ShortName,
      value: x.MarketerID,
    })) || [];
  const {
    handleSubmit,
    control,
    watch,
    reset,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: {
      SelectedDate: dayjs(),
    },
  });

  const watchedValues = watch();

  useEffect(() => {
    const { SelectedDate } = watchedValues;

    // const hasValue = Object.values(watchedValues).some(
    //   (value) => value !== "" && value !== null
    // );
    setIsFormValid(SelectedDate);
  }, [watchedValues]);

  const canBeOpen = isOpen && Boolean(anchorEl);
  const id = canBeOpen ? "simple-popper" : undefined;

  const onSubmit = async (data) => {
    dispatch(alertActions.clear());
    try {
      let Data = {
        StartDate: dayjs(data.SelectedDate).startOf("day").toISOString(),
      };
      const result = await dispatch(cityGateAction.get(Data)).unwrap();
      if (result?.error) {
        dispatch(
          alertActions.error({
            message: result?.payload || result?.error.message,
            header: "Fetch Failed",
          })
        );
        return;
      }
      handleFilterSubmit(result?.Data, data.SelectedDate);
      resetValues();
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
            {/* <AutocompleteInput
              control={control}
              name="MarketerName"
              label="Marketer Name"
              options={marketerList}
            /> */}
            <CustomDatePicker
              control={control}
              trigger={trigger}
              name="SelectedDate"
              label="Select Date"
              minDate={dayjs().subtract(16, "month")}
              maxDate={dayjs().add(1, "month")}
              error={errors.SelectedDate}
              helperText={errors.SelectedDate ? "Please select a date" : ""}
            />
            {/* <Typography component="div" className="marbottom0 selecticon">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                  name="StartMonth"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      className="SelectedDate "
                      {...field}
                      label="Select Month"
                      views={["year", "month"]}
                      maxDate={dayjs()} // Current date
                      minDate={null} // Allows any past date
                      slotProps={{
                        textField: (params) => <TextField {...params} />,
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Typography> */}
            {/* <Typography className='marbottom0 selecticon'>
                        <AutocompleteInput
                            control={control}
                            name="IsActive"
                            label="Status"
                            options={statusData}
                        />
                        </Typography> */}

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

export default CityGateReportsFilter;
