import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebase, { auth } from '../firebase.js';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { CSVLink } from "react-csv";

import OSBlack from "../assets/images/os-black-flat.png";

const styles = theme => ({
  root: {
    minWidth: 275,
  },
  heading: {
    fontWeight: '700',
    color: '#222222',
  },
});

class SettingsIndexes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      historyById: {},
      user: null,
      uid: null,
      headers: [
        { label: "Index #", key: "num" },
        { label: "Title", key: "title" },
        { label: "Description", key: "description" },
        { label: "Page", key: "page" },
        { label: "Book", key: "book" },
      ],
    };
    this.exportHistoryHandler = this.exportHistoryHandler.bind(this);
  }

  componentDidMount() {
    this.unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const uid = user.uid;
        this.setState({ user, uid });
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
          this.setState({ items: newState });
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

  exportHistoryHandler(itemId) {
    if (!this.state.uid) return;
    const itemRef = firebase.database().ref('/users/' + this.state.uid + '/history/' + itemId);
    itemRef.once('value', (snapshot) => {
      const items = snapshot.val();
      const rows = [];
      for (let key in items) {
        const entry = items[key];
        if (!entry) continue;
        rows.push({
          num: entry[0] && entry[0].value != null ? entry[0].value : '',
          title: entry[1] && entry[1].value != null ? entry[1].value : '',
          description: entry[2] && entry[2].value != null ? entry[2].value : '',
          page: entry[3] && entry[3].value != null ? entry[3].value : '',
          book: entry[4] && entry[4].value != null ? entry[4].value : '',
        });
      }
      this.setState((prev) => ({
        historyById: {
          ...prev.historyById,
          [itemId]: rows,
        },
      }));
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <Grid
        container
        spacing={3}
        direction="row"
        justify="flex-start"
        style={{
          backgroundImage: `url(${OSBlack})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: '35%',
          minHeight: '420px',
        }}
      >
        {this.state.items.map((item) => {
          const historyRows = this.state.historyById[item.id];
          return (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card style={{ marginTop: '24px', maxWidth: '100vw', borderTop: '3px solid #B11116' }}>
                <CardContent>
                  <Typography className={classes.heading} variant="h6" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Read-only mode: modification actions (blank row cleanup, sorting) are disabled.
                  </Typography>
                </CardContent>
                <CardActions style={{ flexWrap: 'wrap', gap: '8px' }}>
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
                    <Button size="small" color="primary" variant="outlined">
                      View / CSV
                    </Button>
                  </Link>
                  <Button
                    size="small"
                    color="secondary"
                    variant="contained"
                    onClick={() => this.exportHistoryHandler(item.id)}
                  >
                    Prepare History CSV
                  </Button>
                  {historyRows ? (
                    <CSVLink
                      data={historyRows}
                      headers={this.state.headers}
                      filename={`${item.title.replace(/[^a-zA-Z0-9_-]+/g, '_')}_history.csv`}
                      style={{ textDecoration: 'none', fontWeight: 700, color: '#B11116', padding: '4px 8px' }}
                    >
                      Download History ({historyRows.length} rows)
                    </CSVLink>
                  ) : null}
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    );
  }
}

export default withStyles(styles)(SettingsIndexes);
