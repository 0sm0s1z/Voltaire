// @flow
import React, { Component } from 'react';
import Indexer from '../components/Indexer';

import Nav from './Nav';

export default class IndexTool extends Component {
  render() {
    return (
      <div>
        <Nav />
        <Indexer indexTitle={this.props.location.state}/>
      </div>
    );
  }
}
