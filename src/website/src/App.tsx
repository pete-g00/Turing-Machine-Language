import React, { ReactElement } from 'react';
import { purple, green } from '@mui/material/colors';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Link as RouterLink, LinkProps as RouterLinkProps, Route, HashRouter as Router, Routes, Navigate } from 'react-router-dom';
import HomePage from './components/Homepage/Homepage';
import Documentation from './components/Documentation/Documentation';
import { LinkProps } from '@mui/material';
import PreciseErrorDocumentation from './components/PreciseErrorDocumentation/PreciseErrorDocumentation';
import ErrorDocumentation from './components/ErrorDocumentation/ErrorDocumentation';
import ExecutionDocumentation from './components/ExecutionDocumentation/ExecutionDocumentation';
import SpecificationDocumentation from './components/SpecificationDocumentation/SpecificationDocumentation';

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
            <Route path='/Turing-Machine-Language' element={<HomePage/>}></Route>
            <Route path='/Turing-Machine-Language/documentation' element={<Documentation/>}></Route>
            <Route path='/Turing-Machine-Language/documentation/errors/:label' element={<PreciseErrorDocumentation/>}></Route>
            <Route path='/Turing-Machine-Language/documentation/errors' element={<ErrorDocumentation/>}></Route>
            <Route path='/Turing-Machine-Language/documentation/execution' element={<ExecutionDocumentation/>}></Route>
            <Route path='/Turing-Machine-Language/documentation/specification' element={<SpecificationDocumentation/>}></Route>
            <Route path='*' element={<Navigate replace to='/Turing-Machine-Language'></Navigate>}></Route>
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;