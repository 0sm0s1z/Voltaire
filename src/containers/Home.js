import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Nav from './Nav';
import Index from '../components/Index';
import '../App.css';
import firebase, { auth } from '../firebase.js';
import { NEW_SITE_URL, redirectToNewSite } from '../components/DeprecationGuard';

import { withStyles } from '@material-ui/core/styles';
import ToolBar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Grid from '@material-ui/core/Grid';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import LockIcon from '@material-ui/icons/Lock';

import GIACLogo from "../assets/images/giaclogo.jpeg";

const styles = theme => ({
  root: {
    minWidth: 275,
  },
  heading: {
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
});

class Home extends Component {
  constructor() {
    super();
    this.state = {
      items: [],
      user: null,
      uid: null,
      authChecked: false,
      loaded: false,
    };
    this.logout = this.logout.bind(this);
  }

  logout() {
    auth.signOut().then(() => {
      this.setState({ user: null, uid: null, items: [] });
      window.location.href = '/';
    });
  }

  componentDidMount() {
    this.unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const uid = user.uid;
        this.setState({ user, uid, authChecked: true });
        this.indexesRef = firebase.database().ref('/users/' + uid + '/indexes');
        this.indexesRef.on('value', (snapshot) => {
          const items = snapshot.val();
          const newState = [];
          for (let item in items) {
            newState.push({
              id: item,
              title: items[item] && items[item].title ? items[item].title : '(Untitled Index)',
              user: items[item] ? items[item].user : null,
            });
          }
          this.setState({
            items: newState,
            loaded: true,
          });
        });
      } else {
        this.setState({ user: null, uid: null, authChecked: true, loaded: true });
      }
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    if (this.indexesRef) {
      this.indexesRef.off();
    }
  }

  render() {
    const { classes } = this.props;

    if (this.state.authChecked && !this.state.user) {
      return <Index />;
    }

    return (
      <div>
        <Nav />

        {this.state.user ? (
          <section>
            <div className='user-profile'>
              <img alt='' src={this.state.user.photoURL} />
            </div>
          </section>
        ) : null}

        <Container>
          <Card className="red-border" style={{ marginTop: '24px', zIndex: 0 }}>
            <ToolBar style={{ flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <LockIcon style={{ color: '#B11116' }} />
                <Typography variant="h6" style={{ fontWeight: 700, color: '#7f0000' }}>
                  Legacy Data Recovery — Read-Only Mode
                </Typography>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  onClick={redirectToNewSite}
                  endIcon={<OpenInNewIcon />}
                  style={{ backgroundColor: '#FA6900', color: '#fff', fontWeight: 700, textTransform: 'none' }}
                >
                  Move to training.opensecurity.com
                </Button>
                <Button variant="outlined" onClick={this.logout} style={{ textTransform: 'none' }}>
                  Logout
                </Button>
              </div>
            </ToolBar>
            <CardContent style={{ paddingTop: 0 }}>
              <Typography variant="body1" style={{ color: '#333', marginBottom: '8px' }}>
                <strong>All write operations are permanently disabled.</strong> Creating new indexes,
                importing files, editing rows, renaming, and deleting are no longer available in Legacy Voltaire.
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Data older than 1 year has been permanently purged. You can view and export any remaining
                recent indexes below (use <strong>View (Read-Only)</strong> to download CSV, or{' '}
                <strong>Export / Build</strong> for DOCX/XLSX), then continue your work at{' '}
                <a href={NEW_SITE_URL} style={{ color: '#B11116', fontWeight: 700 }}>
                  training.opensecurity.com
                </a>
                .
              </Typography>
            </CardContent>
          </Card>
        </Container>

        {/* Read-Only Index Cards */}
        <Container>
          <div className='app' style={{ marginTop: '30px', marginBottom: '48px' }}>
            {this.state.loaded && this.state.items.length === 0 ? (
              <Card style={{ maxWidth: '720px', margin: '0 auto', padding: '24px', textAlign: 'center', borderTop: '4px solid #FA6900' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom style={{ fontWeight: 700 }}>
                    No Recent Legacy Indexes Found
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    This account has no legacy index data from the past year (all data older than 1 year has been purged).
                    Please continue your GIAC indexing on our new platform at training.opensecurity.com.
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={redirectToNewSite}
                    endIcon={<OpenInNewIcon />}
                    style={{ backgroundColor: '#FA6900', color: '#fff', fontWeight: 700, textTransform: 'none' }}
                  >
                    Go to training.opensecurity.com
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Grid container direction="row" justify="space-evenly" alignItems="center" spacing={2}>
                {this.state.items.map((item) => (
                  <div className="item-barrier" key={item.id}>
                    <Card className="red-border">
                      <section className='display-item'>
                        <div className="wrapper">
                          <ul>
                            <li>
                              <Typography className={classes.heading} variant={'h6'} gutterBottom>
                                <h3>{item.title ? item.title : '(No Index Name)'}</h3>
                              </Typography>

                              <div className="wrapper-body">
                                <center>
                                  <img width="100px" height="100px" src={GIACLogo} alt="Index" />
                                </center>
                                <CardActions>
                                  <Grid container direction="row" justify="space-evenly" alignItems="center" spacing={1}>
                                    <Grid item xs={6}>
                                      <Link
                                        style={{ textDecoration: 'none' }}
                                        to={{
                                          pathname: "/IndexTool",
                                          state: {
                                            indexId: item.id,
                                            indexName: item.title,
                                          },
                                        }}
                                      >
                                        <Button size="medium" style={{ width: "100%", textTransform: 'none' }} variant="contained" color="secondary">
                                          View / CSV
                                        </Button>
                                      </Link>
                                    </Grid>
                                    <Grid item xs={6}>
                                      <Link style={{ textDecoration: 'none' }} to="/BuildIndex">
                                        <Button size="medium" style={{ width: "100%", textTransform: 'none' }} variant="outlined" color="primary">
                                          Export DOCX
                                        </Button>
                                      </Link>
                                    </Grid>
                                  </Grid>
                                </CardActions>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </section>
                    </Card>
                  </div>
                ))}
              </Grid>
            )}
          </div>
        </Container>
      </div>
    );
  }
}

export default withStyles(styles)(Home);
