// @flow
import React, { Component } from 'react';
import Indexer from '../components/Indexer';


export default class IndexTool extends Component {
  render() {
    return (
      <Indexer indexTitle={this.props.location.state}/>
    );
  }
}
