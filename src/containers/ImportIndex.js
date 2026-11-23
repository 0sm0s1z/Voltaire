import React, { Component } from 'react';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { DeprecationBanner, NEW_SITE_URL } from '../components/DeprecationGuard';

export default class ImportIndex extends Component {
  render() {
    return (
      <div>
        <DeprecationBanner />
        <Container maxWidth="sm" style={{ marginTop: '48px' }}>
          <Card style={{ borderTop: '4px solid #B11116', padding: '16px', textAlign: 'center' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom style={{ fontWeight: 700, color: '#7f0000' }}>
                Importing Is Permanently Disabled
              </Typography>
              <Typography variant="body1" color="textSecondary" paragraph>
                Legacy Voltaire is deprecated and read-only. Please import and build your indexes on{' '}
                <strong>training.opensecurity.com</strong>.
              </Typography>
              <Button
                variant="contained"
                href={NEW_SITE_URL}
                endIcon={<OpenInNewIcon />}
                style={{ backgroundColor: '#FA6900', color: '#fff', fontWeight: 700, textTransform: 'none' }}
              >
                Go to training.opensecurity.com
              </Button>
            </CardContent>
          </Card>
        </Container>
      </div>
    );
  }
}
