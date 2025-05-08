import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { FormControl, TextField, InputAdornment, IconButton, Box } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

export default function CustomStaticDateRangePicker2({ startDate: initialStartDate, endDate: initialEndDate, onDateRangeChange }) {
  const [startDate, setStartDate] = useState(initialStartDate); 
  const [endDate, setEndDate] = useState(initialEndDate); 
  const [minDateselected, setMinDateselected] = useState(null);
  const [maxDateselected, setMaxDateselected] = useState(null);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState(false);

  // Update state when props change
  useEffect(() => {
    setStartDate(initialStartDate);
    setEndDate(initialEndDate);
  }, [initialStartDate, initialEndDate]);

  // Initialize min and max date on initial load
  useEffect(() => {
    const today = dayjs(); 
    const maxEndDate = today.add(6, 'month'); 
    setMinDateselected(today.toDate());
    setMaxDateselected(maxEndDate.toDate());
  }, []);

  useEffect(() => {
    if (startDate) {
      const maxDateselectedStarDate = dayjs(startDate).add(6, 'month');
      setMaxDateselected(maxDateselectedStarDate.toDate());
    }
  }, [startDate]);

  const formattedDateRange = startDate && endDate
    ? `${dayjs(startDate).format('MM/DD/YYYY')}-${dayjs(endDate).format('MM/DD/YYYY')}`
    : '';

  // Handle date range change from calendar
  const handleOnChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    if (end) {
      setCalendarVisible(false);
    } else {
      setError(false);
    }
    onDateRangeChange({ startDate: start, endDate: end });
  };

  const toggleCalendarVisibility = (e) => {
    e.stopPropagation();
    setCalendarVisible(prevState => !prevState);
  };

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = () => {
    setFocused(false);
    if (!startDate || !endDate) {
      setError(true); 
    }
  };

  return (
    <FormControl fullWidth margin="normal" style={{ position: 'relative' }}>
      <TextField
        value={formattedDateRange} 
        onClick={toggleCalendarVisibility} 
        onFocus={handleFocus} 
        onBlur={handleBlur}
        error={error} 
        helperText={error ? 'Please select a date range' : ''} 
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={toggleCalendarVisibility}>
                <CalendarTodayIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        placeholder="Select a date range"
        variant="outlined"
        label={!startDate && !endDate ? 'Select Date Range' : ''} // Conditionally remove label if no date is selected
      />

      {/* Date Range Picker - only visible when `calendarVisible` is true */}
      {calendarVisible && (
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
          <DatePicker
            selected={startDate}
            onChange={handleOnChange}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            inline
            minDate={minDateselected}
            maxDate={maxDateselected}
          />
        </Box>
      )}
    </FormControl>
  );
}
