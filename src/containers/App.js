import React, { Component } from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';

import Home from './Home';
import IndexTool from './IndexTool';
import ExportIndex from './ExportIndex';
import Main from './Main';
import Resources from './Resources';
import BuildIndex from './BuildIndex';
import Settings from './Settings';
import DownloadIndex from './DownloadIndex';
//import LoginPage from './LoginPage';

import { red } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';

// A custom theme for this app
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#B11116',

    },
    secondary: {
      main: '#FA6900',
      contrastText: '#FFF'
    },
    confirm:{
      main: '#FF8D00',
    },
    cancel:{
      main: '#eeeeee',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#FAFAFA',
    },
  },

});
console.log(theme)
export default class App extends Component {
  render() {
    return (
      <div>
        <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <BrowserRouter>

            <Switch>
              <Route exact path="/Indexes" component={Home}/>
              <Route exact path="/Resources" component={Resources}/>
              <Route exact path="/Settings" component={Settings}/>
              <Route exact path="/BuildIndex" component={BuildIndex}/>
              <Route exact path="/IndexTool" component={IndexTool}/>
              <Route exact path="/DownloadIndex" component={DownloadIndex}/>
              <Route exact path="/ExportIndex" component={ExportIndex}/>
              <Route exact path="/" component={Main}/>
            </Switch>
          </BrowserRouter>
        </ThemeProvider>
      </div>
    );
  }
}
