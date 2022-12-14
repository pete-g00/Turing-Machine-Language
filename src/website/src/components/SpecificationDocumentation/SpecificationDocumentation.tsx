import React from 'react';
import { Container } from '@mui/material';
import AppToolbar from '../Apptoolbar/Apptoolbar';
import Navigation from '../DocumentationNavigation/DocumentationNavigation';

function SpecificationDocumentation() {
    const navArray = [
        {name: "Documentation", link: "/documentation"},
        {name: "Execution", link: "/documentation/execution"}
    ];
    return (
        <Container>
            <AppToolbar isDocumentation></AppToolbar>
            <Navigation navArray={navArray}></Navigation>
            <div className="content">
                <h1>Turing Machine Program Specficiation</h1>
                <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ducimus, tenetur architecto quo inventore assumenda quasi laborum dolor repellendus et, placeat distinctio, maxime nemo nesciunt dolorem eveniet quibusdam laudantium iure officiis.</p>
                <h1>Executing Turing Machine on a program</h1>
                <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ducimus, tenetur architecto quo inventore assumenda quasi laborum dolor repellendus et, placeat distinctio, maxime nemo nesciunt dolorem eveniet quibusdam laudantium iure officiis.</p>
            </div>
        </Container>
    );
}

export default SpecificationDocumentation;