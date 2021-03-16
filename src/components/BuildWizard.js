import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';

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
  }
});

class BuildWizard extends Component {
  constructor (props) {
     super(props)
     this.state = {
       options: true,
       type: 'Index Type',
       user: null,
       uid: null,
       title: "",
       name: "",
       checkcolor: true,
       checkcolumns: true,
       checkdoublesided: true,
       checkcoversheet: true,
       indexList: [],
       columns: [
        { label: 'Title', width: '30%' },
        { label: 'Description', width: '20%' },
        { label: 'Color (SRM)', width: '20%' },
        { label: 'Rating', width: '20%' }
       ],
       grid: [],
     }
     this.showOptions = this.showOptions.bind(this);
     this.handleChange = this.handleChange.bind(this);
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
   handleChange(event: React.ChangeEvent<{ value: unknown }>) {
     this.showOptions()
     //console.log(this.state)
     //console.log(event.target.name)
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
             <CardContent >
             <Typography onClick={this.showOptions} className={classes.heading} variant={'h4'} gutterBottom>
               Index Builder
             </Typography>

             </CardContent>


             <Grid container justify="space-around" alignItems="stretch" >
             <Grid item xs={7} s={7} md={9} lg={9} xl={9} className={classes.card}>
               <Card>
                <center>
                 <Typography onClick={this.showOptions} className={classes.heading} variant={'h6'} gutterBottom>
                   Document Properties
                 </Typography>
                </center>

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
                     <MenuItem value="PDF">PDF</MenuItem>
                     <MenuItem value="JSON">JSON</MenuItem>
                     <MenuItem value="CSV">CSV</MenuItem>
                   </Select>
                   <FormHelperText>Export Style</FormHelperText>
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
                     <MenuItem key={item.id} onClick={() => this.exportIndex(item.id)} value={item.id}>{item.title}</MenuItem>
                   ))}
                   </Select>
                   <FormHelperText>Index Name</FormHelperText>
                 </FormControl>
               </CardContent>

                 <Grid item xs>
                     <CardContent>
                     <FormControl variant="outlined" className={classes.formControlWide}>
                       <Link to={{
                          pathname: "/DownloadIndex",
                          state: {
                             indexName: this.state.title,
                             name: this.state.name,
                             uid: this.state.uid
                          }
                       }}>
                         <Button variant="contained" color="primary">
                           Generate
                         </Button>
                       </Link>
                       </FormControl>
                     </CardContent>

               </Grid>
              </Card>
             </Grid>
             {this.state.options ?
             <Grid item xs={5} s={5} md={3} lg={3} xl={3} className={classes.card}>
              <Card>
               <center>
               <Typography onClick={this.showOptions} className={classes.heading} variant={'h6'} gutterBottom>
                 Options
               </Typography>
               </center>


               <CardContent>
                 <FormControlLabel
                   control={<Switch checked={this.state.checkcolor} onChange={this.handleChange} name="checkcolor" color="primary"/>}
                   label="Color"
                   labelPlacement="end"
                 />
               </CardContent>

               <CardContent>
                 <FormControlLabel
                   control={<Switch checked={this.state.checkcolumns} onChange={this.handleChange} name="checkcolumns" color="primary"/>}
                   label="Columns"
                   labelPlacement="end"
                 />
               </CardContent>

               <CardContent>
                 <FormControlLabel
                   control={<Switch checked={this.state.checkdoublesided} onChange={this.handleChange} name="checkdoublesided" color="primary"/>}
                   label="Double Sided"
                   labelPlacement="end"
                 />
               </CardContent>

               <CardContent>
                 <FormControlLabel
                   control={<Switch color="primary" checked={this.state.checkcoversheet} onChange={this.handleChange} name="checkcoversheet"/>}
                   label="Cover Sheet"
                   labelPlacement="end"
                 />
               </CardContent>
               </Card>
             </Grid>
             : null }

</Grid>
</Card>
</Grid>
</Grid>
</Container>









     );
   }
 }
 export default withStyles(styles)(BuildWizard);
