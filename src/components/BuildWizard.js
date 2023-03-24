import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';


import firebase, { auth } from '../firebase.js';


const styles = theme => ({
  root: {
    minWidth: 275,
  },
  heading: {
    marginTop:"1em"
  },
  card : {
    padding:10
  },
  formControlWide : {
    margin: theme.spacing(0),
    width:"100%"
  },
  formControl : {
    margin: theme.spacing(0),
  },
  tall : {
    height: "100%"
  },
  bigPadding : {
    padding: "0 2.25em"
  },
    smallPadding : {
      padding: "0 1em"
    },
  maroon : {

      backgroundColor:"#B11116",
      color:"#B11116"
    },
    alert:{
      color: "#B11116",
      fontSize: "0.9em",
      fontWeight: "bold",
      padding: "0.5em 0"
    }
});

class BuildWizard extends Component {
  constructor (props) {
     super(props)
     this.state = {
       options: false,
       type: 'Index Type',
       user: null,
       uid: null,
       title: "",
       name: "",

         settings: {
            color: false, // color default to false (prioritize people to stay with Black theme)
            columns: true,
            doublesided: true,
            coversheet: true,
         },
       indexList: [],
       indexExportData: [],
       columns: [
        { label: 'Title', width: '30%' },
        { label: 'Description', width: '20%' },
        { label: 'Color (SRM)', width: '20%' },
        { label: 'Rating', width: '20%' }
       ],
       grid: [],
       warning : "",
     }
     this.showOptions = this.showOptions.bind(this);
     this.hideOptions = this.hideOptions.bind(this);
     this.handleChange = this.handleChange.bind(this);
     this.handleChangeOptions = this.handleChangeOptions.bind(this);
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
   showOptions() {
     this.setState({
       options: true
     });
   }
   hideOptions() {
        this.setState({
            options: false
        });
    }
   handleChange(event: React.ChangeEvent<{ value: unknown }>) {
      console.log("CHANGING", event.target.name, event.target.value)
     if (event.target.name==="type") {
         this.hideOptions()
         if(event.target.value=="DOC") { this.showOptions() }
     }

     if (event.target.value) {
       this.setState({
         [event.target.name]: event.target.value,
       });
     } else {
       this.setState({
         [event.target.name]: !this.state[event.target.name]
       });
     }

   }
   // function to handle the changing of settings object that will be passed to further components
    handleChangeOptions(event: React.ChangeEvent<{ value: unknown }>) {
        let settings = this.state.settings
        if (event.target.value) {
            settings[event.target.name] = event.target.value
            this.setState({settings: settings})
        } else {
            settings[event.target.name] = !this.state.settings[event.target.name]
            this.setState({settings: settings})
        }
    }

   exportIndex(id) {
      this.setState({warning: ""})
      const indexesRef = firebase.database().ref('/users/' + this.state.uid + '/indexdata/' + id);
      indexesRef.on('value', (snapshot) => {
        let items = snapshot.val();
        let newState = [];
        for (let item in items) {
          newState.push({
           grid: items[item].grid
          });
        }

        try{
            this.setState({
                grid: newState[0].grid
            });
        }catch(e){
            console.log(e)
            this.setState({warning: "You are trying to export an empty index. Please add some data or select another index before exporting."})
        }


     });
     if(this.state.grid.length > 0) { this.buildIndex() }

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

   render() {
     const { classes } = this.props;
     return (
        <Container>
           <Grid container
           direction="row"
           justify="center"
           spacing={3}
           >
             <Grid item xs={12}>
           <Card className="red-border" style={{marginTop: "30px"}}>
             <CardContent className={classes.smallPadding}>
             <Typography className={[classes.heading, classes.smallPadding]} variant={'h4'} gutterBottom>
               Index Builder
             </Typography>
             <Divider className={classes.maroon}/>
             </CardContent>


             <Grid container justify="space-around" alignItems="stretch" >
             <Grid item xs={12} className={classes.card}>

                <center>
                    {null ?
                 <Typography className={classes.heading} variant={'h6'} gutterBottom>
                   Document Properties
                 </Typography> : "" }

                </center>

                   <Grid container>
                       <Grid item className={classes.card} xs={12} sm={this.state.options ? 8 : 12} md={this.state.options ? 9 : 12}>
                           <Card>
                           <CardContent>
                           <FormControl variant="outlined" className={classes.formControlWide}>
                             <TextField
                               id="outlined-basic"
                               label="Index Title"
                               variant="outlined"
                               name="title"
                               value={this.state.title}
                               onChange={this.handleChange}
                             />
                           </FormControl>
                           </CardContent>
                           <CardContent>
                             <FormControl variant="outlined" className={classes.formControlWide}>
                               <Select
                                 name="type"
                                 value={this.state.type}
                                 onChange={this.handleChange}
                               >
                                 <MenuItem value="DOC">DOC</MenuItem>
                                 <MenuItem value="JSON">JSON</MenuItem>
                                 <MenuItem value="CSV">CSV</MenuItem>
                               </Select>
                               <FormHelperText>Export Format</FormHelperText>
                             </FormControl>
                           </CardContent>
                           <CardContent>
                             <FormControl variant="outlined" className={classes.formControlWide}>
                               <Select
                                 name="name"
                                 value={this.state.name}
                                 onChange={this.handleChange}
                               >
                               {this.state.indexList.map((item) => (
                                 <MenuItem key={item.id} onClick={() => this.exportIndex(item.id)} value={item.id}>{item.title ? item.title : "(No Index Name)"}</MenuItem>
                               ))}
                               </Select>
                               <FormHelperText>Index Name</FormHelperText>
                               { this.state.warning ? <p className={classes.alert} severity="error">{this.state.warning}</p> : "" }
                             </FormControl>
                           </CardContent>
                           </Card>

                   </Grid>

                   {this.state.options ?
                       <Grid item xs={12} sm={4} md={3} lg={3} xl={3} className={classes.card}>
                           <Card className={classes.tall}>
                               <center>
                                   <Typography className={classes.heading} variant={'h6'} gutterBottom>
                                       DOC Export Options
                                   </Typography>
                                   <hr/>
                               </center>


                               <CardContent className={classes.bigPadding}>
                                   <FormControlLabel
                                       control={<Switch checked={this.state.settings.color} onChange={this.handleChangeOptions} name="color" color="primary"/>}
                                       label="Color"
                                       labelPlacement="end"
                                       disabled={this.state.type != "DOC" ? true : false} //only allow color for DOC
                                   />
                               </CardContent>

                               <CardContent className={classes.bigPadding}>
                                   <FormControlLabel
                                       control={<Switch checked={this.state.settings.columns} onChange={this.handleChangeOptions} name="columns" color="primary"/>}
                                       label="Columns"
                                       labelPlacement="end"
                                       disabled={this.state.type != "DOC" ? true : false} //only allow columns for DOC
                                   />
                               </CardContent>

                               {
                                   // Commented out because it doesn't make sense to configure this from the Web Application. It's a setting in the printer.
                                   // Also removed PDF File Types from the list of options.
                               }
                               { null ?
                               <CardContent className={classes.bigPadding}>
                                   <FormControlLabel
                                       control={<Switch checked={this.state.settings.doublesided} onChange={this.handleChangeOptions} name="doublesided" color="primary"/>}
                                       label="Double Sided"
                                       labelPlacement="end"
                                       disabled={this.state.type != "DOC" ? true : false} //only allow doublesided for DOC
                                   />
                               </CardContent> : "" }

                               <CardContent className={classes.bigPadding}>
                                   <FormControlLabel
                                       control={<Switch color="primary" checked={this.state.settings.coversheet} onChange={this.handleChangeOptions} name="coversheet"/>}
                                       label="Cover Sheet"
                                       labelPlacement="end"
                                       disabled={this.state.type != "DOC" ? true : false} //only allow coversheet for DOC
                                   />
                               </CardContent>
                           </Card>
                       </Grid>: null }
                   </Grid>
               <Grid item xs={2}>
                     <CardContent>
                     <FormControl variant="outlined">
                         {  // Hide Export Button until Error is cleared (Don't allow user to export until they've selected an index that is non-empty.)
                             (this.state.warning.length > 0) ? "" :
                             <Link to={{
                                 pathname: "/DownloadIndex",
                                 state: {
                                     indexName: this.state.title,
                                     name: this.state.name,
                                     uid: this.state.uid,
                                     type: this.state.type,
                                     settings: (this.state.type === "DOC") ? this.state.settings : {color:false, columns:false, doublesided:false, coversheet:false}
                                 }
                             }}>
                                 <Button variant="contained" color="primary">
                                     Generate
                                 </Button>
                             </Link>
                         }
                       </FormControl>
                     </CardContent>

               </Grid>
             </Grid>


    </Grid>
    </Card>
    </Grid>
    </Grid>
    </Container>
     );
   }
 }
 export default withStyles(styles)(BuildWizard);
