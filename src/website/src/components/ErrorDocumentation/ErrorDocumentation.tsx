import React from 'react';
import { Container, Divider, Grid, Link, List, ListItem, ListItemButton } from '@mui/material';
import AppToolbar from '../Apptoolbar/Apptoolbar';
import Navigation from '../DocumentationNavigation/DocumentationNavigation';
import * as _errors from '../errors.json';
import { Link as RouterLink } from 'react-router-dom';

export interface ErrorData {
    title:string;
    description:string;
    fix:string;
    code:string;
    caption:string;
}

export interface ErrorInterface {
    parser: {[key:string]: ErrorData},
    validator: {[key:string]: ErrorData}
}

const errors:ErrorInterface = _errors;

function ErrorDocumentation() {
    document.title = "TMP Errors";

    const navArray = [
        {name: "Documentation", link: "/documentation"},
        {name: "Errors"}
    ];
    const parserKeys = Object.keys(errors.parser);
    const validatorKeys = Object.keys(errors.validator);
    return (
        <Container>
            <AppToolbar isDocumentation></AppToolbar>
            <Navigation navArray={navArray}></Navigation>
            <div className="content">
                <h1>Turing Machine Program Errors</h1>
                <Divider/>
                <p>Before executing the code, it gets parsed and validated. This page lists the errors that can occur during the two stages. Click on each error to see it in more detail!</p>
                <Grid container>
                    <Grid item xs={12} sm={6}>
                        <h2>Parsing Errors</h2>
                        <List>
                            {parserKeys.map((key) => {
                                return (
                                    <ListItem key={key} disablePadding>
                                        <Link color="inherit" underline='none' component={RouterLink} to={"/documentation/errors/" + key}>
                                            <ListItemButton>{ errors.parser[key].title }</ListItemButton>
                                        </Link>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <h2>Validation Errors</h2>
                        <List>
                            {validatorKeys.map((key) => {
                                return (
                                    <ListItem key={key} disablePadding>
                                        <Link color="inherit" underline='none' component={RouterLink} to={"/documentation/errors/" + key}>
                                            <ListItemButton>{ errors.validator[key].title }</ListItemButton>
                                        </Link>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Grid>
                </Grid>
            </div>
        </Container>
    );
}

export default ErrorDocumentation;