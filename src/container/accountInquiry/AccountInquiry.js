import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Typography, TextField, InputAdornment } from "@mui/material";
import Grid from "@mui/material/Grid2";
import SearchIcon from '@mui/icons-material/Search';
import AccountInquiryList from "./AccountInquiryList";
import AccountInquiryFilter from './AccountInquiryFilter';
import { alertActions } from '_store';
import { accountInquiryData } from '_utils/constant';
import { accountInquiryActions } from '_store/accountInquery.slice'

const AccountInquiry = () => {
  const header = "Account Inquiry";
  const dispatch = useDispatch();
  // const authUserId = useSelector(x => x.auth?.userId);
  const [data, setData] = useState([]);
  // const [searchInput, setSearchInput] = useState(''); // State for search input
  const [openComponent, setOpenComponent] = useState(null);
  const [backdropOpen, setBackdropOpen] = useState(false);
  const [noRecordMessage,setNoRecordMessage] =useState(null);
  const [searchInput, setSearchInput] = useState('');
  const accountList = accountInquiryData?.Data?.AccountData;



  const handleFilterSubmit = async (isGlobalSearch, data) => {
    let payload = {
      Data: {
        account_Number: null,
        phone_Number: null,
        first_Name: null,
        last_Name: null,
        house_Number: null,
        street: null,
        city: null,
        state: null
      }
    };
  
    if (isGlobalSearch) {
      const input = typeof data === 'string' ? data.trim() : '';
  
      if (/^\d{10}$/.test(input)) {
        payload.Data.phone_Number = input;
      } else if (/^\d{12}$/.test(input)) {
        payload.Data.account_Number = input;
      } else if (/^[a-zA-Z\s]+$/.test(input)) {
        const nameParts = input.split(' ');
        if (nameParts.length > 1) {
          payload.Data.first_Name = nameParts[0];
          payload.Data.last_Name = nameParts.slice(1).join(' ');
        } else {
          payload.Data.first_Name = nameParts[0];
        }
      } else if (/^[a-zA-Z0-9\s]+$/.test(input)) {
        const parts = input.split(' ');
        const houseNumber = parts.find(p => /^\d+$/.test(p));
        const streetStartIndex = houseNumber ? parts.indexOf(houseNumber) + 1 : 0;
        const street = parts.slice(streetStartIndex, streetStartIndex + 2).join(' ');
        const city = parts[streetStartIndex + 2] || '';
        const state = parts[streetStartIndex + 3] || '';
  
        payload.Data.house_Number = houseNumber || null;
        payload.Data.street = street || null;
        payload.Data.city = city || null;
        payload.Data.state = state || null;
      }
    } else {
      payload = {
        Data: {
          account_Number: data.WashingtonGasAccount,
          phone_Number: data.PhoneNumber,
          first_Name: data.AccountHolder.FirstName,
          last_Name: data.AccountHolder.LastName,
          house_Number: data.ServiceAddress.HouseNumber,
          street: data.ServiceAddress.StreetAddress,
          city: data.ServiceAddress.City,
          state: data.ServiceAddress.State
        }
      };
    }
  
    try {
      const result = await dispatch(accountInquiryActions.getInquiryDetails(payload)).unwrap();
  
      if (result?.Succeeded) {
        const mappedData = result.Data.map((account, index) => ({
          AccountNumber: account.Account_Number,
          AccountHolder: account.Name1,
          SecondaryName: account.Name2 || account.Name1,
          ServiceAddress: account.Service_Address1,
          BillingAddress: account.Billing_Address1,
          PhoneNumber: account.Phone_Number,
          AmountDue: account.Amount_due.trim()
        }));
        setData(mappedData);
        setNoRecordMessage('');
      } else {
        setData([]);
      }
    } catch (error) {
      setData([]);
      setNoRecordMessage(error);
      console.error("Error fetching account inquiry:", error);
    }
  };

  const handleOpenComponent = (component) => {
    setOpenComponent(prev => prev === component ? null : component);
    setBackdropOpen(prev => prev === component ? false : true);
  };

  const handleCloseBackdrop = () => {
    setBackdropOpen(false);
    setOpenComponent(null);
  };

  return (
    <>
      <Typography component="div" className='userprofilelist '>
        <Grid container direction="row" spacing={2}>
          <Grid size={{ xs: 12, sm: 12, md: 12 }}>
            <Grid container>
              <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                <Typography variant="h2" className='userprofilelistcontent'>Account Inquiries</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 8 }} >
                <Grid container spacing={2} justifyContent="flex-end" className="MarketerManagement">
                  <Grid size={{ xs: 12, sm: 12, md: 8 }} >
                    <Grid container spacing={2} justifyContent="flex-end">
                      <Grid size={{ xs: 6, sm: 6, md: 4 }}>
                        <AccountInquiryFilter
                          handleFilterSubmit={handleFilterSubmit}
                          isOpen={openComponent === 'filter'}
                          onClose={handleCloseBackdrop}
                          onOpen={() => handleOpenComponent('filter')}
                        />
                      </Grid>

                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

        </Grid>
      </Typography>

      <TextField
        type="text"
        variant="outlined"
        fullWidth
        className="SearchIconinput"
        margin="normal"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="start" onClick={()=>handleFilterSubmit(true,searchInput)}>
              <SearchIcon className="SearchIcon" />
            </InputAdornment>
          ),
          'aria-label': 'search Account Inquiry'
        }}
      />
      <div className={backdropOpen ? 'backdrop' : ''}>
      </div>
      <div className='MarketerList'>
        <AccountInquiryList
          data={data}
          noRecordMessage={noRecordMessage}
        />

      </div>

    </>
  );
}


export default AccountInquiry;