import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { NEW_SITE_URL } from './DeprecationGuard';

const styles = theme => ({
  root: {
    minWidth: 275,
  },
});

class SettingsToolbar extends Component {
  render() {
    return (
      <div style={{ marginBottom: '16px', textAlign: 'center' }}>
        <Typography variant="h6" style={{ color: '#7f0000', fontWeight: 700 }} gutterBottom>
          Legacy Data Recovery &amp; History Export (Read-Only)
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          All write/edit/import operations are permanently disabled. Export your remaining data below or move to training.opensecurity.com.
        </Typography>
        <Grid container spacing={2} direction="row" justify="center">
          <Grid item>
            <Link to="/Indexes" style={{ textDecoration: 'none' }}>
              <Button variant="outlined" color="primary">
                My Indexes
              </Button>
            </Link>
          </Grid>
          <Grid item>
            <Link to="/BuildIndex" style={{ textDecoration: 'none' }}>
              <Button variant="contained" color="secondary">
                Export / Build Index
              </Button>
            </Link>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              href={NEW_SITE_URL}
              endIcon={<OpenInNewIcon />}
              style={{ backgroundColor: '#FA6900', color: '#fff', fontWeight: 700 }}
            >
              Go to training.opensecurity.com
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(SettingsToolbar);
