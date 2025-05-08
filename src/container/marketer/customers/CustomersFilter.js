import React from "react";
import { useForm } from "react-hook-form";
import { CustomTextFieldInput } from "_components";
import { Typography, Button, Box } from "@mui/material";
import Popper from "@mui/material/Popper";
import Grid from "@material-ui/core/Grid";
import FilterListIcon from "@mui/icons-material/FilterList";
import { marketerBillingHistoryAction, alertActions } from "_store";
import { useDispatch } from "react-redux";
import { AutocompleteInput } from "_components";

const CustomerFilter = ({
  isOpen,
  onClose,
  onOpen,
  handleFilterSubmit,
  marketerData,
}) => {
  // const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const dispatch = useDispatch();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    if (isOpen) {
      onClose();
    } else {
      onOpen();
    }
  };

  const canBeOpen = isOpen && Boolean(anchorEl);
  const id = canBeOpen ? "simple-popper" : undefined;
  const marketerList =
    marketerData?.map((x) => ({
      label: x.MarketerName,
      value: x.MarketerID,
    })) || [];
  const {
    register,
    handleSubmit,
    control,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: {
      AccountNumber: "",
      MarketerID: 0,
    },
  });

  const onSubmit = async (data) => {
    dispatch(alertActions.clear());
    try {
      const transformedData = {
        AccountNumber: data.AccountNumber,
        MARKETER_ID: data.MarketerID,
      };

      const result = await dispatch(
        marketerBillingHistoryAction.getMarketerBillingHistory(transformedData)
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
      console.log(error);
      dispatch(
        alertActions.error({
          message: error?.message || error,
          header: "Fetch Failed",
        })
      );
    }
  };

  const handleCancelClick = () => {
    onClose();
  };

  const handleBlur = async (e) => {
    const fieldName = e.target.name;
    await trigger(fieldName);
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
            className="Registrationcontainer"
          >
            <Typography component="div" className="userprofilelist">
              <Grid container direction="row" spacing={{ xs: 2, md: 3 }}>
                <Grid item xs={12} sm={6} md={6}>
                  <Typography variant="h2" className="userprofilelistcontent">
                    Search
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
            <CustomTextFieldInput
              control={control}
              name="AccountNumber"
              label="Account Number"
              register={register}
              errors={errors}
            />

            <Typography component="div" className="CreateMarketerbutton">
              <Button
                type="submit"
                variant="contained"
                className="submitbutton"
                color="primary"
              >
                Search
              </Button>
              <Button
                variant="contained"
                color="secondary"
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

export default CustomerFilter;
