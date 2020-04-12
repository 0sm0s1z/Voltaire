import React, { Component } from 'react';

import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  root: {
    minWidth: 275,
  },
});

class SettingsToolbar extends Component {
  constructor (props) {
     super(props)
   }


  render() {
    const { classes } = this.props;
    return (
      <div>
        <Grid container
        direction="row"
        justify="center"
        >
          <Typography variant="body2" color="textSecondary" component="p">
            Settings Toolbar
          </Typography>
        </Grid>
        <Grid container
        spacing={1}
        direction="row"
        justify="center"
        style={{marginTop: '10px'}}
        >
          <Grid item xs={2}>
            <Button variant="contained" color="primary">
                Import
            </Button>
          </Grid>
          <Grid item xs={2}>
            <Button variant="contained" color="primary">
              Export
            </Button>
          </Grid>
          <Grid item xs={2}>
            <Button variant="contained" color="primary">
              Build Index
            </Button>
          </Grid>
          <Grid item xs={2}>
            <Button variant="contained" color="primary">
              Templates
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}
export default withStyles(styles)(SettingsToolbar);
