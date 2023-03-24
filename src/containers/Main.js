import React, { Component } from 'react';
import firebase, { auth } from '../firebase.js';
import Index from '../components/Index.js';

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
        <div className='container'>
          <Index />
        </div>
      </div>
    );
  }
}

export default Main;
