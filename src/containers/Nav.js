// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import firebase, { auth } from '../firebase.js';

//const {BrowserWindow} = window.require('electron').remote
//const BrowserWindow = ""

export default class Nav extends Component {
   constructor() {
     super();
     this.state = {
       indexList: [],
       indexExportData: [],
       grid: []
     }
     //this.closeWindow = this.closeWindow.bind(this);
   }
   componentDidMount() {
     auth.onAuthStateChanged((user) => {
       if (user) {
          this.setState({ user });
          this.setState({ uid: auth.getUid() });

          let table = '/users/' + auth.getUid() + '/indexes';
          const indexesRef = firebase.database().ref(table);
          indexesRef.on('value', (snapshot) => {
            let items = snapshot.val();
            let newState = [];
            for (let item in items) {
              newState.push({
                id: item,
                title: items[item].title,
                user: items[item].user
              });
            }
            this.setState({
              indexList: newState
            });
          });
       }
     });
   }
   exportIndex(id) {
      const indexesRef = firebase.database().ref('/users/' + this.state.uid + '/indexdata/' + id);
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
     this.buildIndex();
   }
   buildIndex() {
      const data = this.state.grid;
      let tmpList = [];

      //Build and Sort List
      for (let item in data) {
         tmpList.push({
            title: data[item][1],
            description: data[item][2],
            page: data[item][3],
            book: data[item][4]
         })
     }
     tmpList.sort(function(a, b){
         if(a.title.value < b.title.value) return -1;
         if(a.title.value > b.title.value) return 1;
         return 0;
      });
      this.setState({
       indexExportData: tmpList
      });
      console.log(tmpList);
   }
   //closeWindow() {
   //   var window = BrowserWindow.getFocusedWindow();
   //   window.close();
   //}


  render() {
    return (
      <div className="navbg">
         <div className="titlebanner">
            <Link className="navlogo" to="/">Voltaire</Link>
            {/*<button className="close-btn" onClick={this.closeWindow}>x</button>*/}
            <div className="dropdown">
              <button  className="exportbtn btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Export
              </button>
              <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                {this.state.indexList.map((item) => (
                   <Link key={item.id} to={{
                      pathname: "/ExportIndex",
                      state: {
                        indexTitle: item.title,
                        indexId: item.id,
                        uid: this.state.uid
                      }
                   }}><a onClick={() => this.exportIndex(item.id)}  className="dropdown-item" href="#">{item.title}</a></Link>
                ))}
              </div>
            </div>
         </div>
      </div>
    );
  }
}
