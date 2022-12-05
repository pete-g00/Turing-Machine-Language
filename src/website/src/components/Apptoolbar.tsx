import React, { ReactElement } from 'react';
import { AppBar, Button, Toolbar, Typography, Box } from '@mui/material';

function AppToolbar():ReactElement {
    return (
        <Box sx={{display: 'flex'}}>
            <AppBar color="primary" variant="elevation" position="sticky">
                <Toolbar>
                    <Typography align='left' color='inherit' variant="h6" sx={{flexGrow: 1}}>TM Program Executor</Typography>
                    <div>
                        <Button color='inherit'>Documentation</Button>
                        <Button color='inherit'>Examples</Button>
                    </div>
                </Toolbar>
            </AppBar>
            <Toolbar></Toolbar>
        </Box>
    );
}

export default AppToolbar;