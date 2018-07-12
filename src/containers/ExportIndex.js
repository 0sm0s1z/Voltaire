import React, { Component } from 'react';
import firebase, { auth } from '../firebase.js';

class ExportIndex extends Component {
  constructor() {
    super();
    this.state = {
      indexName: '',
      grid: [],
      indexExportData: []
    }
    this.exportIndex = this.exportIndex.bind(this);
    this.buildIndex = this.buildIndex.bind(this);
  }
  componentDidMount() {
     var id = this.props.location.state.indexId;
     const indexesRef = firebase.database().ref('/users/' + this.props.location.state.uid + '/indexdata/' + id);
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
     this.buildIndex();
   });

  }
  nextChar(c) {
    return String.fromCharCode(c.charCodeAt(0) + 1);
  }
  exportIndex() {
     var id = this.props.location.state.indexId;
     const indexesRef = firebase.database().ref('/users/' + this.props.location.state.uid + '/indexdata/' + id);
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
      this.buildIndex();
    });
  }
  buildIndex() {
     const data = this.state.grid;
     let tmpList = [];
     let tmpList2 = [];

     //Build and Sort List
     for (let item in data) {
        tmpList.push({
           title: data[item][1],
           description: data[item][2],
           page: data[item][3],
           book: data[item][4]
        });
    }
    tmpList.sort(function(a, b){
        if(a.title.value < b.title.value) return -1;
        if(a.title.value > b.title.value) return 1;
        return 0;
     });

     //Add Index Reference
    let alphaPosition = 'a';
    let alphaPosition2 = 'b';

     for (let item in tmpList) {
        var curTitle = tmpList[item].title.value
        if (curTitle) {
           if (curTitle.startsWith(alphaPosition) || curTitle.startsWith(alphaPosition.toUpperCase())) {
              tmpList2.push({
                 title: {__html: "{{pagebreak}}<center><span class='dex-heading'>" + alphaPosition + alphaPosition.toUpperCase() + "</span></center>"},
                 description: "",
                 page: "",
                 book: ""
              });
              alphaPosition = this.nextChar(alphaPosition);
              alphaPosition2 = this.nextChar(alphaPosition2);
              tmpList2.push({
                 title: {__html: tmpList[item].title.value},
                 description: tmpList[item].description.value,
                 page: "[b" + tmpList[item].book.value + "/p" + tmpList[item].page.value +"]",
                 book: tmpList[item].book.value
              });
           } else if (curTitle.startsWith(alphaPosition2) || curTitle.startsWith(alphaPosition2.toUpperCase())) {
                tmpList2.push({
                   title: {__html: "<p style='page-break-before: always; page-break-after: auto'/><span class='dex-heading'>" + alphaPosition + alphaPosition.toUpperCase() + "</span>"},
                   description: "",
                   page: "",
                   book: ""
                });
                alphaPosition2 = this.nextChar(alphaPosition2);
                alphaPosition = alphaPosition2;
                tmpList2.push({
                   title: {__html: tmpList[item].title.value},
                   description: tmpList[item].description.value,
                   page: "[b" + tmpList[item].book.value + "/p" + tmpList[item].page.value +"]",
                   book: tmpList[item].book.value
                });
           } else {
              tmpList2.push({
                 title: {__html: tmpList[item].title.value},
                 description: tmpList[item].description.value,
                 page: "[b" + tmpList[item].book.value + "/p" + tmpList[item].page.value +"]",
                 book: tmpList[item].book.value
              });
           }
        }
    }
    this.setState({
      indexExportData: tmpList2
    });
  }
  render() {
    return (
      <div className='app'>
        <div className='container'>
          <div className="indexbox">
            <button onClick={this.exportIndex}>Build Index</button>
            <br />
            <br />
            <br />
            <center><span className="dex-heading">#</span></center>
            <br/>
            {this.state.indexExportData.map((item) => (
               <span className="dexter" key={item.id}>
                  <b><span className="topic" dangerouslySetInnerHTML={item.title} /></b>
                  <i>&nbsp;{item.page}</i>
                  <span className="content">&nbsp;{item.description}</span>
                  <br/>
               </span>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default ExportIndex;
