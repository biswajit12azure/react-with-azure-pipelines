import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { AutocompleteInput, CustomDatePicker } from "_components";
import { alertActions } from "_store";
import { Typography, Button, Box } from "@mui/material";
import Popper from "@mui/material/Popper";
import Grid from "@material-ui/core/Grid";
import dayjs from "dayjs";
import FilterListIcon from "@mui/icons-material/FilterList";
import { pipelineConfirmationAction } from "_store/pipelineConfirmation.slice";

const PipelineConfirmationFilter = ({
  handleFilterSubmit,
  isOpen,
  onClose,
  onOpen,
  PipelineConfirmationData,
}) => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);

  const marketerList =
  PipelineConfirmationData?.piplelineNominationDtos?.map((x) => ({
      label: x.Name,
      value: x.PipelineID,
    })) || [];
  const {
    handleSubmit,
    control,
    watch,
    trigger,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      MarketerName: "",
      SelectedDate: dayjs(),
    },
  });

  const watchedValues = watch();

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
    try {
      data = {
        PipelineID: data.MarketerName || 0,
        NominationDate: dayjs(data.SelectedDate).format("YYYY-MM-DDTHH:mm:ss"),
      };
      const result = await dispatch(
        pipelineConfirmationAction.get(data)
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
    
      handleFilterSubmit(result?.Data);
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
      SelectedDate: dayjs(),
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
            <CustomDatePicker
              control={control}
              trigger={trigger}
              name="SelectedDate"
              label="Select Date"
              minDate={dayjs().subtract(12, "month")}
              maxDate={dayjs().add(1, "month")}
              error={errors.SelectedDate}
              helperText={errors.SelectedDate ? "Please select a date" : ""}
            />

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

export default PipelineConfirmationFilter;
