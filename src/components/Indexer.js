import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactDataSheet from 'react-datasheet';
import Modal from 'react-modal';
import clsx from 'clsx';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import Card from '@material-ui/core/Card';
import ToolBar from '@material-ui/core/Toolbar';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

import ListItemIcon from '@material-ui/core/ListItemIcon';
import SettingsIcon from '@material-ui/icons/Settings';
import NavigationIcon from '@material-ui/icons/Navigation';

import Fab from '@material-ui/core/Fab';

import '../css/indextable.css';

import firebase, { auth } from '../firebase.js';

Modal.setAppElement('#root');

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  buttonNew: {
    width: '100%',
    borderRadius: '4px',
    minWidth: '88px',
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
    numBox: {
      width: '500px'
    }
  },
});

class Indexer extends Component {
  constructor (props) {
     super(props)

     this.state = {
        newTitle: '',
        newDescription: '',
        newPage: '',
        newBook: '',
        indexImport: '',
        showModal: false,
        user: null,
        uid: null,
        as: 'table',
        columns: [
         { label: 'Title', width: '30%' },
         { label: 'Description', width: '20%' },
         { label: 'Color (SRM)', width: '20%' },
         { label: 'Rating', width: '20%' }
        ],
        grid: [
           [
             {readOnly: true, width: 25, value: ''},
             {value: 'Title', readOnly: true, width: 200},
             {value: 'Description', readOnly: true},
             {value: 'Page', readOnly: true, width: 50},
             {value: 'Book', readOnly: true, width: 50}
           ]
         ]
     }
     this.handleChange = this.handleChange.bind(this);
     this.handleSubmit = this.handleSubmit.bind(this);
     this.showImportDialog = this.showImportDialog.bind(this);
     this.handleImport = this.handleImport.bind(this);
     this.scrollToBottom = this.scrollToBottom.bind(this);
     this.scrollToTop = this.scrollToTop.bind(this);
   }
   componentDidMount() {
      auth.onAuthStateChanged((user) => {
       if (user) {
          this.setState({ user });
          this.setState({ uid: auth.getUid() });
          const indexesRef = firebase.database().ref('/users/' + this.state.uid + '/indexdata/' + this.props.indexTitle.indexId);
          indexesRef.on('value', (snapshot) => {
            let items = snapshot.val();
            let newState = [];
            for (let item in items) {
              newState.push({
                grid: items[item].grid
              });
            }
            this.setState({
              grid: newState[0].grid
            });
          });
       }
     });
   }
   updateGrid(updatedGrid) {
      const indexRef = firebase.database().ref('/users/' + this.state.uid + '/indexdata/' + this.props.indexTitle.indexId);
      indexRef.remove();
      const updateIndex = {
        grid: updatedGrid.grid
      }
      indexRef.push(updateIndex);
   }
   updateHistory(newRow) {
     //New feature triggered by handleSubmit (currently doesn't affect direct grid modifications)
     //This feature posts all index modifications to a parallel immutable history index that cannot be deleted
    const indexRef = firebase.database().ref('/users/' + this.state.uid + '/history/' + this.props.indexTitle.indexId);
    indexRef.push(newRow);
   }
   handleChange(e) {
     this.setState({
      [e.target.name]: e.target.value
     });
   }
   handleSubmit(e) {
      e.preventDefault();
      var gridold = this.state.grid
      var newRow = [{readOnly: true, value: gridold.length}, {value: this.state.newTitle}, {value: this.state.newDescription}, {value: this.state.newPage}, {value: this.state.newBook}]
      gridold.push(newRow)
      var tmpGrid = {grid: this.state.grid}
      this.setState(this.state.grid)
      this.setState({
         newTitle: '',
         newDescription: '',
         newPage: '',
         newBook: ''
      })
      this.updateHistory(newRow);
      this.updateGrid(tmpGrid);
   }
   handleImport(e) {
      e.preventDefault();
      let lines = this.state.indexImport.split('\n');
      var gridold = [];

      for (var i = 0;i<lines.length;i++) {
         let elements = lines[i].split(',');
         var newRow = [{readOnly: true, value: gridold.length}, {value: elements[0]}, {value: elements[1]}, {value: elements[2]}, {value: elements[3]}]
         gridold.push(newRow);
      }

      var tmpGrid = this.state.grid;
      Array.prototype.push.apply(tmpGrid,gridold);

      tmpGrid = {grid: this.state.grid}
      this.setState(this.state.grid)

      this.updateGrid(tmpGrid);
      this.setState({ showModal: false });
   }
   showImportDialog(e) {
      e.preventDefault();
      this.setState({ showModal: true });
   }
   scrollToTop() {
     this.top.scrollIntoView({behavior: "smooth"})
   }
   scrollToBottom() {
     this.bottom.scrollIntoView({behavior: "smooth"})
   }

