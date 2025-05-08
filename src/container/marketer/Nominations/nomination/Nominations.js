import React,{useState} from 'react';
import {Tabs,Typography,Button} from '@mui/material';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import GroupNomination from '../nominationByGroup/GroupNomination';
import PipelineNomination from '../nominationByPipeline/PipelineNomination';
import Grid from "@mui/material/Grid2";
import dayjs from 'dayjs';
const TabPanel = ({ value, index, children }) => {
    return (
      value === index && (
        <Box sx={{ p: 2 }}>
          <Typography>{children}</Typography>
        </Box>
      )
    );
  };
const Nominations = () =>{
  const [value, setValue] = useState('one');
  const [fromDate, setFromDate] = useState(dayjs().startOf('month').toDate());
  const [toDate, setToDate] = useState(dayjs().endOf('month').toDate());
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
    <Box sx={{ width: '100%' }}>
      <Tabs
      className='wrappedlabel'
        value={value}
        onChange={handleChange}
        aria-label="wrapped label tabs example"
      >
        <Tab
          value="one"
          label="Nomination By Pipeline"
          wrapped
        />
        <Tab value="two" label="Nomitaion By Group" />
        {/* <Tab value="three" label="Item Three" /> */}
      </Tabs>
      <TabPanel value={value} index="one">
      <PipelineNomination
      fromDate={fromDate}
      setFromDate={setFromDate}
      toDate={toDate}
      setToDate={setToDate}
      />
      </TabPanel>
      <TabPanel value={value} index="two">
      <GroupNomination
      fromDate={fromDate}
      setFromDate={setFromDate}
      toDate={toDate}
      setToDate={setToDate}
      />
      </TabPanel>

    </Box>
          <Grid size={{ xs: 12, sm: 12, md: 12 }} className="Personal-Information">
          <Button variant="contained" color="red" className="cancelbutton" >
            Cancel
          </Button>
          <Button type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className='submitbutton'
          //   onClick={handleSubmit}
          //   disabled={!isDataChanged}
          >
            Save
          </Button>
        </Grid>
        </>
  );
}

export default Nominations;
