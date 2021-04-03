import React, { Component } from 'react';
import firebase, { auth } from '../firebase.js';

import Nav from './Nav';
import Resources from '../components/Resources';

class Main extends Component {
  constructor() {
    super();
    this.state = {
      indexName: '',
      grid: [],
      indexExportData: []
    }
  }

  render() {
    return (
      <div className='app'>
          <Nav />
          <Resources />
      </div>
    );
  }
}

export default Main;
