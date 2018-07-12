import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import Nav from './Nav';
import Home from './Home';
import IndexTool from './IndexTool';
import ExportIndex from './ExportIndex';
//import LoginPage from './LoginPage';

export default class App extends Component {
  render() {
    return (
      <div>
         <Nav />
         <Switch>
            <Route exact path="/" component={Home}/>
            <Route exact path="/IndexTool" component={IndexTool}/>
            <Route exact path="/ExportIndex" component={ExportIndex}/>
         </Switch>
      </div>
    );
  }
}
