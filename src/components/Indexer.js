import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactDataSheet from 'react-datasheet';
import { CSVLink } from 'react-csv';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ToolBar from '@material-ui/core/Toolbar';
import Container from '@material-ui/core/Container';
import NavigationIcon from '@material-ui/icons/Navigation';
import LockIcon from '@material-ui/icons/Lock';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import Fab from '@material-ui/core/Fab';

import '../css/indextable.css';
import firebase, { auth } from '../firebase.js';
import { NEW_SITE_URL } from './DeprecationGuard';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  heading: {
    fontWeight: 700,
    color: '#222',
  },
});

class Indexer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      uid: null,
      grid: [
        [
          { readOnly: true, width: 25, value: '' },
          { value: 'Title', readOnly: true, width: 200 },
          { value: 'Description', readOnly: true },
          { value: 'Page', readOnly: true, width: 50 },
          { value: 'Book', readOnly: true, width: 50 },
        ],
      ],
    };
    this.scrollToBottom = this.scrollToBottom.bind(this);
    this.scrollToTop = this.scrollToTop.bind(this);
  }

  componentDidMount() {
    this.unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && this.props.indexTitle && this.props.indexTitle.indexId) {
        const uid = user.uid;
        this.setState({ user, uid });
        this.indexesRef = firebase
          .database()
          .ref('/users/' + uid + '/indexdata/' + this.props.indexTitle.indexId);
        this.indexesRef.on('value', (snapshot) => {
          const items = snapshot.val();
          const newState = [];
          for (let item in items) {
            if (items[item] && items[item].grid) {
              newState.push({
                grid: items[item].grid,
              });
            }
          }
          if (newState[0] && Array.isArray(newState[0].grid)) {
            const readOnlyGrid = newState[0].grid.map((row) =>
              Array.isArray(row)
                ? row.map((cell) => ({
                    ...(cell || { value: '' }),
                    readOnly: true,
                  }))
                : []
            );
            this.setState({ grid: readOnlyGrid });
          }
        });
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

  scrollToTop() {
    if (this.top) {
      this.top.scrollIntoView({ behavior: 'smooth' });
    }
  }

  scrollToBottom() {
    if (this.bottom) {
      this.bottom.scrollIntoView({ behavior: 'smooth' });
    }
  }

  buildCsvData() {
    const rows = [];
    for (let i = 1; i < this.state.grid.length; i++) {
      const row = this.state.grid[i];
      if (!row || row.length < 5) continue;
      rows.push({
        Title: row[1] && row[1].value != null ? String(row[1].value) : '',
        Description: row[2] && row[2].value != null ? String(row[2].value) : '',
        Page: row[3] && row[3].value != null ? String(row[3].value) : '',
        Book: row[4] && row[4].value != null ? String(row[4].value) : '',
      });
    }
    return rows;
  }

  render() {
    const { classes, indexTitle } = this.props;
    const indexName = indexTitle && indexTitle.indexName ? indexTitle.indexName : 'Legacy Index';
    const safeFilename = (indexName || 'voltaire-index').replace(/[^a-zA-Z0-9_-]+/g, '_') + '.csv';
    const csvData = this.buildCsvData();

    if (!indexTitle || !indexTitle.indexId) {
      return (
        <Container style={{ marginTop: '32px' }}>
          <Card className="red-border" style={{ padding: '24px', textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              No index selected.
            </Typography>
            <Link to="/Indexes" style={{ textDecoration: 'none' }}>
              <Button variant="contained" color="secondary">
                Return to Legacy Indexes
              </Button>
            </Link>
          </Card>
        </Container>
      );
    }

    return (
      <div className="tablebg">
        <p ref={(el) => { this.top = el; }}>&nbsp;</p>
        <Fab className="scrollUp" onClick={this.scrollToTop}>
          <NavigationIcon />
        </Fab>
        <Fab className="scrollDown" onClick={this.scrollToBottom}>
          <NavigationIcon />
        </Fab>

        <Container>
          <Card className="red-border" style={{ marginTop: '16px', zIndex: 0 }}>
            <ToolBar style={{ flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <LockIcon style={{ color: '#B11116' }} />
                <Typography className={classes.heading} variant="h6">
                  {indexName} (Read-Only)
                </Typography>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <Link to="/Indexes" style={{ textDecoration: 'none' }}>
                  <Button variant="outlined" style={{ textTransform: 'none' }}>
                    Back to Indexes
                  </Button>
                </Link>
                <CSVLink
                  data={csvData}
                  filename={safeFilename}
                  style={{ textDecoration: 'none' }}
                >
                  <Button
                    variant="contained"
                    color="secondary"
                    style={{ textTransform: 'none', fontWeight: 700 }}
                  >
                    Download CSV ({csvData.length} rows)
                  </Button>
                </CSVLink>
                <Link to="/BuildIndex" style={{ textDecoration: 'none' }}>
                  <Button variant="contained" color="primary" style={{ textTransform: 'none' }}>
                    Export DOCX / Build
                  </Button>
                </Link>
                <Button
                  variant="outlined"
                  href={NEW_SITE_URL}
                  endIcon={<OpenInNewIcon />}
                  style={{ textTransform: 'none' }}
                >
                  training.opensecurity.com
                </Button>
              </div>
            </ToolBar>
            <CardContent style={{ paddingTop: 0 }}>
              <Typography variant="body2" style={{ color: '#7f0000', fontWeight: 600 }}>
                Read-only recovery mode: adding, editing, and deleting rows are permanently disabled.
                Export your index as CSV or DOCX above and continue on training.opensecurity.com.
              </Typography>
            </CardContent>
          </Card>
        </Container>

        <center>
          <Container>
            <Card
              className="red-border"
              style={{ marginTop: '24px', marginBottom: '48px', zIndex: 0, backgroundColor: 'white' }}
            >
              <ReactDataSheet
                style={{ width: '100%', margin: 'auto', padding: '0px' }}
                data={this.state.grid}
                valueRenderer={(cell) =>
                  cell && cell.value != null
                    ? cell.value.toString().replace(/Voltaire\{LineBreak\} /g, '\n')
                    : ''
                }
              />
            </Card>
          </Container>
        </center>
        <p ref={(el) => { this.bottom = el; }}>&nbsp;</p>
      </div>
    );
  }
}

export default withStyles(styles)(Indexer);
