import React from 'react';
import { Container, Grid, Link } from '@mui/material';
import AppToolbar from '../Apptoolbar/Apptoolbar';
import Navigation from '../DocumentationNavigation/DocumentationNavigation';
import * as _errors from '../errors.json';
import { Link as RouterLink } from 'react-router-dom';

export interface ErrorData {
    title:string;
    description:string;
    fix:string;
}

const errors:{[key:string]: ErrorData} = _errors;

function ErrorDocumentation() {
    const navArray = [
        {name: "Documentation", link: "/documentation"},
        {name: "Errors"}
    ];
    const keys = Object.keys(errors);

    const firstQuartile = Math.ceil(keys.length/4);
    const division = [0, 1];
    const indices = Array.from({length: firstQuartile}, (v, k) => k);
    return (
        <Container>
            <AppToolbar isDocumentation></AppToolbar>
            <Navigation navArray={navArray}></Navigation>
            <div className="content">
                <h1>Turing Machine Program Errors</h1>
                <p>Before executing the code, it gets parsed and validated. This page lists the errors that can occur during the two stages. Click on each error to see it in more detail!</p>
                <Grid container>
                    {division.map((_value, i) => {
                        return <Grid key={i.toString()} item  xs={12} sm={6}>{
                            indices.map((_, j) => {
                                const key = keys[firstQuartile*i + j];
                                return key ? (
                                    <p key={j.toString()}>
                                        <Link color="inherit" underline='none' component={RouterLink} 
                                            to={"/Turing-Machine-Language/documentation/errors/" + key}>
                                            {errors[key].title}
                                        </Link>
                                    </p>
                                ) : undefined;
                            })
                        }</Grid>;
                    })}
                </Grid>
            </div>
        </Container>
    );
}

export default ErrorDocumentation;