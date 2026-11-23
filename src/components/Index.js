import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import WarningIcon from '@material-ui/icons/Warning';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import LockIcon from '@material-ui/icons/Lock';

import IndexImg from "../assets/images/indexes.png";
import OSBlack from "../assets/images/os-black-flat.png";

import Home from '../containers/Home';
import {
  DeprecationBanner,
  DeprecationRiskModal,
  NEW_SITE_URL,
  redirectToNewSite,
  signInExistingUser,
} from './DeprecationGuard';

import '../css/indextable.css';
import { auth } from '../firebase.js';

const styles = theme => ({
  root: {
    minWidth: 275,
  },
  main: {
    marginTop: "32px",
    marginBottom: "48px",
  },
  primaryCta: {
    width: '100%',
    borderRadius: '6px',
    backgroundColor: '#FA6900',
    color: '#fff',
    fontSize: '15px',
    fontWeight: 700,
    padding: '12px 18px',
    textTransform: 'none',
    marginBottom: '12px',
    '&:hover': {
      backgroundColor: '#d75c04',
    },
  },
  newUserCta: {
    width: '100%',
    borderRadius: '6px',
    backgroundColor: '#B11116',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 600,
    padding: '10px 18px',
    textTransform: 'none',
    marginBottom: '12px',
    '&:hover': {
      backgroundColor: '#8d0d11',
    },
  },
  recoveryBtn: {
    width: '100%',
    borderRadius: '6px',
    borderColor: '#666',
    color: '#333',
    fontSize: '13px',
    fontWeight: 600,
    padding: '10px 16px',
    textTransform: 'none',
  },
});

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      uid: null,
      authChecked: false,
      showRiskModal: false,
      authError: '',
    };
    this.openRecoveryModal = this.openRecoveryModal.bind(this);
    this.closeRecoveryModal = this.closeRecoveryModal.bind(this);
    this.handleAcceptRiskAndLogin = this.handleAcceptRiskAndLogin.bind(this);
  }

  componentDidMount() {
    this.unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user, uid: user.uid, authChecked: true });
      } else {
        this.setState({ user: null, uid: null, authChecked: true });
      }
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  openRecoveryModal() {
    this.setState({ showRiskModal: true, authError: '' });
  }

  closeRecoveryModal() {
    this.setState({ showRiskModal: false });
  }

  async handleAcceptRiskAndLogin() {
    this.setState({ showRiskModal: false, authError: '' });
    try {
      const user = await signInExistingUser();
      if (user) {
        this.setState({ user, uid: user.uid });
      }
    } catch (error) {
      if (error && error.code === 'auth/popup-closed-by-user') {
        return;
      }
      this.setState({
        authError:
          'Unable to sign in. New account creation is permanently disabled — please use training.opensecurity.com.',
      });
    }
  }

  render() {
    const { classes } = this.props;

    if (this.state.user) {
      return <Home />;
    }

    return (
      <div>
        <DeprecationBanner />

        <DeprecationRiskModal
          open={this.state.showRiskModal}
          onClose={this.closeRecoveryModal}
          onAcceptRisk={this.handleAcceptRiskAndLogin}
          acceptLabel="Accept Risk & Sign In to Recover Data (Read-Only)"
        />

        <Container className={classes.main} maxWidth="lg">
          <Card
            style={{
              border: '3px solid #B11116',
              backgroundColor: '#fff5f5',
              marginBottom: '32px',
            }}
          >
            <CardContent style={{ padding: '24px 28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <WarningIcon style={{ color: '#B11116', fontSize: 36 }} />
                <Typography variant="h4" component="h1" style={{ color: '#7f0000', fontWeight: 800 }}>
                  Legacy Voltaire Has Been Permanently Retired
                </Typography>
              </div>
              <Typography variant="body1" style={{ color: '#222', fontSize: '16px', lineHeight: 1.6, marginBottom: '16px' }}>
                This legacy application is deprecated and no longer active. All indexing, course tools,
                and new user accounts have moved to{' '}
                <a
                  href={NEW_SITE_URL}
                  style={{ color: '#B11116', fontWeight: 700, textDecoration: 'underline' }}
                >
                  training.opensecurity.com
                </a>
                . Creating new accounts and adding or editing data on this legacy site are permanently disabled.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={redirectToNewSite}
                endIcon={<OpenInNewIcon />}
                style={{
                  backgroundColor: '#FA6900',
                  color: '#ffffff',
                  fontWeight: 700,
                  textTransform: 'none',
                  fontSize: '16px',
                  padding: '12px 28px',
                }}
              >
                Go to training.opensecurity.com
              </Button>
            </CardContent>
          </Card>

          <Grid
            container
            spacing={4}
            direction="row"
            justify="center"
            alignItems="center"
            style={{
              backgroundImage: `url(${OSBlack})`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundSize: '30%',
            }}
          >
            <Grid item xs={12} md={6} style={{ textAlign: 'center' }}>
              <img
                style={{ maxWidth: '100%', width: '460px', opacity: 0.85 }}
                src={IndexImg}
                alt="Voltaire Legacy Indexing"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Card style={{ borderTop: '4px solid #B11116', boxShadow: '0 6px 24px rgba(0,0,0,0.12)' }}>
                <CardContent style={{ padding: '28px' }}>
                  <Typography gutterBottom variant="h5" component="h2" style={{ fontWeight: 700 }}>
                    Move to training.opensecurity.com
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    Looking to create an account or build a new GIAC exam index? Use our active platform instead:
                  </Typography>

                  <Button
                    variant="contained"
                    className={classes.primaryCta}
                    onClick={redirectToNewSite}
                    endIcon={<OpenInNewIcon />}
                  >
                    Go to training.opensecurity.com (Recommended)
                  </Button>

                  <Button
                    variant="contained"
                    className={classes.newUserCta}
                    onClick={redirectToNewSite}
                    endIcon={<OpenInNewIcon />}
                  >
                    New User / Create Account → Redirect to New Site
                  </Button>

                  <Divider style={{ margin: '20px 0' }} />

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <LockIcon fontSize="small" style={{ color: '#7f0000' }} />
                    <Typography variant="subtitle2" style={{ fontWeight: 700, color: '#7f0000' }}>
                      Existing Users Only — Read-Only Data Recovery
                    </Typography>
                  </div>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    If you already have a legacy account from within the past year and need to export
                    your existing index, you may sign in strictly in <strong>read-only mode</strong>.
                    New accounts are blocked and automatically redirected to training.opensecurity.com.
                  </Typography>

                  {this.state.authError ? (
                    <Typography variant="body2" style={{ color: '#B11116', fontWeight: 600, marginBottom: '12px' }}>
                      {this.state.authError}
                    </Typography>
                  ) : null}

                  <Button
                    variant="outlined"
                    className={classes.recoveryBtn}
                    onClick={this.openRecoveryModal}
                  >
                    Existing Users: Sign In to Recover Data (Read-Only)
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </div>
    );
  }
}

export default withStyles(styles)(Index);
