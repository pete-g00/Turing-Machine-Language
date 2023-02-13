import React from 'react';
import { Box, Button, ButtonGroup, Divider, Drawer, } from '@mui/material';
import { editorThemes, UserConfiguration, editorFontSizes } from '../../App';
import './AppDrawer.css';

interface AppDrawerProps {
    userConfiguration:UserConfiguration;
}

function AppDrawer({ userConfiguration }:AppDrawerProps) {
    return (
        <Drawer className='drawer' anchor='right' open={userConfiguration.isDrawerOpen} 
            onClose={() => userConfiguration.closeDrawer(userConfiguration)}>
            <Box sx={{width: 250}} role='presentation' textAlign='center'>
                <h2>Editor Settings</h2>
                <Divider/>
                <div className='editor-settings-tile'>
                    <h3>Editor Theme</h3>
                    <ButtonGroup color='secondary' variant='contained' orientation='vertical' fullWidth>
                        {editorThemes.map((theme, i) => {
                            return <Button key={i}
                                className={userConfiguration.editorTheme === theme ? 'active-option' : undefined} 
                                onClick={() => userConfiguration.setEditorTheme(userConfiguration, theme)}>{theme}</Button>;
                        })}
                    </ButtonGroup>
                </div>
                <Divider/>
                <div className='editor-settings-tile'>
                    <h3>Editor Font Size</h3>
                    <ButtonGroup color='secondary' variant='contained' orientation='vertical' fullWidth>
                        {editorFontSizes.map((fontSize, i) => {
                            return <Button key={i}
                                className={userConfiguration.editorFontSize === fontSize ? 'active-option' : undefined} 
                                onClick={() => userConfiguration.setEditorFontSize(userConfiguration, fontSize)}>{fontSize.label}</Button>;                            
                        })}
                    </ButtonGroup>    
                </div>
                <Divider/>
                <div className='editor-settings-tile'>
                    <h3>Show Line Numbers</h3>
                    <ButtonGroup color='secondary' variant='contained' orientation='vertical' fullWidth>
                        {[true, false].map((value, i) => {
                            return <Button key={i}
                                className={userConfiguration.showEditorLineNumber === value ? 'active-option' : undefined} 
                                onClick={() => userConfiguration.setShowEditorLineNumber(userConfiguration, value)}>{value ? 'Show' : 'Hide'}</Button>;
                        })}
                    </ButtonGroup>
                </div>
                <Divider/>
                <div className='editor-settings-tile'>
                    <h3>Tape Transition Time (seconds)</h3>
                    <ButtonGroup color='secondary' variant='contained' orientation='vertical' fullWidth>
                        {[0.2, 0.5, 1].map((sec, i) => {
                            return <Button key={i} className={sec*1000 === userConfiguration.transitionTime ? 'active-option' : undefined}
                                onClick={() => userConfiguration.setTransitionTime(userConfiguration, sec*1000)}>{ sec }</Button>;
                        })}
                    </ButtonGroup>
                </div>
            </Box>
        </Drawer>
    );
}

export default AppDrawer;