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
    document.title = "TML Documentation";

    const navArray = [
        {name: "Documentation"}
    ];
    return (
        <Container>
            <AppToolbar isDocumentation userConfiguration={userConfiguration}></AppToolbar>
            <Navigation navArray={navArray}></Navigation>
            <div className="content">
                <h1>Documentation</h1>
                <Divider/>
                <p>Welcome to the documentation section in the Turing Machine Editor! Here, you can find specifications of the Turing Machine and the Turing Machine Language, along with error documentations and example programs.</p>
                <h2>Explore Documentation</h2>
                <List>
                    <ListItem disablePadding>
                        <Link color="inherit" underline='none' component={RouterLink} to='/documentation/turing-machine/'>
                           <ListItemButton>Turing Machine Specification</ListItemButton>
                        </Link>
                    </ListItem>
                    <ListItem disablePadding>
                        <Link color="inherit" underline='none' component={RouterLink} to='/documentation/turing-machine-language/'>
                           <ListItemButton>Turing Machine Program Specification</ListItemButton>
                        </Link>
                    </ListItem>
                    <ListItem disablePadding>
                        <Link color="inherit" underline='none' component={RouterLink} to='/documentation/errors/'>
                           <ListItemButton>Errors</ListItemButton>
                        </Link>
                    </ListItem>
                </List>
            </div>
        </Container>
    );
}

export default Documentation;