  render() {
    const { classes } = this.props;
    return (
      <div className="tablebg">
      <p ref={(el) => {this.top = el;}}>&nbsp;</p>
      <Fab className="scrollUp" onClick={this.scrollToTop}>
        <NavigationIcon />
      </Fab>

      <Fab className="scrollDown" onClick={this.scrollToBottom}>
        <NavigationIcon />
      </Fab>
        <Container>
        <Card className="red-border" style={{marginTop:"95px",zIndex:"0"}}>
          <ToolBar>
            <Typography className={classes.heading} variant={'h6'} gutterBottom>
              <h3>{this.props.indexTitle.indexName}</h3>
            </Typography>
          </ToolBar>
          <form onSubmit={this.handleSubmit}>
            <Container>
            <Grid container direction="row" justify="space-around" alignItems="center" spacing={2}>
              <Grid item xs={6} s={8} md={8} lg={10} xl={10}>
                <TextField name="newTitle" onChange={this.handleChange} value={this.state.newTitle} variant="outlined" label="Row Title" style={{"width":"100%"}}/>
              </Grid>
              <Grid item xs={3} s={2} md={2} lg={1} xl={1}>
                <TextField name="newPage" onChange={this.handleChange} value={this.state.newPage} variant="outlined" label="Page" style={{"width":"100%"}}/>
              </Grid>
              <Grid item xs={3} s={2} md={2} lg={1} xl={1}>
                <TextField name="newBook" onChange={this.handleChange} value={this.state.newBook} variant="outlined" label="Book" style={{"width":"100%"}}/>
              </Grid>
              <br />
              <Grid item xs={8} s={9} md={10} lg={10} xl={10}>
                <TextField name="newDescription" onChange={this.handleChange} value={this.state.newDescription} variant="outlined" label="Description" style={{"width":"100%"}}/>
              </Grid>
              <Grid item xs={4} s={3} md={2} lg={2} xl={2}>
                <Button onClick={this.handleSubmit} variant="contained" color="primary" style={{"width":"100%", "height":"1.1875em", "padding": "27px"}}>Add Row</Button>
              </Grid>
            </Grid>
            </Container>
          </form>
          <br />
        </Card>
        </Container>
        <center>
        <Container>
        <Card className="red-border" style={{marginTop:"35px",zIndex:"0", backgroundColor:"white"}}>
         <ReactDataSheet style={{width:"100%",margin:"auto",padding:"0px"}}
            data={this.state.grid}
            valueRenderer={(cell) => cell.value}
            onCellsChanged={changes => {
              const grid = this.state.grid.map(row => [...row])
              changes.forEach(({cell, row, col, value}) => {
                grid[row][col] = {...grid[row][col], value}
              })
              this.setState({grid})
              this.updateGrid({grid})
            }}
          />
        </Card>
        </Container>
        </center>
        <p ref={(el) => {this.bottom = el;}}>&nbsp;</p>
      </div>



    );
  }
}
export default withStyles(styles)(Indexer);
