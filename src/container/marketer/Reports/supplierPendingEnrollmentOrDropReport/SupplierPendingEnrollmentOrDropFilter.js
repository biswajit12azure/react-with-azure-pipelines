import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import { alertActions, supplierPendingEnrollmentOrDropAction } from "_store";
import { Typography, Button, Box, TextField } from "@mui/material";
import Popper from "@mui/material/Popper";
import { Grid } from "@material-ui/core";
import FilterListIcon from "@mui/icons-material/FilterList";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { supplierPendingEnrollmentOrDropSchema } from "_utils/validationSchema";
import { AutocompleteInput } from "_components";

const SupplierPendingEnrollmentOrDropFilter = ({
  marketerData,
  handleFilterSubmit,
  marketerId,
  setMarketerId,
  date,
  setDate,
  isOpen,
  onClose,
  onOpen,
}) => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const maxDate = dayjs();
  const minDate = maxDate.subtract(12, "months");

  const marketerList =
    marketerData?.marketers?.map((x) => ({
      label: x.Description,
      value: x.CompanyID,
    })) || [];

  const {
    handleSubmit,
    control,
    watch,
    reset,
    trigger,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(supplierPendingEnrollmentOrDropSchema),
    defaultValues: {
      ReportDate: date,
      MarketerID: marketerId,
    },
  });

  const watchedValues = watch();

  useEffect(() => {
    const hasValue = Object.values(watchedValues).some(
      (value) => value !== "" && value !== null
    );
    setIsFormValid(hasValue);
  }, [watchedValues]);

  useEffect(() => {
    if (date) {
      setValue("ReportDate", date);
      trigger();
    }
  }, [date, setValue]);

  useEffect(() => {
    if (marketerId) {
      setValue("MarketerID", marketerId);
    }
  }, [marketerId, setValue]);

  const canBeOpen = isOpen && Boolean(anchorEl);
  const id = canBeOpen ? "simple-popper" : undefined;

  const onSubmit = async (data) => {
    dispatch(alertActions.clear());
    try {
      const reportDate = dayjs(data.ReportDate).isValid()
        ? dayjs(data.ReportDate)
        : null;
      const startDate = reportDate ? dayjs(reportDate.startOf("month")) : null;
      setDate(dayjs(startDate));
      setMarketerId(data?.MarketerID);
      const transformedData = {
        CompanyID: data?.MarketerID || null,
        ReportDate: dayjs(startDate).format("YYYY-MM-DDTHH:mm:ss"),
      };

      const result = await dispatch(
        supplierPendingEnrollmentOrDropAction.get(transformedData)
      ).unwrap();
      if (result?.error) {
        dispatch(
          alertActions.error({
            message: result?.payload || result?.error.message,
            header: "Fetch Failed",
          })
        );
        return;
      }
      // Then set to the actual value
      handleFilterSubmit(result?.Data);
      onClose();
    } catch (error) {
      onClose();
      console.log(error)
      dispatch(
        alertActions.error({
          message: error?.message || error,
          header: "Fetch Failed",
        })
      );
    }
  };

  const handleBlur = async (e) => {
    const fieldName = e.target.name;
    await trigger(fieldName);
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
      ReportDate: null,
    });
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
        className="Filtercontainer marketerGroup Border"
      >
        <Box
          sx={{ border: 1, p: 1, bgcolor: "background.paper" }}
          className="Filtercontainerinner"
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
            <Typography
              component="div"
              className="marbottom0 selecticon marginbottom16"
            >
              <AutocompleteInput
                control={control}
                name="MarketerID"
                label="Select Marketer"
                options={marketerList}
                error={!!errors.MarketerID}
                helperText={errors.MarketerID?.message}
                handleBlur={handleBlur}
                trigger={trigger}
              />
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Controller
                name="ReportDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    className="date "
                    {...field}
                    label="Select Month"
                    // views={["year", "month"]}
                    minDate={minDate}
                    maxDate={maxDate}
                    slotProps={{
                      textField: (params) => <TextField {...params} />,
                    }}
                  />
                )}
              />
            </LocalizationProvider>
            <Box className="CreateMarketerbutton" spacing={{ xs: 2, md: 3 }}>
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
                className="cancelbutton"
                color="primary"
                onClick={handleCancelClick}
              >
                Cancel
              </Button>
            </Box>
          </form>
        </Box>
      </Popper>
    </>
  );
};

export default SupplierPendingEnrollmentOrDropFilter;
