import React, { ReactElement } from 'react';
import { AppBar, Button, Toolbar, Typography, Box, Link } from '@mui/material';
import {Link as RouterLink } from 'react-router-dom';

interface AppToolbarProps {
    isDocumentation?:boolean;
}

function AppToolbar({isDocumentation}: AppToolbarProps):ReactElement {
    return (
        <Box sx={{display: 'flex'}}>
            <AppBar color="primary" variant="elevation" position="fixed">
                <Toolbar>
                    <Typography align='left' color='inherit' variant="h6" sx={{flexGrow: 1}}>TM Program Executor</Typography>
                    <div>
                        <Button color='inherit'>
                            {isDocumentation === true ? 
                                <Link component={RouterLink} color='inherit' to="/" underline='none'>Editor</Link> : 
                                <Link component={RouterLink} color='inherit' to="/documentation" underline='none'>Documentation</Link>}
                        </Button>
                    </div>
                </Toolbar>
            </AppBar>
            <Toolbar></Toolbar>
        </Box>
    );
}

export default AppToolbar;