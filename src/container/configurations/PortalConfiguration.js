
import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Switch, Button, Box, Typography } from '@mui/material';
import { alertActions, configAction } from '_store';
import { AutocompleteInput } from '_components';
import Grid from "@material-ui/core/Grid";
import _ from 'lodash';

const PortalConfiguration = (props) => {
    const dispatch = useDispatch();
    const initialData = props.data;
    const options= props.options;
    const [data, setData] = useState(_.cloneDeep(initialData));
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });

    useEffect(() => {
        setData(_.cloneDeep(props.data));
    }, [props.data]);

    const pivotData = useCallback((portal) => {
        const result = [];
        const accessNames = new Set();
        const roles = {};

        portal?.PortalRoleAccess.forEach(roleAccess => {
            roleAccess.FeatureAccess.forEach(permission => {
                accessNames.add(permission.AccessID);
                if (!roles[permission.AccessID]) {
                    roles[permission.AccessID] = {};
                }
                roles[permission.AccessID][roleAccess.RoleID] = permission.IsActive;
            });
        });

        accessNames.forEach(featureId => {
            const featureName = portal.PortalRoleAccess[0].FeatureAccess?.find(permission => permission.AccessID === featureId)?.AccessName;
            const row = { AccessID: featureId, FeatureName: featureName };
            Object.keys(roles[featureId]).forEach(roleId => {
                row[roleId] = roles[featureId][roleId];
            });
            result.push(row);
        });

        return result;
    }, []);

    const pivotedData = useMemo(() => {
        return pivotData(data);
    }, [data, pivotData]);

    const handleToggle = (featureId, roleId) => {
        setData(prevData => {
            const updatedData = _.cloneDeep(prevData);
            updatedData.PortalRoleAccess.forEach(roleAccess => {
                roleAccess.FeatureAccess.forEach(permission => {
                    if (permission.AccessID === parseInt(featureId) && roleAccess.RoleID === parseInt(roleId)) {
                        permission.IsActive = !permission.IsActive;
                    }
                });
            });
            return updatedData;
        });
    };

    const handleSubmit = async () => {
        const changedData = [];
        data.PortalRoleAccess.forEach((roleAccess, roleIndex) => {
            roleAccess.FeatureAccess.forEach((permission, featureIndex) => {
                const initialPermission = initialData.PortalRoleAccess[roleIndex].FeatureAccess[featureIndex];
                if (permission.IsActive !== initialPermission.IsActive) {
                    changedData.push({
                        RoleAccessMappingID: permission.RoleAccessMappingID,
                        IsActive: permission.IsActive
                    });
                }
            });
        });

        try {
            let message;
            await dispatch(configAction.postAccess(changedData)).unwrap();
            message = 'Config updated';
            props.handleFetch();
            dispatch(alertActions.success({ message, showAfterRedirect: true }));
        } catch (error) {
            dispatch(alertActions.error({ message: error?.message || error, header: "Role Management" }));                               
        }
    };

    const columns = useMemo(() => {
        const dynamicColumns = [
            { header: 'Feature Name', accessorKey: 'FeatureName' }
        ];
        if (pivotedData.length > 0) {
            Object.keys(pivotedData[0]).forEach(key => {
                if (key !== 'AccessID' && key !== 'FeatureName') {
                    const role = data.PortalRoleAccess?.find(roleAccess => roleAccess.RoleID === parseInt(key)).RoleName;
                    dynamicColumns.push({
                        header: role,
                        accessorKey: key,
                        enableColumnFilter: false,
                        Cell: ({ cell }) => (
                            <Switch
                                checked={cell.getValue() === true}
                                onChange={() => handleToggle(cell.row.original.AccessID, key)}
                            />
                        ),
                    });
                }
            });
        }
        return dynamicColumns;
    }, [pivotedData, data]);

    const table = useMaterialReactTable({
        columns,
        data: pivotedData,
        state: { pagination },
        onPaginationChange: setPagination,
        autoResetPageIndex: false, // Prevents resetting to the first page
        enableSorting: true,
        enablePagination: true,
        enableHiding: false,
        enableGlobalFilter: false,
        enableFullScreenToggle: false,
        enableColumnActions: false,
        initialState: {
            pagination: { pageSize: 5, pageIndex: 0 }, // Set initial rows per page
        },
        renderTopToolbarCustomActions: () => (
            <Box
                sx={{
                    display: 'flex',
                    gap: '16px',
                    padding: '8px',
                    flexWrap: 'wrap',
                }}
            >
                <Grid container spacing={3} className='passwordcheck'>                    
                        <AutocompleteInput
                            control={props.control}
                            name="selectedPortal"
                            label="Select Portal"
                            value={options?.find(option => option.value === props.selectedPortal || null)}
                            options={options}
                            error={!!props.errors.selectedPortal}
                            helperText={props.errors.selectedPortal?.message}
                            handleBlur={() => { }}
                            onChange={props.handlePortalChange}
                        />
                    
                </Grid>
                <Typography variant="h2" className='portalconfiguration'>{props.portalName}</Typography>
            </Box>
        ),
    });

    return (
        <div>

            <MaterialReactTable table={table} />
            <Button className='submitbutton' variant="contained" color="primary" onClick={handleSubmit}>
                Submit
            </Button>
        </div>
    );
};

export default PortalConfiguration;
