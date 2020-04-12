import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactDataSheet from 'react-datasheet';
import Modal from 'react-modal';
import clsx from 'clsx';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import ListItemIcon from '@material-ui/core/ListItemIcon';
import SettingsIcon from '@material-ui/icons/Settings';

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

  render() {
    const { classes } = this.props;
    return (
      <div className="tablebg">
         <Modal
           isOpen={this.state.showModal}
           contentLabel="Paste Raw CSV Data"
           className="Modal"
           overlayClassName="Overlay"
         >
            <form onSubmit={this.handleImport}>
               <textarea name="indexImport" onChange={this.handleChange} className="form-control" rows="10" placeholder="Paste Raw CSV Data Here"/>
               <button>Import</button>
            </form>
         </Modal>
         <div className="container-indexer">
            <h1>{this.props.indexTitle.indexName}</h1>
            <div className="add-row">
               <form onSubmit={this.handleSubmit}>
                 <input className="add-row-title" type="text" name="newTitle" placeholder="Title" onChange={this.handleChange} value={this.state.newTitle} />
                 <input className={classes.numBox} type="text" name="newPage" placeholder="Page" onChange={this.handleChange} value={this.state.newPage} />
                 <input className={classes.numBox} type="text" name="newBook" placeholder="Book" onChange={this.handleChange} value={this.state.newBook} />
                 <input className="add-row-description" type="text" name="newDescription" placeholder="Description" onChange={this.handleChange} value={this.state.newDescription} />
                 <Button type="submit" className={classes.buttonNew} onClick={this.handleSubmit}>Add Row</Button>
                 <Link to="/Settings">
                  <Button className={classes.buttonConfig}><SettingsIcon /></Button>
                 </Link>
               </form>
            </div>
         </div>

         <ReactDataSheet
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
      </div>
    );
  }
}
export default withStyles(styles)(Indexer);
