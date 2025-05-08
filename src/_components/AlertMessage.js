import React,{useEffect,useState} from "react";
import { Alert, Stack,AlertTitle, Typography } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import { alertMessageActions, alertActions, } from '_store';
import Grid from "@mui/material/Grid2";
const AlertMessage = ({portalID}) => {
        const authUser = useSelector(x => x.auth.value);
        const user = authUser?.Data;
      const dispatch = useDispatch();
    const [data,setData] = useState([]);
    const [alertMessage,setAlertMessage] = useState(false);
    const [dismissedIds, setDismissedIds] = useState([]);
    console.log("@@@@@@@@@@@@@@@@@@",portalID);
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@",user?.UserDetails?.id);
    const portalid  = sessionStorage.getItem('portalID') || portalID;
    const Roleid = user?.UserAccess?.filter(user => user.PortalId === portalid);
    console.log(user);
    console.log(Roleid[0]?.RoleId);
    const handleClose = (id) => {
      setDismissedIds((prev) => [...prev, id]);
    };
  useEffect(() => {
    const fetchData = async () => {
      dispatch(alertActions.clear());
      try {
       let  transformed = {
            portalID : portalid,
            roleId :Roleid[0]?.RoleId,
            // Roleid: user?.UserAccess?.filter(user => user.PortalId === portalid);
        }
        const result = await dispatch(alertMessageActions.getAlertMessageDetails(transformed)).unwrap();
        const details = result?.Data;
        console.log("##########################################",details);
        setData(details);
      } catch (error) {
     
        console.log(error);
      }
    };
    fetchData();
  }, [dispatch, portalID]);
    return(
<>
{data && data.map(item =>(
   !dismissedIds.includes(item.ID) ? (
    <Stack className="Stackalert" sx={{ width: '100%' }} spacing={2} style={{display : alertMessage ? 'none' : 'block' }}>
      <Alert style={{width:'100%'}} icon={false} severity="error" onClose={() => handleClose(item.ID)}>
      <Grid container direction="row" spacing={2}>
      <Grid size={{ xs: 6, sm: 6, md: 2}}>
      <AlertTitle className="alertitle">{item.Title}</AlertTitle>
      </Grid>
      <Grid size={{ xs: 6, sm: 6, md: 10}}>
      <Typography className="alertdata">{item.Data}</Typography>
      </Grid>
      </Grid>
      
      </Alert>
      </Stack>
   ):null
))
}
</>
    )
}

export default AlertMessage;