import React, { ReactElement } from 'react';
import { purple, green } from '@mui/material/colors';
import Editor from './components/Editor';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AppToolbar from './components/Apptoolbar';
import { Grid } from '@mui/material';

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
      <div className="App">
        <AppToolbar></AppToolbar>
        <div>
          <Grid container>
            <Grid item xs={6}><Editor></Editor></Grid>
            <Grid item xs={6}></Grid>
          </Grid>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;