import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebase, { auth, provider } from '../firebase.js';

import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

import { CSVLink, CSVDownload } from "react-csv";

import OSBlack from "../assets/images/os-black-flat.png";


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
  }
});

class SettingsIndexes extends Component {
  constructor (props) {
     super(props)
     this.state = {
       indexName: '',
       items: [],
       history: [],
       user: null,
       uid: null,
       historyModal: false,
       historyDl: null,
       headers: [
        { label: "Title", key: "history.1.value" },
        { label: "Description", key: "history.2.value" },
        { label: "Page", key: "history.3.value" },
        { label: "Book", key: "history.4.value" }
      ],
     }
     this.handleClose = this.handleClose.bind(this);
     this.handleSomeEvent = this.handleSomeEvent.bind(this);
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
   exportHistory(itemId) {
     const itemRef = firebase.database().ref('/users/' + this.state.uid + '/history/' + `${itemId}`);
     itemRef.on('value', (snapshot) => {
       let items = snapshot.val();
       let newState = [];
       for (let item in items) {

         newState.push({
           history: items[item]
         });
       }
       this.setState({
         history: newState,
         historyModal: true
       });
     });
     //const itemRef = firebase.database().ref(`/users/${this.state.uid}/history/${itemId}`);
     console.log(this.state.history)
   }
   handleClose() {
     this.setState({
       historyModal: false
     });
   }
   handleSomeEvent(itemId) {
     this.exportHistory(itemId)
     var data = this.state.history
     this.setState({
       historyDl: data
     });
   }


  render() {
    const { classes } = this.props;
    return (
      <Grid container
      spacing={3}
      direction="row"
      justify="flex-start"
      style={{ backgroundImage: `url(${OSBlack})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: '35%', minHeight: '580px' }}
      >

        {this.state.items.map((item) => {
          return (
             <Grid item xs={4} key={item.id}>
               <Card style={{marginTop: "30px", maxWidth: "100vw"}}>
                   <CardContent>
                     <Typography className={classes.heading} variant={'h6'} gutterBottom>
                       <h3>{item.title}</h3>
                     </Typography>
                   </CardContent>
                 <CardActions>
                   <Link to={{
                      pathname: "/IndexTool",
                      state: {
                         indexId: item.id,
                         indexName: item.title
                      }
                   }}>
                     <Button size="small" color="primary">
                         Configure
                     </Button>
                   </Link>
                   <Button size="small" color="primary" onClick={() => this.handleSomeEvent(item.id)}>
                       Export History
                   </Button>
                   {this.state.historyDl ?
                     <CSVLink
                      data={this.state.history}
                      headers={this.state.headers}
                    >
                      Download
                    </CSVLink>
                  : null}
                 </CardActions>
               </Card>
           </Grid>
          )
        })}
      </Grid>
    );
  }
}
export default withStyles(styles)(SettingsIndexes);
