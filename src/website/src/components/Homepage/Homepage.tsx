import React from 'react';
import { Grid } from '@mui/material';
import Editor from '../Editor/Editor';
import TMPanel from '../TMPanel/TMPanel';
import TMTape from '../TMTape/TMTape';
import './Homepage.css';
import AppToolbar from '../Apptoolbar/Apptoolbar';

function HomePage() {
    return (
        <div>
            <div className="toolbar">
                <AppToolbar></AppToolbar>
            </div>
            <Grid container className="code-section">
                <Grid item xs={12} md={6} className="editor">
                    <Editor></Editor>
                </Grid>
                <Grid item xs={12} md={6} className="tm">
                    <div className="tm-panel"><TMPanel></TMPanel></div>
                    <div className="tm-tape"><TMTape></TMTape></div>
                </Grid>
            </Grid>
        </div>
    );
}

export default HomePage;