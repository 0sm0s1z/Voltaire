import React, { Component } from 'react';
import firebase, { auth } from '../firebase.js';
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
          <Resources />
      </div>
    );
  }
}

export default Main;
