import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import WarningIcon from '@material-ui/icons/Warning';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { auth, provider } from '../firebase.js';

export const NEW_SITE_URL = 'https://training.opensecurity.com';
const SESSION_KEY = 'voltaire_deprecation_risk_accepted_v1';

export function redirectToNewSite() {
  window.location.replace(NEW_SITE_URL);
}

export function hasAcceptedRisk() {
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === '1';
  } catch (e) {
    return false;
  }
}

export function markRiskAccepted() {
  try {
    window.sessionStorage.setItem(SESSION_KEY, '1');
  } catch (e) {
    // ignore storage errors
  }
}

export function isNewUserBlockedError(error) {
  if (!error) return false;
  const code = String(error.code || '').toLowerCase();
  const message = String(error.message || '');
  return (
    code === 'auth/admin-restricted-operation' ||
    code === 'auth/operation-not-allowed' ||
    /ADMIN_ONLY_OPERATION|OPERATION_NOT_ALLOWED|SIGNUP_DISABLED|disabledUserSignup/i.test(message)
  );
}

/**
 * Signs in an EXISTING user via Google OAuth.
 * New user creation is disabled at the Firebase Auth backend; if a non-existing
 * user attempts to sign in, Firebase rejects the operation and we immediately
 * redirect them to training.opensecurity.com.
 */
export async function signInExistingUser() {
  try {
    const result = await auth.signInWithPopup(provider);
    if (result && result.additionalUserInfo && result.additionalUserInfo.isNewUser) {
      await auth.signOut();
      redirectToNewSite();
      return null;
    }
    markRiskAccepted();
    return result ? result.user : null;
  } catch (error) {
    if (isNewUserBlockedError(error)) {
      redirectToNewSite();
      return null;
    }
    throw error;
  }
}

export function DeprecationBanner() {
  return (
    <div
      style={{
        backgroundColor: '#7f0000',
        color: '#ffffff',
        padding: '10px 16px',
        borderBottom: '3px solid #FA6900',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        textAlign: 'center',
        zIndex: 1300,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', maxWidth: '860px' }}>
        <WarningIcon style={{ color: '#ffcc00', flexShrink: 0 }} />
        <Typography variant="body2" style={{ color: '#ffffff', fontWeight: 600 }}>
          DEPRECATED SITE — READ-ONLY RECOVERY MODE: Legacy Voltaire no longer exists and has moved to{' '}
          <a
            href={NEW_SITE_URL}
            style={{ color: '#ffcc00', textDecoration: 'underline', fontWeight: 700 }}
          >
            training.opensecurity.com
          </a>
          . New accounts and all edits/writes are permanently disabled. Data older than 1 year has been purged.
        </Typography>
      </div>
      <Button
        variant="contained"
        size="small"
        href={NEW_SITE_URL}
        endIcon={<OpenInNewIcon />}
        style={{
          backgroundColor: '#FA6900',
          color: '#ffffff',
          fontWeight: 700,
          textTransform: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        Go to training.opensecurity.com
      </Button>
    </div>
  );
}

export function DeprecationRiskModal({ open, onAcceptRisk, onClose, title, acceptLabel }) {
  return (
    <Dialog
      open={open}
      onClose={onClose || (() => {})}
      disableBackdropClick
      disableEscapeKeyDown
      maxWidth="sm"
      fullWidth
      aria-labelledby="deprecation-dialog-title"
    >
      <DialogTitle
        id="deprecation-dialog-title"
        style={{ backgroundColor: '#B11116', color: '#ffffff' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <WarningIcon style={{ color: '#ffcc00' }} />
          <span>{title || 'This Site No Longer Exists — Legacy Voltaire Deprecated'}</span>
        </div>
      </DialogTitle>
      <DialogContent style={{ paddingTop: '20px' }}>
        <DialogContentText style={{ color: '#222222', fontSize: '15px', lineHeight: 1.6 }}>
          <strong>Legacy Voltaire has been permanently retired.</strong> All active indexing and
          training tools now live at{' '}
          <a
            href={NEW_SITE_URL}
            style={{ color: '#B11116', fontWeight: 700, textDecoration: 'underline' }}
          >
            training.opensecurity.com
          </a>
          .
        </DialogContentText>
        <DialogContentText style={{ color: '#444444', fontSize: '14px', lineHeight: 1.6 }}>
          • <strong>New user accounts are disabled.</strong> New users will be redirected straight to{' '}
          <strong>training.opensecurity.com</strong>.<br />
          • <strong>All write operations are permanently disabled.</strong> You cannot create, edit,
          import, rename, or delete indexes here.<br />
          • <strong>Data older than 1 year has been permanently deleted.</strong> Only existing
          accounts with recent data may sign in to view and export/recover their indexes.
        </DialogContentText>
        <DialogContentText style={{ color: '#7f0000', fontWeight: 600, fontSize: '14px', marginBottom: 0 }}>
          Would you like to redirect to training.opensecurity.com now, or accept the risk and
          continue strictly in read-only mode to recover your existing data?
        </DialogContentText>
      </DialogContent>
      <DialogActions style={{ padding: '16px 24px', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <Button
          onClick={onAcceptRisk}
          variant="outlined"
          style={{ color: '#555555', borderColor: '#999999', textTransform: 'none' }}
        >
          {acceptLabel || 'Accept Risk & Continue (Read-Only Recovery)'}
        </Button>
        <Button
          onClick={redirectToNewSite}
          variant="contained"
          endIcon={<OpenInNewIcon />}
          style={{
            backgroundColor: '#FA6900',
            color: '#ffffff',
            fontWeight: 700,
            textTransform: 'none',
          }}
          autoFocus
        >
          Yes, Redirect to training.opensecurity.com
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/**
 * Intercepts already-authenticated users arriving on any route with a persisted
 * Firebase session and prompts them to redirect or explicitly accept risk for
 * read-only recovery in this session.
 */
export class SessionDeprecationGate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
    };
    this.handleAccept = this.handleAccept.bind(this);
  }

  componentDidMount() {
    this.unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && !hasAcceptedRisk()) {
        this.setState({ showModal: true });
      } else {
        this.setState({ showModal: false });
      }
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  handleAccept() {
    markRiskAccepted();
    this.setState({ showModal: false });
  }

  render() {
    return (
      <DeprecationRiskModal
        open={this.state.showModal}
        onAcceptRisk={this.handleAccept}
      />
    );
  }
}
