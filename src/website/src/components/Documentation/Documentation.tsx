import { Container, Breadcrumbs, Typography } from '@mui/material';
import React from 'react';
import AppToolbar from '../Apptoolbar/Apptoolbar';

function Documentation() {
    return (
        <Container>
            <div className="toolbar">
                <AppToolbar isDocumentation></AppToolbar>
            </div>
            <div className="history">
                <Breadcrumbs aria-label="breadcrumb">
                    <Typography color="text.primary">Documentation</Typography>
                </Breadcrumbs>
            </div>
            <div className="content">
                <h1>Documentation</h1>
                <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ducimus, tenetur architecto quo inventore assumenda quasi laborum dolor repellendus et, placeat distinctio, maxime nemo nesciunt dolorem eveniet quibusdam laudantium iure officiis.</p>
            </div>
        </Container>
    );
}

export default Documentation;