import React from 'react';
import { Container, Divider } from '@mui/material';
import AppToolbar from '../Apptoolbar/Apptoolbar';
import Navigation from '../DocumentationNavigation/DocumentationNavigation';
import { DocumentationProps } from '../Documentation/Documentation';

function ExecutionDocumentation({ userConfiguration }:DocumentationProps) {
    document.title = "TMP Execution Specification";

    const navArray = [
        {name: "Documentation", link: "/documentation"},
        {name: "Execution", link: "/documentation/execution"}
    ];
    return (
        <Container>
            <AppToolbar isDocumentation userConfiguration={userConfiguration}/>
            <Navigation navArray={navArray}></Navigation>
            <div className="content">
                <h1>Executing Turing Machine on a tape</h1>
                <Divider/>
                <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ducimus, tenetur architecto quo inventore assumenda quasi laborum dolor repellendus et, placeat distinctio, maxime nemo nesciunt dolorem eveniet quibusdam laudantium iure officiis.</p>
                <h1>Executing Turing Machine on a program</h1>
                <Divider/>
                <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ducimus, tenetur architecto quo inventore assumenda quasi laborum dolor repellendus et, placeat distinctio, maxime nemo nesciunt dolorem eveniet quibusdam laudantium iure officiis.</p>
            </div>
        </Container>
    );
}

export default ExecutionDocumentation;