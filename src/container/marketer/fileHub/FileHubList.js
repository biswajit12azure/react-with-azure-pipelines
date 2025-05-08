import React, { useState, useMemo, useEffect } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import IconButton from '@mui/material/IconButton';
import { Box, TextField, Tooltip, Typography } from '@mui/material';
import { PlayCircleOutline, PauseCircleOutline, Sync, FilterListOff } from '@mui/icons-material';
import { ModalPopup, MultiSelectAutocomplete, MultiSelectMenu } from '_components';
import FileHubDetails from "./FileHubDetails";
import dayjs from 'dayjs';
import { Delete, materialsymbolsdownload, Deletewhite, DownloadWhite } from 'images';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useSelector } from 'react-redux';


const FileHubList = ({ marketerData, handleDelete, rowSelection, handleChange, isModalOpen, setIsModalOpen, onLockToggle, selectedRows, setSelectedRows,
    setRowSelection, handleRefresh, handleDownload, isEnableDownload, isEnableDelete }) => {
    const [selectedRow, setSelectedRow] = useState(null);
    const [expandedRow, setExpandedRow] = useState(null);
    const [isModalOpenFilehub, setIsModalOpenFilehub] = useState(false);
    const [isDeleteEnable, setIsDeleteEnable] = useState(false);
    const [isDownloadEnable, setIsDownloadEnable] = useState(false);
    const [isStandardUser, setIsStandardUser] = useState(false);
    const id = useSelector(x => x.auth?.userId);
    const authUser = useSelector(x => x.auth?.value);
    const user = authUser?.Data;

    useEffect(() => {
        const userAccess = user?.UserAccess;
        const isStandardUser = userAccess?.some(access => access.Role === "Standard User");

        if (isStandardUser) {
            setIsStandardUser(true);
        }
    }, []);

    const handleOpenModal = (row) => {
        setSelectedRow(row);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRow(null);
    };

    const handleLockToggle = (selectedRow) => {
        onLockToggle(selectedRow);
        setIsModalOpen(false);
    }

    const handleRowDelete = (row) => {
        handleDelete(row);
        setSelectedRows([]);
        setRowSelection({});
    };

    const handleDeleteBulkFile = () => {

    }

    const handleDownloadBulk = () => {

    }

    const datalist = [
        {
            FileName: "9094839_SFES_9232",
            Marketer: "Marketer #1",
            FileType: "READ",
            lastupdate: "11/11/2024",
        },
    ];

    const columns = [
        {
            accessorKey: "FileHubName",
            header: "File Name",
            Cell: ({ row }) => (
                <span onClick={() => handleAddEdit(row)} >
                    <Typography sx={{ ml: 1 }}>{row.original.FileData[0].FileName}</Typography>
                </span>
            ),
        },
        ...(!isStandardUser ? [{
            accessorKey: "MarketerName",
            header: "Marketer",
        }] : []),
        { accessorKey: "FileType", header: "File Type" },
        { accessorKey: "FileSubType", header: "File SubType" },
        {
            accessorKey: "LastUpdate",
            header: "last update",
            Cell: ({ cell }) => (
                <Box >
                    {cell.getValue()}
                </Box>
            ),
        },
        { accessorKey: "Status", header: "Status" },
    ];

    const handleAddEdit = (row) => {
        if (expandedRow && expandedRow !== row) {
            expandedRow.toggleExpanded();
        }
        row.toggleExpanded();
        setExpandedRow(row);
    };

    const handleOpenModalFileHub = () => {
        setIsModalOpenFilehub(true);
    }

    const handleCloseModalFileHub = () => {
        setIsModalOpenFilehub(false);
    }

    const table = useMaterialReactTable({
        columns,
        data: marketerData,
        enableHiding: false,
        columnFilterDisplayMode: 'popover',
        enableFullScreenToggle: false,
        enableColumnActions: false,
        paginationDisplayMode: 'pages',
        enableRowActions: true,
        enableRowSelection: true,
        enableExpandAll: false,
        positionExpandColumn: 'first',
        positionActionsColumn: "last",
        positionToolbarAlertBanner: 'none',
        autoResetPageIndex: false,
        state: {
            rowSelection,
        },
        getRowId: (row) => row.UserId,
        onRowSelectionChange: (newRowSelection) => {
            setRowSelection(newRowSelection);
        },
        displayColumnDefOptions: {
            'mrt-row-expand': {
                header: "",
                size: 10,
                muiTableHeadCellProps: {
                    sx: {
                        display: 'none',
                    },
                },
                muiTableBodyCellProps: {
                    sx: {
                        display: 'none',
                    },
                },
            },
        },
        initialState: {
            columnOrder: [
                'mrt-row-expand',
                'mrt-row-select',
                'FileHubName',
                'MarketerName',
                'FileType',
                'FileSubType',
                'LastUpdate',
                'mrt-row-actions'
            ],
            sorting: [
                {
                    id: 'FileHubName',
                    desc: false,
                },
                {
                    id: 'MarketerName',
                    desc: false,
                },
                {
                    id: 'FileType',
                    desc: false,
                },
                {
                    id: 'FileSubType',
                    desc: false,
                },
                {
                    id: 'LastUpdate',
                    desc: false,
                },
            ],
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
                <Tooltip title="clear filter" className='Deactivate'>
                    <div>
                        <IconButton onClick={handleRefresh} >
                            <FilterListOff variant="contained" color="secondary" />
                        </IconButton>
                    </div>
                </Tooltip>

                <Tooltip title="Download Selected">
                    <div className={isDownloadEnable ? 'DownloadSelected' : 'DownloadSelecteddisable'}>
                        <IconButton
                            onClick={handleDownloadBulk}
                            disabled={!isDownloadEnable}
                        >
                            <img src={DownloadWhite} alt="Download" className='downloadIconSize' />
                        </IconButton>
                    </div>
                </Tooltip>

                <Tooltip title="Delete Selected" className='DeleteSelected'>
                    <div>
                        <IconButton className='delete' onClick={handleOpenModalFileHub} disabled={!isDeleteEnable}>
                            <img src={Deletewhite} alt="Delete" />
                        </IconButton>

                        {isModalOpenFilehub && <ModalPopup
                            header="File Delete"
                            message1="Are you sure you want to delete the file?"
                            btnPrimaryText="Confirm"
                            btnSecondaryText="Cancel"
                            handlePrimaryClick={() => { handleDeleteBulkFile(); setIsModalOpenFilehub(false); }}
                            handleSecondaryClick={() => handleCloseModalFileHub()}
                        />
                        }
                    </div>
                </Tooltip>
            </Box>
        ),
        renderRowActions: ({ row }) => {
            return (
                <div className='tableicons'>
                    <img src={materialsymbolsdownload} alt='Download' onClick={handleDownload} disabled={!isEnableDownload} />
                    <IconButton className='delete' >
                        <img src={Delete} alt="Delete" onClick={handleOpenModal} disabled={!isEnableDelete}></img>
                    </IconButton>
                    {isModalOpen && <ModalPopup
                        header="File Delete"
                        message1="Are you sure you want to delete the file?"
                        btnPrimaryText="Confirm"
                        btnSecondaryText="Cancel"
                        handlePrimaryClick={() => { handleDelete(row.original); setIsModalOpen(false); }}
                        handleSecondaryClick={() => handleCloseModal()}
                    />
                    }
                </div>
            )
        },
        renderDetailPanel: ({ row }) => (
            <Box sx={{ padding: 2 }}>
                <FileHubDetails rowDetail={row.original} />
            </Box>
        ),
        muiExpandButtonProps: {
            sx: {
                display: 'none',
            },
        },
    });

    useEffect(() => {
        const selectedFlatRows = table.getSelectedRowModel().flatRows;
        setSelectedRows(selectedFlatRows.map((row) => row.original));
        setIsDeleteEnable(selectedFlatRows.length > 0);
        setIsDownloadEnable(selectedFlatRows.length > 0);
    }, [rowSelection, table]);

    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MaterialReactTable table={table} />
            </LocalizationProvider>
        </>
    );
};

export default FileHubList;
