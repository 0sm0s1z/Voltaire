import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Nav from './Nav';

//import logo from '../logo.svg';
import '../App.css';
import firebase, { auth, provider } from '../firebase.js';

import { withStyles } from '@material-ui/core/styles';
import ToolBar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField'
import Box from '@material-ui/core/Box'
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit'
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';

import GIACLogo from "../assets/images/giaclogo.jpeg";

import Modal from 'react-modal';
import readXlsxFile from 'read-excel-file';
import {OutTable, ExcelRenderer} from 'react-excel-renderer';
import BuildIcon from "@material-ui/icons/Build";
import clsx from "clsx";

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
  },
  formControlWide:{
    margin: theme.spacing(0),
  },
  truncate:{
    overflow: 'hidden',
    maxWidth: '100%',

  },
  truncateText:{
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    maxWidth: '100%',
    textOverflow: 'clip',
  },
  editIcon: {
    color: "#fff",
    border:"2px solid rgba(255,255,255,0.2)",
    borderRadius: "4px",
    display:"inline-block",
    float:"right",
    height:"32px",
    padding:"1px",
    marginTop:"2px",
  },
});


class App extends Component {
  constructor() {
    super();
    this.state = {
      indexName: '',
      files: [],
      deleteId: "",
      deleteModal: false,
      changeIndexNameModal: false,
      showModal: false,
      items: [],
      grid: [],
      user: null,
      uid: null,
      upload: '',

      changeIndexName: '',
      changeIndexId: '',
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
    this.showChangeIndexName = this.showChangeIndexName.bind(this);
    this.hideChangeIndexName = this.hideChangeIndexName.bind(this);
    this.doChangeIndexName = this.doChangeIndexName.bind(this);
  }
  logout() {
     auth.signOut()
      .then(() => {
        this.setState({
          user: null
        });
      });
      window.location.reload();
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


  doChangeIndexName() {
const indexRef = firebase.database().ref('/users/' + this.state.uid + '/indexes/' + this.state.changeIndexID);
    indexRef.update({title: this.state.changeIndexName})
    this.setState({changeIndexName: ""})
    this.setState({changeIndexID: ""})
    this.setState({changeIndexNameModal: false})

  }
  showChangeIndexName(indexID) {
    this.setState({changeIndexID: indexID})
    this.setState({changeIndexNameModal: true})
  }
  hideChangeIndexName() {
    this.setState({changeIndexID: ""})
    this.setState({changeIndexNameModal: false})
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
        const indexId = ret.path.pieces_[3];
        console.log(ret.path, "Issue Import Broken#23");
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
      <div>
      <Nav />



      <Modal

        isOpen={this.state.showModal}
        contentLabel="Paste Raw CSV Data"
        className="Modal"
        overlayClassName="Overlay"
      >

      <Card className={classes.root} style={{padding:"10px"}}>
        <CardContent>
          <Typography className={classes.title} color="textSecondary" gutterBottom>
            Import an Index
          </Typography>

            <Grid direction="column" justify="center" alignItems="center" spacing={1}>
              <Grid item xs>
                <TextField name="indexName" onChange={this.handleChange} value={this.state.indexName} variant="outlined" label="Index Name" style={{"width":"100%"}}/>
              </Grid>

              <Grid item xs>
                  <input type="file" name="file" id="file" onChange={this.fileHandler} className={classes.hideBtn} />
                  <Button style={{width:"100%"}} variant="outlined" color="secondary"><label for="file">Upload Spreadsheet</label></Button>
              </Grid>
              </Grid>

        </CardContent>
        <br />
        <CardActions>
            <Button size="large" variant="contained" color="secondary" onClick={this.importIndex}>Import</Button>
            <Button size="large" variant="outlined" color="cancel" onClick={this.toggleModal}>Cancel</Button>
        </CardActions>
      </Card>


  </Modal>
  {this.state.user ?
    <section>
    <div className='user-profile'>
      <img alt='' src={this.state.user.photoURL} />
    </div>
    </section>
    : ""
  }


      <Modal
        isOpen={this.state.deleteModal}
        contentLabel="Paste Raw CSV Data"
        className="Modal"
        overlayClassName="Overlay"
      >

        <Card className={classes.root}>
          <CardContent>
            <Typography className={classes.title} color="textSecondary" gutterBottom>
              Index Deletion
            </Typography>
            <Typography className={classes.modText} align="center" variant="h6">
              Are you sure you want to delete this index?
            </Typography>

          </CardContent>
          <CardActions style={{margin:"right"}}>
              <Button  onClick={this.removeItem} size="large" variant="contained" color="primary">Delete</Button>
              <Button  onClick={this.toggleDelete} size="large" variant="outlined" color="cancel">Cancel</Button>
          </CardActions>
        </Card>
      </Modal>
      <Modal
          isOpen={this.state.changeIndexNameModal}
          contentLabel="Change Index Name"
          className="Modal"
          overlayClassName="Overlay"
      >

        <Card className={classes.root}>
          <CardContent>
            <Typography className={classes.title} color="textSecondary" gutterBottom>
              Rename your Index
            </Typography>
            <Typography className={classes.modText} align="center" variant="h6">
              Would you like to rename this index? <br/> If so, please enter a new name below.
            </Typography>


            <Grid item>
              <TextField name="changeIndexName" onChange={this.handleChange} value={this.state.changeIndexName}  variant="outlined" label="New Index Name" style={{"width":"100%"}}/>
            </Grid>

          </CardContent>
          <CardActions style={{margin:"right"}}>
            <Button  onClick={this.doChangeIndexName} size="large" variant="contained" color="primary">Change Name</Button>
            <Button  onClick={this.hideChangeIndexName} size="large" variant="outlined" color="cancel">Cancel</Button>
          </CardActions>
        </Card>
      </Modal>
      <Container>

        <Card className="red-border" style={{marginTop:"95px",zIndex:"0"}}>
          <ToolBar>
            <Typography className={classes.heading} variant={'h6'} gutterBottom>
              <h3>Home</h3>
            </Typography>
            <Grid container direction="row" justify="flex-end" alignItems="center">
              <Grid item s={6}><Button color="inherit" style={{width:"100%", float:"right"}} onClick={this.toggleModal}> Import Index </Button></Grid>
              <Grid item s={6}><Button color="inherit" style={{width:"100%", float:"right"}} onClick={this.logout}> Logout </Button></Grid>
            </Grid>
          </ToolBar>
          <form>
            <Container>
            <Grid container direction="row" justify="space-around" alignItems="center" spacing={2}>
              <Grid item xs={6} s={9} md={10} lg={10} xl={10}>
                <TextField name="indexName" onChange={this.handleChange} value={this.state.indexName}  variant="outlined" label="Index Name" style={{"width":"100%"}}/>
              </Grid>
              <Grid item xs={6} s={3} md={2} lg={2} xl={2}>
                <Button onClick={this.handleSubmit} style={{"width":"100%", "height":"1.1875em", "padding": "27px"}} color="secondary" variant="contained">Create New Index</Button>
              </Grid>
            </Grid>
            </Container>
          </form>
          <br />
        </Card>
      </Container>

      {/* Index Cards */}
      <Container>
        <div className='app' style={{marginTop:"35px"}}>
        <Grid container direction="row" justify="space-evenly" alignItems="center" spacing={1}>
          {this.state.items.map((item) => {
              return (
                <div className="item-barrier">
                <Card className="red-border">
                 <section key={item.id} className='display-item'>
                  <div className="wrapper">
                     <ul>
                     <li>

                        <Typography  className={classes.heading} variant={'h6'} gutterBottom>
                          <h3>{item.title ?  item.title : " (No Index Name) "}


                              <EditIcon className={classes.editIcon} onClick={() => this.showChangeIndexName(item.id)}/>

                          </h3>
                        </Typography>

                        <div className="wrapper-body">
                        <center>
                           <img width="100px" height="100px" src={GIACLogo} />
                        </center>
                        <CardActions>
                        <Grid container direction="row" justify="space-evenly" alignItems="center" spacing={0}>
                        <Grid item xs={5}>
                          <Link to={{
                             pathname: "/IndexTool",
                             state: {
                                indexId: item.id,
                                indexName: item.title
                             }
                          }}>

                          <Button size="large" style={{width:"100%"}} variant="contained" color="secondary">Edit</Button>

                          </Link>
                          </Grid>
                          <Grid item xs={5}>
                            <Button size="large" style={{width:"100%"}}  variant="contained" color="secondary" onClick={() => this.deletePending(item.id)}>Delete</Button>
                          </Grid>
                        </Grid>
                        </CardActions>
                        </div>
                     </li>
                     </ul>
                  </div>
               </section>
               </Card>
               </div>
              )
            })}
            </Grid>
        </div>
      </Container>
      </div>
    );
  }
}
export default withStyles(styles)(App);
