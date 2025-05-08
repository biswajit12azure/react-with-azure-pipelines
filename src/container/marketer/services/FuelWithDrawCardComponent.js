import React, { useState } from 'react';
import { Card, CardContent, Typography, IconButton, TextField } from '@mui/material';
import Grid from "@mui/material/Grid2";
import Paper from '@mui/material/Paper';
import { experimentalStyled as styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import { arrowDown } from 'images';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// Styling for each card
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

const FuelWithDrawCardComponent = ({
  label, charge, currentcharge, isChargeApplicable, fuelChargeEffectiveDate, isFuleChargeDtDisplay, onChargeChange
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editableCharge, setEditableCharge] = useState(charge);

  
  const [editableDate, setEditableDate] = useState(dayjs(fuelChargeEffectiveDate).isValid() ? dayjs(fuelChargeEffectiveDate) : dayjs());

 
  const today = dayjs();
  const minDate = today.subtract(12, 'month');  
  const maxDate = today.add(12, 'month'); 

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleChargeChange = (e) => {
    setEditableCharge(e.target.value);
  };

  const handleDatePickerClose = () => {
    setIsEditMode(false);
  };

  const handleDateChange = (newDate) => {
    setEditableDate(newDate);
    const dateObj = dayjs(newDate).local().startOf('day').add(1, 'day');
    const isoDateString = dateObj.toISOString();
    onChargeChange(label,isoDateString);
  };

  const handleBlur = () => {
    setIsEditMode(false);
    if (onChargeChange) {
      onChargeChange(label, editableCharge);
    }
  };

  return (
    <Grid size={{ xs: 12, sm: 12, md: 4 }} className="CardDetail card-layout">
      <Item>
        <Card sx={{ minWidth: 345 }}>
          <CardContent className='card-last-item'>
            <Typography gutterBottom variant="h5" component="div" className="cardcontent card-last-item-content">
              <div className="service-card-heading">
                {label}
                <img
                  src={arrowDown}
                  alt="arrow"
                  className="editicon"
                />
              </div>

              {(isEditMode && !isFuleChargeDtDisplay) ? (
                <TextField
                  value={editableCharge}
                  onChange={handleChargeChange}
                  onBlur={handleBlur}
                  variant="outlined"
                  size="small"
                  type="number"
                  autoFocus
                  fullWidth
                />
              ) : (
                <>
                  {isChargeApplicable && (
                    <div className="service-card-title">{editableCharge}%</div>
                  )}
                </>
              )}

             {!isChargeApplicable && isEditMode ? (
                <div className='calender-widht'>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={editableDate}
                      onChange={handleDateChange}
                      onClose={handleDatePickerClose} 
                      minDate={minDate} 
                      maxDate={maxDate}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          onBlur={handleDatePickerClose}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </div>
              ) : (
                isFuleChargeDtDisplay && (
                  <div className="service-card-title calender-widht">{editableDate.format('MM/DD/YYYY')}</div>
                )
              )}

              {(!isFuleChargeDtDisplay) && <div className="service-card-body-text">Current Charge: {currentcharge}%</div>}

              {/* Edit Icon */}
              <IconButton onClick={handleEditClick}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Typography>
          </CardContent>
        </Card>
      </Item>
    </Grid>
  );
};

export default FuelWithDrawCardComponent;
