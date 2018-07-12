import React, { Component } from 'react';
import ReactDataSheet from 'react-datasheet';

import '../css/indextable.css';

import firebase from '../firebase.js';

export default class Indexer extends Component {
  constructor (props) {
     super(props)

     this.state = {
        newTitle: '',
        newDescription: '',
        newPage: '',
        newBook: '',
        grid2: [],
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
   }
   updateGrid(updatedGrid) {
      const indexRef = firebase.database().ref(this.props.indexTitle.indexId);
      indexRef.remove();
      const updateIndex = {
        grid: updatedGrid.grid
      }
      indexRef.push(updateIndex);
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
      this.updateGrid(tmpGrid);
   }

  render() {
    return (
      <div className="tablebg">
         <div className="container-indexer">
            <h1>{this.props.location.state}</h1>
            <div className="add-row">
               <form onSubmit={this.handleSubmit}>
                 <input className="add-row-title" type="text" name="newTitle" placeholder="Title" onChange={this.handleChange} value={this.state.newTitle} />
                 <button>Import Index</button>
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
