import React, { Component } from 'react';
import { Link } from 'react-router-dom';

//import logo from '../logo.svg';
import '../App.css';
import firebase, { auth, provider } from '../firebase.js';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

import Modal from 'react-modal';

import readXlsxFile from 'read-excel-file';
import {OutTable, ExcelRenderer} from 'react-excel-renderer';

const styles = theme => ({
  root: {
    minWidth: 275,
  },
  button: {
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
  modBtn: {
    borderRadius: '4px',
    minWidth: '88px',
    marginRight: '20px',
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
  hideBtn: {
    width: '0.1px',
    height: '0.1px',
    opacity: 0,
    overflow: 'hidden',
    position: 'absolute',
    zIndex: '-1',
  },
  upBtn: {
    borderRadius: '4px',
    minWidth: '88px',
    margin: '10px',
    backgroundColor: '#FA6900',
    cursor: 'pointer',
    border: '0',
    color: '#fff',
    fontSize: '14px',
    boxShadow: '0 2px 5px 0 rgba(0,0,0,.26)',
    padding: '15px 50px',
    '&:hover': {
      backgroundColor: '#d75c04'
    },
  },
  buttonImport: {
    borderRadius: '4px',
    marginRight: '51px',
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
    }
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
    heading: {
      fontWeight: '900',
      color: '#ffffff',
      letterSpacing: 0.5,
    }
  },
  modText: {
    margin: "30px",
  }
});


class App extends Component {
  constructor() {
    super();
    this.state = {
      indexName: '',
      files: [],
      deleteId: "",
      deleteModal: false,
      showModal: false,
      items: [],
      grid: [],
      user: null,
      uid: null,
      upload: '',
    }
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fileHandler = this.fileHandler.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.toggleDelete = this.toggleDelete.bind(this);
    this.deletePending = this.deletePending.bind(this);
  }
  logout() {
     auth.signOut()
      .then(() => {
        this.setState({
          user: null
        });
      });
  }
  login() {
    auth.signInWithRedirect(provider)
      .then((result) => {
        const user = result.user;
        this.setState({
          user
        });
      });
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  handleSubmit(e) {
    e.preventDefault();
    const indexesRef = firebase.database().ref('/users/' + this.state.uid + '/indexes');
    const item = {
      title: this.state.indexName
    }
    indexesRef.push(item);
    this.setState({
      indexName: ''
    });
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
             items: newState
           });
         });

      }
    });
  }
  removeItem() {
    const itemRef = firebase.database().ref('/users/' + this.state.uid + '/indexes/' + this.state.deleteId);
    itemRef.remove();
    this.toggleDelete();
  }
  fileHandler = (event) => {
    let fileObj = event.target.files[0];

    //just pass the fileObj as parameter
    ExcelRenderer(fileObj, (err, resp) => {
      if(err){
        console.log(err);
      }
      else {
        this.setState({
          cols: resp.cols,
          rows: resp.rows
        });

        //Create New Index
        const indexesRef = firebase.database().ref('/users/' + this.state.uid + '/indexes');
        const item = {
          title: this.state.indexName
        }
        let ret = indexesRef.push(item);
        const indexId = ret.path.o[3];
        console.log(ret.path.o)
        this.setState({
          indexName: ''
        });

        //Load Spreadsheet into index
        //Build new grid
        var gridold = [
          [
            {value: "", readOnly: true, width: 25},
            {value: "Title", readOnly: true, width: 200},
            {value: "Description", readOnly: true},
            {value: "Page", readOnly: true, width: 50},
            {value: "Book", readOnly: true, width: 50},
          ],
        ];

        for (var i = 1;i<resp.rows.length;i++) {

           var newRow = [{readOnly: true, value: gridold.length}, {value: resp.rows[i][0]}, {value: resp.rows[i][1]}, {value: resp.rows[i][2]}, {value: resp.rows[i][3]}]

           if (!newRow[1].value) newRow[1].value = '';
           if (!newRow[2].value) newRow[2].value = '';
           if (!newRow[3].value) newRow[3].value = '';
           if (!newRow[4].value) newRow[4].value = '';

           gridold.push(newRow);
        }

        let tmpGrid = {grid: gridold}
        const indexRef = firebase.database().ref('/users/' + this.state.uid + '/indexdata/' + indexId);
        indexRef.push(tmpGrid);
      }
    });

    //Close modal
    this.toggleModal();
  }
  importIndex() {
    console.log("tmp");
  }
  toggleModal() {
    const indexesRef = firebase.database().ref('/users/' + this.state.uid + '/indexdata/' + "-M4X7t1IatLuCWTiNm4P");
    indexesRef.on('value', (snapshot) => {
    let items = snapshot.val();
      let newState = [];
      for (let item in items) {
          newState.push({
           grid: items[item].grid,
          });
      }
      console.log(newState[0].grid)
    });

    this.setState({
      showModal: !this.state.showModal
    });
  }
  importFile(files){
    this.setState({
      files: files
    });
  }
  deletePending(indexId) {
    this.setState({
      deleteId: indexId,
    });
    this.toggleDelete();
  }
  toggleDelete() {
    this.setState({
      deleteModal: !this.state.deleteModal
    });
  }
  render() {
    const { classes } = this.props;
    return (
      <Container>
        <Modal
          isOpen={this.state.showModal}
          contentLabel="Paste Raw CSV Data"
          className="Modal"
          overlayClassName="Overlay"
        >
          <input type="text" name="indexName" placeholder="Index Title" onChange={this.handleChange} value={this.state.indexName} />

          <br />

          <input type="file" name="file" id="file" onChange={this.fileHandler} className={classes.hideBtn} />
          <label for="file" className={classes.upBtn}>Upload Spreadsheet</label>

          <br /><br /><br />

          <Button className={classes.modBtn} onClick={this.importIndex}>Import</Button>
          <Button className={classes.modBtn} onClick={this.toggleModal}>Cancel</Button>
        </Modal>
        <Modal
          isOpen={this.state.deleteModal}
          contentLabel="Paste Raw CSV Data"
          className="Modal"
          overlayClassName="Overlay"
        >
          <br />
          <Typography className={classes.modText} align="center" variant="h6">
            Are you sure you want to delete this index?
          </Typography>
          <Button className={classes.modBtn} onClick={this.toggleDelete}>Cancel</Button>
          <Button className={classes.modBtn} onClick={this.removeItem}>Delete</Button>
        </Modal>
      <div className='app'>
        <div className='tool-container'>
          <section className='add-item'>
          {this.state.user ?
            <div>
                <form onSubmit={this.handleSubmit}>
                  <input type="text" name="indexName" placeholder="Index Title" onChange={this.handleChange} value={this.state.indexName} />
                  <Button className={classes.buttonNew} onClick={this.handleSubmit}>Create New Index</Button>
                </form>
                <br />

                   <div className='user-profile'>
                     <img alt="" src={this.state.user.photoURL} />
                   </div>
                   <Button className={classes.buttonImport} onClick={this.toggleModal}>Import</Button>
                   <Button className={classes.button} onClick={this.logout}>Log Out</Button>
                  </div>
                   :
                     <Button variant="contained" className={classes.button} onClick={this.login}>Log In</Button>
                 }
          </section>

            {this.state.items.map((item) => {
              return (
                 <section key={item.id} className='display-item'>
                  <div className="wrapper">
                     <ul>
                     <li>
                        <Typography className={classes.heading} variant={'h6'} gutterBottom>
                          <h3>{item.title}</h3>
                        </Typography>
                        <br />
                        <center>
                           <img alt="img" src="https://acclaim-production-app.s3.amazonaws.com/images/6ce47e59-60ab-44fe-9590-15f88b3a2bd2/large_giac.png" />
                        </center>
                        <p>
                          <Link to={{
                             pathname: "/IndexTool",
                             state: {
                                indexId: item.id,
                                indexName: item.title
                             }
                          }}><Button className={classes.button}>Edit</Button></Link>
                          <Button className={classes.button} onClick={() => this.deletePending(item.id)}>Delete</Button>
                        </p>
                     </li>
                     </ul>
                  </div>
               </section>
              )
            })}

        </div>
      </div>
      </Container>
    );
  }
}
export default withStyles(styles)(App);
