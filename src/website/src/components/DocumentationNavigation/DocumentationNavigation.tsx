import React from 'react';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import {Link as RouterLink } from 'react-router-dom';

interface NavigationProps {
    navArray:{name:string, link?:string}[];
}

function Navigation({navArray}:NavigationProps) {
    return (
        <div className="history">
            <Breadcrumbs aria-label="breadcrumb">
            {navArray.map((value, i) => {
                if (i === navArray.length-1) {
                    return <Typography key={i.toString()} color="text.primary">{value.name}</Typography>;
                } else {
                    return <Link key={i.toString()} component={RouterLink} underline='hover' color="inherit" to={value.link!}>{value.name}</Link>;
                }
            })}
            </Breadcrumbs>
        </div>
    );
}

export default Navigation;