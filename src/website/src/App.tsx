import React, { ReactElement } from 'react';
import { purple, green } from '@mui/material/colors';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Link as RouterLink, LinkProps as RouterLinkProps, Route,   BrowserRouter as Router, Routes } from 'react-router-dom';
import HomePage from './components/Homepage/Homepage';
import Documentation from './components/Documentation/Documentation';
import { LinkProps } from '@mui/material';

const LinkBehavior = React.forwardRef<HTMLAnchorElement, Omit<RouterLinkProps, 'to'> & { href: RouterLinkProps['to'] }>((props, ref) => {
    const { href, ...other } = props;
    return <RouterLink ref={ref} to={href} {...other} />;
});

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
  components: {
    MuiLink: {
      defaultProps: {
        component: LinkBehavior,
      } as LinkProps,
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehavior,
      },
    },
  },
});

function App():ReactElement {
  return (
    <ThemeProvider theme={theme}>
      <div className="app">
        <Router>
          <Routes>
            <Route path='/' element={<HomePage/>}></Route>
            <Route path='/documentation' element={<Documentation/>}></Route>
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;