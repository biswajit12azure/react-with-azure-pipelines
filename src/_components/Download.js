import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import {materialsymbolsdownload} from './../images';
import exportPDF from '_utils/exportPdf';
import exportCSV from '_utils/exportCsv';
import exportExcel from '_utils/exportExcel';

const files = ['PDF', 'XLS', 'CSV'];

const Download = (props) => {
  const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const rows = props.rows;
    const headers = props.headers;
    const filename = props.filename;

    const handleExport = (name) => {
        switch (name.toLowerCase()) {
            case 'pdf':
                exportPDF(rows, headers, filename);
                break;
            case 'xls':
                exportExcel(rows, headers, filename);
                break;
            case 'csv':
                exportCSV(rows, headers, filename);
                break;
            default:
                return;
        }
        handleCloseUserMenu();
    }

    return (
 
           
                <Toolbar disableGutters>
                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <Button className='Download' onClick={handleOpenUserMenu} variant="contained" >
                            <img src={materialsymbolsdownload} alt='download'></img> Download
                            </Button>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {files.map((file) => (
                                <MenuItem key={file} onClick={handleExport}>
                                    <Typography sx={{ textAlign: 'center' }}>{file}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
        
    );
}

export default Download;