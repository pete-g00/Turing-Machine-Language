import React, { useState } from 'react';
import { purple, green } from '@mui/material/colors';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { LinkProps } from '@mui/material';
import { Link as RouterLink, LinkProps as RouterLinkProps, Route, Routes, Navigate, HashRouter as Router } from 'react-router-dom';
import HomePage from './components/Homepage/Homepage';
import Documentation from './components/Documentation/Documentation';
import ErrorDocumentation from './components/ErrorDocumentation/ErrorDocumentation';
import PreciseErrorDocumentation from './components/PreciseErrorDocumentation/PreciseErrorDocumentation';
import AppDrawer from './components/AppDrawer/AppDrawer';
import TMDocumentation from './components/TMDocumentation/TMDocumentation';
import TMLDocumentation from './components/TMLDocumentation/TMLDocumentation';

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

export type EditorTheme = "cobalt" | "dawn" | "dracula" | "github" | "monokai" | "textmate";
export const editorThemes:EditorTheme[] = ["cobalt", "dawn", "dracula", "github", "monokai", "textmate"];

export class EditorFontSize {
  public readonly label;
  public readonly value;

  private constructor(label:string, value:number) {
    this.label = label;
    this.value = value;
  }

  public static SMALL:EditorFontSize = new EditorFontSize("Small", 12);
  public static NORMAL:EditorFontSize = new EditorFontSize("Normal", 14);
  public static LARGE:EditorFontSize = new EditorFontSize("Large", 16);

  public static parse(label:string):EditorFontSize|undefined {
    const fontSize = editorFontSizes.find((el) => {
      return el.label === label;
    });
    return fontSize;
  }
}

export const editorFontSizes:EditorFontSize[] = [EditorFontSize.LARGE, EditorFontSize.NORMAL, EditorFontSize.SMALL];

export type ExampleKey = "isDiv2" | "isDiv2Recursive" | "palindrome";

export interface UserConfiguration {
  editorTheme:EditorTheme;
  editorFontSize:EditorFontSize;
  isDrawerOpen:boolean;
  showEditorLineNumber:boolean;
  transitionTime:number;
  exampleKey:ExampleKey|undefined;
  setEditorTheme:(userConfiguration:UserConfiguration, theme:EditorTheme) => void;
  setEditorFontSize:(userConfiguration:UserConfiguration, fontSize:EditorFontSize) => void;
  setShowEditorLineNumber:(userConfiguration:UserConfiguration, showLineNumber:boolean) => void;
  setTransitionTime:(userConfiguration:UserConfiguration, transitionTime:number) => void;
  openDrawer:(userConfiguration:UserConfiguration) => void;
  closeDrawer:(userConfiguration:UserConfiguration) => void;
  setExampleKey:(userConfiguration:UserConfiguration, exampleKey:ExampleKey|undefined) => void;
}

function App() {
  const [userConfiguration, setUserConfiguration] = useState<UserConfiguration>({
    editorTheme: "dracula",
    editorFontSize: EditorFontSize.NORMAL,
    showEditorLineNumber: true,
    isDrawerOpen: false,
    transitionTime: 500,
    exampleKey: "isDiv2",
    setEditorTheme: (userConfiguration:UserConfiguration, theme:EditorTheme) => {
      setUserConfiguration({...userConfiguration, editorTheme: theme, isDrawerOpen: false});
    },
    setEditorFontSize: (userConfiguration:UserConfiguration, fontSize:EditorFontSize) => {
      setUserConfiguration({...userConfiguration, editorFontSize: fontSize, isDrawerOpen: false});
    },
    setShowEditorLineNumber:(userConfiguration:UserConfiguration, showLineNumber:boolean) => {
      setUserConfiguration({...userConfiguration, showEditorLineNumber: showLineNumber, isDrawerOpen: false});
    },
    openDrawer:(userConfiguration:UserConfiguration) => { 
      setUserConfiguration({...userConfiguration, isDrawerOpen: true});
    },
    closeDrawer:(userConfiguration:UserConfiguration) => {
      setUserConfiguration({...userConfiguration, isDrawerOpen: false});
    },
    setTransitionTime:(userConfiguration:UserConfiguration, transitionTime:number) => {
      setUserConfiguration({...userConfiguration, transitionTime, isDrawerOpen: false});
    },
    setExampleKey: (userConfiguration:UserConfiguration, exampleKey:ExampleKey|undefined) => {
      setUserConfiguration({...userConfiguration, exampleKey, isDrawerOpen: false});
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <div className="app">
        <Router>
        <AppDrawer userConfiguration={userConfiguration}/>
          <Routes>
            <Route path='/' element={<HomePage userConfiguration={userConfiguration}/>} />
            <Route path='/documentation' element={<Documentation userConfiguration={userConfiguration}/>} />
            <Route path='/documentation/errors/:label' element={<PreciseErrorDocumentation userConfiguration={userConfiguration}/>} />
            <Route path='/documentation/errors' element={<ErrorDocumentation userConfiguration={userConfiguration}/>} />
            <Route path='/documentation/turing-machine' element={<TMDocumentation userConfiguration={userConfiguration}/>} />
            <Route path='/documentation/turing-machine-language' element={<TMLDocumentation userConfiguration={userConfiguration}/>} />
            <Route path='*' element={<Navigate replace to='/'></Navigate>}></Route>
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;