
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PortalConfiguration from "./PortalConfiguration";
import { configAction,alertActions } from '_store';
import { useForm } from 'react-hook-form';
import { Typography,Button } from '@mui/material';
import Grid from '@mui/material/Grid2';
import AddRole from './AddRole';

const Configuration = () => {
    const header = "Role Management";
    const dispatch = useDispatch();
    // const portalAccessData = useSelector((x) => x.configs?.portalAccessGetData);
    // const accessData = portalAccessData?.Data || [];
    // console.log(accessData);
    const [selectedPortal, setSelectedPortal] = useState(1);
    const [data, setData] = useState(null);
    const [initialData, setInitialData] = useState(null);
    const portals = [{
        "PortalID": 1,
        "PortalName": "Account Inquiry",
    },
    {
        "PortalID": 2,
        "PortalName": "Energy Assistance",
    },
    {
        "PortalID": 3,
        "PortalName": "Map Center",
    },
    {
        "PortalID": 4,
        "PortalName": "Marketer",
    },
    {
        "PortalID": 5,
        "PortalName": "Supplier Diversity",
    }]
    const options = portals?.map(portal => ({
        value: portal.PortalID,
        label: portal.PortalName
    }));

    const portalName = options.find(option=>option.value===selectedPortal)?.label;
    
    const { control, formState: { errors } } = useForm();

    useEffect(() => {
        fetchData();
    }, [dispatch,selectedPortal]);

    const fetchData = async() => 
    {
        try {
            dispatch(alertActions.clear());
  
            const result = await dispatch(configAction.getAccess(selectedPortal));
            setData(result?.payload?.Data);
            setInitialData(result?.payload?.Data)
            if (result?.error) {
                dispatch(alertActions.error({
                    showAfterRedirect: true,
                    message: result?.payload || result?.error.message,
                    header: `${header} Failed`
                }));
                return;
            }
        }
        catch (error) {
            dispatch(alertActions.error({ message: error?.message || error, header: "Role Management" }));             
        }
    }

    // useEffect(() => {
    //     if (accessData && accessData.length > 0) {
    //         const defaultPortalId = selectedPortal ? selectedPortal : accessData[0]?.PortalID;
    //         setSelectedPortal(defaultPortalId);
    //         const portalData = accessData?.find(x => x.PortalID === defaultPortalId);
    //         setData(portalData);
    //     }
    // }, [accessData]);

    // useEffect(() => {
    //     if (accessData && selectedPortal) {
    //         const portalData = accessData?.find(x => x.PortalID === selectedPortal);
    //         setData(portalData);
    //     }
    // }, [selectedPortal, accessData]);

    const handlePortalChange = (value) => {
        setSelectedPortal(value);
    };

    const handleFetch=()=>{
        fetchData();
    }

    return (
        <form>
            <Grid container spacing={3} className="Configurationbuttonmar-20">
                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 8, sm: 8, md: 6 }}>
                        <Typography variant="h2" className='userprofilelistcontent'>Role Management </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid size={{ xs: 6, sm: 6, md: 6 }}  className="Configurationbutton">
                <AddRole  handleFetch={()=>handleFetch}></AddRole> 
                </Grid>
            </Grid>
            {data && <PortalConfiguration 
                control={control}
                errors={errors}
                data={data[0]}
                initialData={initialData[0]}
                options={options} 
                setData={setData}
                selectedPortal={selectedPortal}
                handlePortalChange={handlePortalChange}
                portalName={portalName} 
                handleFetch={handleFetch} />}

            <Grid size={{ xs: 12, sm: 12, md: 12 }} className="Personal-Information">
                <Button variant="contained" color="red" className="cancelbutton" onClick={handleFetch} >
                    Cancel
                </Button>
                {/* <Button type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className='submitbutton'
                    // onClick={handleSave}
                    // disabled={!isEdited}
                >
                    Save
                </Button> */}
            </Grid>
        </form>
    );
}

export default Configuration;
