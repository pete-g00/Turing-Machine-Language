import React, { ReactElement } from 'react';
import { purple, green } from '@mui/material/colors';
import Editor from './components/Editor/Editor';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AppToolbar from './components/Apptoolbar/Apptoolbar';
import { Grid } from '@mui/material';
import TMPanel from './components/TMPanel/TMPanel';
import TMTape from "./components/TMTape/TMTape";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: purple[600],
    },
    secondary: {
      main: green[300]
    }
  },
});

function App():ReactElement {
  return (
    <ThemeProvider theme={theme}>
      <div className="app">
        <div className="toolbar">
          <AppToolbar></AppToolbar>
        </div>
        <Grid container className="code-section">
            <Grid item xs={12} md={6} className="editor"><Editor></Editor></Grid>
            <Grid item xs={12} md={6} className="tm">
              <div className="tm-panel"><TMPanel></TMPanel></div>
              <div className="tm-tape"><TMTape></TMTape></div>
            </Grid>
          </Grid>
      </div>
    </ThemeProvider>
  );
}


export default App;