import React from "react";
import { Controller } from 'react-hook-form';
import Calendar from "react-range-calendar";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { FormControl, TextField, InputAdornment, IconButton, Box } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ErrorIcon from '@mui/icons-material/Error';
import { makeStyles } from "@material-ui/core/styles";
import dayjs from 'dayjs';

const useStyles = makeStyles({
  disabledDate: {
    color: '#d3d3d3', // Grey color for disabled dates
    pointerEvents: 'none', // Disable click events
  },
});

const CustomStaticDateRangePicker1 = ({
  control,
  trigger,
  name,
  label,
  error,
  helperText,
  handleBlur,
  minDate,
  maxDate,
  maxDays,
  onDateChange, // Function to update parent state
}) => {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();

  const handleOpen = (event) => {
    event.stopPropagation(); // Prevent click propagation issues
    setOpen(prevOpen => !prevOpen);
  };
  const handleClose = () => setOpen(false);

  const parseDate = (date) => (date ? dayjs(date).startOf('day').toDate() : null);

  return (
    <FormControl fullWidth margin="normal" style={{ position: 'relative' }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <>
              <TextField
                label={label}
                onClick={handleOpen}
                variant="outlined"
                value={`${field.value ? parseDate(field.value[0])?.toLocaleDateString() : ''} - ${field.value ? parseDate(field.value[1])?.toLocaleDateString() : ''}`}
                onBlur={(e) => {
                  if (handleBlur) {
                    handleBlur(e);
                  }
                }}
                helperText={helperText}
                error={!!error}
                InputProps={{
                  endAdornment: (
                    <>
                      <InputAdornment position="end">
                        <IconButton onClick={handleOpen}>
                          <CalendarTodayIcon />
                        </IconButton>
                      </InputAdornment>
                      {error && (
                        <InputAdornment position="relative">
                          <ErrorIcon style={{ color: 'red' }} />
                        </InputAdornment>
                      )}
                    </>
                  ),
                }}
              />
              {open && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    zIndex: 1,
                    mt: 1,
                    boxShadow: 3,
                    borderRadius: 1,
                    backgroundColor: 'white',
                  }}
                >
                  <Calendar
                    visible={open}
                    dateRange={field.value ? [parseDate(field.value[0]), parseDate(field.value[1])] : [minDate, minDate]}
                    onDateClick={(minDateSelected, maxDateSelected) => {
                      if (
                        minDateSelected >= minDate && 
                        maxDateSelected <= maxDate &&
                        dayjs(maxDateSelected).diff(dayjs(minDateSelected), 'day') <= maxDays
                      ) {
                        field.onChange([minDateSelected, maxDateSelected]);
                        trigger(name);
                        onDateChange && onDateChange([minDateSelected, maxDateSelected]); // Update parent state
                        handleClose();
                      }
                    }}
                    type="free-range"
                    minDate={minDate || undefined} // Dynamic min date from parent
                    maxDate={maxDate || undefined} // Dynamic max date from parent
                    renderDay={(day, selectedDate, isInCurrentMonth, dayComponent) => {
                      const isDisabled = 
                        (minDate && day < parseDate(minDate)) || 
                        (maxDate && day > parseDate(maxDate));
                      return React.cloneElement(dayComponent, {
                        className: isDisabled ? classes.disabledDate : '',
                        onClick: isDisabled ? undefined : dayComponent.props.onClick,
                      });
                    }}
                  />
                </Box>
              )}
            </>
          )}
        />
      </LocalizationProvider>
    </FormControl>
  );
};

export default CustomStaticDateRangePicker1;