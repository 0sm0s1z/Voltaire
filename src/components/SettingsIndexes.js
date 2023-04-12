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
       grid: [],
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
     this.exportHistoryHandler = this.exportHistoryHandler.bind(this);
     this.deleteIndexBlankRows = this.deleteIndexBlankRows.bind(this);
     this.alphabetizeIndex = this.alphabetizeIndex.bind(this);
     this.orderByBookPage = this.orderByBookPage.bind(this);

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
   exportHistoryHandler(itemId) {
     this.exportHistory(itemId)
     var data = this.state.history
     this.setState({
       historyDl: data
     });
   }

  deleteIndexBlankRows(itemId) {
     const indexesRef = firebase.database().ref('/users/' + this.state.uid + '/indexdata/' + itemId);
     indexesRef.once('value', (snapshot) => {
       let removeId = "";
       let items = snapshot.val();
       let newState = [];
       for (let item in items) {
           // cache the old index key
           removeId = item;
           // create a new grid object with data from key.
           newState.push({
             grid: items[item].grid
           });
       }
       let splices = [];
       // retrieve a list of rows that are empty.
       for(let indice in newState[0].grid) {
         let row = newState[0].grid[indice];
         if(row[1].value === "" && row[2].value ==="" && row[3].value === "" && row[4].value===""){
           splices.push(indice)
         }
       }
       // remove the rows that are empty.
       if(splices.length > 0) {
         for (let i = splices.length - 1; i >= 0; i--) {
           newState[0].grid.splice(splices[i], 1);
         }
         // if rows were removed, renumber the rows.
         for (let i = 1; i < newState[0].grid.length; i++) {
           newState[0].grid[i][0].value = i;
         }
         // add the new index reference
         indexesRef.push({
           grid: newState[0].grid
         });
         // remove the old index reference
         indexesRef.child(removeId).set(null);
       }
     });
   }

  alphabetizeArray(array) {
    array.sort(function(a, b) {
      var valueA = a[1].value.toUpperCase(); // ignore upper and lowercase
      var valueB = b[1].value.toUpperCase(); // ignore upper and lowercase
      if (valueA < valueB) {
        return -1;
      }
      if (valueA > valueB) {
        return 1;
      }
      // values are equal
      return 0;
    });
    return array;
  }



  alphabetizeIndexByBookPage(array) {
    array.sort(function(a, b) {
      var valueA = a[4].value.toUpperCase(); // ignore upper and lowercase
      var valueB = b[4].value.toUpperCase(); // ignore upper and lowercase

      function extractNumbersBeforeDelimiter(s) {
        var m = s.match(/^(\d+)/);
        return m ? m[1] : null;
      }

      // Convert to Numbers if conversion works. Otherwise, leave as strings.
      if(Number(valueA) && Number(valueB)) {
        valueA = Number(valueA);
        valueB = Number(valueB);
      }else{
        if(Number(extractNumbersBeforeDelimiter(valueA))) valueA = Number(extractNumbersBeforeDelimiter(valueA));
        if(Number(extractNumbersBeforeDelimiter(valueB))) valueB = Number(extractNumbersBeforeDelimiter(valueB));
      }

      if (valueA < valueB) {
        return -1;
      }
      if (valueA > valueB) {
        return 1;
      }
      // values are equal

      var valueC = a[3].value.toUpperCase(); // ignore upper and lowercase
      var valueD = b[3].value.toUpperCase(); // ignore upper and lowercase

      if(Number(valueC) && Number(valueD)) {
        valueC = Number(valueC);
        valueD = Number(valueD);
      }else{
        if(Number(extractNumbersBeforeDelimiter(valueC))) valueC = Number(extractNumbersBeforeDelimiter(valueC));
        if(Number(extractNumbersBeforeDelimiter(valueD))) valueD = Number(extractNumbersBeforeDelimiter(valueD));
      }

      if (valueC < valueD) {
        return -1;
      }
      if (valueC > valueD) {
        return 1;
      }
      // values are equal
      return 0;
    });
    return array;
  }

  alphabetizeIndex(itemId) {
    const indexesRef = firebase.database().ref('/users/' + this.state.uid + '/indexdata/' + itemId);
    indexesRef.once('value', (snapshot) => {
      let removeId = "";
      let items = snapshot.val();
      let newState = [];
      for (let item in items) {
        // cache the old index key
        removeId = item;
        // create a new grid object with data from key.
        newState.push({
          grid: items[item].grid
        });
      }

      try {
        // cache the first row from array and remove it
        let firstRow = newState[0].grid.shift();
        this.alphabetizeArray(newState[0].grid);
        newState[0].grid.unshift(firstRow);

        for (let i = 1; i < newState[0].grid.length; i++) {
          newState[0].grid[i][0].value = i;
        }

        // add the new index reference
        indexesRef.push({
          grid: newState[0].grid
        });
        // remove the old index reference
        indexesRef.child(removeId).set(null);

      } catch (e) {
        console.log(e)
      }
    });
  }

  orderByBookPage(itemId) {
    const indexesRef = firebase.database().ref('/users/' + this.state.uid + '/indexdata/' + itemId);
    indexesRef.once('value', (snapshot) => {
      let removeId = "";
      let items = snapshot.val();
      let newState = [];
      for (let item in items) {
        // cache the old index key
        removeId = item;
        // create a new grid object with data from key.
        newState.push({
          grid: items[item].grid
        });
      }

      try {
        // cache the first row from array and remove it
        let firstRow = newState[0].grid.shift();
        this.alphabetizeIndexByBookPage(newState[0].grid);
        newState[0].grid.unshift(firstRow);

        for (let i = 1; i < newState[0].grid.length; i++) {
          newState[0].grid[i][0].value = i;
        }

        // add the new index reference
        indexesRef.push({
          grid: newState[0].grid
        });
        // remove the old index reference
        indexesRef.child(removeId).set(null);

      } catch (e) {
        console.log(e)
      }
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
                       Edit Index
                     </Button>
                   </Link>
                   <Button size="small" color="primary" onClick={() => this.exportHistoryHandler(item.id)}>
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
                 <CardActions>

                   { (false) ? <Button size="small" color="primary" onClick={() => this.exportHistoryHandler(item.id)}>
                     Sort Index by Title
                   </Button> : null}
                   <Button size="small" color="primary" onClick={() => this.deleteIndexBlankRows(item.id)}>
                     Remove Blank Rows
                   </Button>
                   <Button size="small" color="primary" onClick={() => this.alphabetizeIndex(item.id)}>
                     Alphabetize Index
                   </Button>
                   <Button size="small" color="primary" onClick={() => this.orderByBookPage(item.id)}>
                     Order by Book/Page
                   </Button>
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
