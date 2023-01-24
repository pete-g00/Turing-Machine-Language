import React from 'react';
import { Container, Divider, List, ListItem, ListItemButton, Link } from '@mui/material';
import AppToolbar from '../Apptoolbar/Apptoolbar';
import Navigation from '../DocumentationNavigation/DocumentationNavigation';
import { Link as RouterLink } from 'react-router-dom';
import { UserConfiguration } from '../../App';

export interface DocumentationProps {
    userConfiguration:UserConfiguration;
}

function Documentation({ userConfiguration }:DocumentationProps) {
    document.title = "TMP Documentation";

    const navArray = [
        {name: "Documentation"}
    ];
    return (
        <Container>
            <AppToolbar userConfiguration={userConfiguration} isDocumentation></AppToolbar>
            <Navigation navArray={navArray}></Navigation>
            <div className="content">
                <h1>Documentation</h1>
                <Divider/>
                <p>Welcome to the documentation section in the Turing Machine Editor! Here, you can find specifications of the Turing Machine and the Turing Machine program, along with error documentations and example programs.</p>
                {/* Add an introduction to website passage? */}
                <h2>Explore Documentation</h2>
                <List>
                    <ListItem disablePadding>
                        <span><ListItemButton>Turing Machine Specification</ListItemButton></span>
                    </ListItem>
                    <ListItem disablePadding>
                        <span><ListItemButton>Turing Machine Program Specification</ListItemButton></span>
                    </ListItem>
                    <ListItem disablePadding>
                        <Link color="inherit" underline='none' component={RouterLink} to='/documentation/errors/'>
                           <ListItemButton>Errors</ListItemButton>
                        </Link>
                    </ListItem>
                    <ListItem disablePadding>
                        <span><ListItemButton>Examples</ListItemButton></span>
                    </ListItem>
                </List>
            </div>
        </Container>
    );
}

export default Documentation;