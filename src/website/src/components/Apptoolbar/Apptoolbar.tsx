import React from 'react';
import { AppBar, Button, Toolbar, Typography, Box, Link, IconButton, Tooltip } from '@mui/material';
import {Link as RouterLink } from 'react-router-dom';
import SettingsIcon from '@mui/icons-material/Settings';
import { UserConfiguration } from '../../App';

interface AppToolbarProps {
    isDocumentation?:boolean;
    userConfiguration:UserConfiguration;
}

function AppToolbar({ isDocumentation, userConfiguration }: AppToolbarProps) {
    return (
        <Box sx={{display: 'flex'}}>
            <AppBar color="primary" variant="elevation" position="fixed">
                <Toolbar>
                    <Typography align='left' color='inherit' variant="h6" sx={{flexGrow: 1}}>TM Program Executor</Typography>
                    <div>
                        {!isDocumentation && <Tooltip title='Change Settings'>
                            <IconButton color='inherit' onClick={() => userConfiguration.openDrawer(userConfiguration)}>
                                <SettingsIcon/>
                            </IconButton>
                        </Tooltip>}
                        <Button color='inherit'>
                            {isDocumentation === true ? 
                                <Link component={RouterLink} color='inherit' to="/" underline='none'>Editor</Link> : 
                                <Link component={RouterLink} color='inherit' to="/documentation" underline='none'>Documentation</Link>}
                        </Button>
                    </div>
                </Toolbar>
            </AppBar>
            <Toolbar />
        </Box>
    );
}

export default AppToolbar;