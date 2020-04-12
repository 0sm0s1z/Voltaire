import React, { Component } from 'react';
import firebase, { auth } from '../firebase.js';

import SettingsToolbar from '../components/SettingsToolbar';
import SettingsIndexes from '../components/SettingsIndexes';

import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';



const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  main: {
    marginTop: "90px",
  },
  buttonNew: {
    width: '100%',
    borderRadius: '4px',
    backgroundColor: '#FA6900',
    cursor: 'pointer',
    border: '0',
    minWidth: '120px',
    color: '#fff',
    fontSize: '14px',
    boxShadow: '0 2px 5px 0 rgba(0,0,0,.26)',
    padding: '10px 6px',
    '&:hover': {
      backgroundColor: '#d75c04'
    },
  },
  buttonConfig: {
    width: '100%',
    borderRadius: '4px',
    backgroundColor: '#FA6900',
    cursor: 'pointer',
    border: '0',
    minWidth: '50px',
    color: '#fff',
    fontSize: '14px',
    boxShadow: '0 2px 5px 0 rgba(0,0,0,.26)',
    padding: '10px 6px',
    '&:hover': {
      backgroundColor: '#d75c04'
    },
  },
});

class Settings extends Component {
  constructor() {
    super();
    this.state = {
      indexName: '',
      grid: [],
      indexExportData: []
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <Container className={classes.main}>
        <SettingsToolbar />
        <SettingsIndexes />
      </Container>
    );
  }
}

export default withStyles(styles)(Settings);
