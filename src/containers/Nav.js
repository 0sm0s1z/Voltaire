// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindows } from '@fortawesome/free-brands-svg-icons';
import clsx from 'clsx';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';

import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AssignmentIcon from '@material-ui/icons/Assignment';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import SettingsIcon from '@material-ui/icons/Settings';
import LiveHelpIcon from '@material-ui/icons/LiveHelp';


import firebase, { auth } from '../firebase.js';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    fontFamily: "Brush Script MT, Brush Script Std, cursive",
    fontSize: "36px",
    color: "#fff",
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: "#B11116",
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  buildMenu: {
    width: "420px",
    marginTop: "30px",
    textDecoration: "none",
    color: "inherit"
  },
  buildButton: {
    color: "#fff",
  },
});

class Nav extends Component {
   constructor() {
     super();
     this.state = {
       indexList: [],
       indexExportData: [],
       grid: [],
       open: false,
       anchorEl: React.useState<null | HTMLElement>(null),
     }
     this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
     this.handleDrawerClose = this.handleDrawerClose.bind(this);
     this.handleClose = this.handleClose.bind(this);
     this.handleClick = this.handleClick.bind(this);
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
   handleDrawerClose() {
     this.setState({
      open: false
     });
   }
   handleDrawerOpen() {
     this.setState({
      open: true
     });
   }

   handleClick(event: React.MouseEvent<HTMLButtonElement>) {
     this.setState({
      anchorEl: event.currentTarget
     });
   };
   handleClose() {
     this.setState({
      anchorEl: false
     });
   };

  render() {
    const { classes } = this.props;



    return (
      <div className={classes.root}>
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: this.state.open,
          })}
        >
          <Toolbar>
            <IconButton
             color="inherit"
             aria-label="open drawer"
             onClick={this.handleDrawerOpen}
             edge="start"
             className={clsx(classes.menuButton, this.state.open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
              <Typography variant="h6" className={classes.title}>
                <Link className={classes.title} to="/Indexes">Voltaire</Link>
              </Typography>
            <Link to="/BuildIndex">
              <Button className={classes.buildButton} aria-controls="simple-menu" aria-haspopup="true">
                Build Index
              </Button>
            </Link>
          </Toolbar>
        </AppBar>
        <Drawer
         className={classes.drawer}
         variant="persistent"
         anchor="left"
         open={this.state.open}
         classes={{
           paper: classes.drawerPaper,
         }}
       >
         <div className={classes.drawerHeader}>
           <IconButton onClick={this.handleDrawerClose}>
             <ChevronLeftIcon />
           </IconButton>
         </div>
         <Divider />
         <List>
          <Link to="/">
            <ListItem button>
             <ListItemIcon><AssignmentIcon /></ListItemIcon>
             <ListItemText primary="Indexes" />
            </ListItem>
          </Link>
          <Link to="/Resources">
           <ListItem button>
            <ListItemIcon><MenuBookIcon /></ListItemIcon>
            <ListItemText primary="Resources" />
           </ListItem>
          </Link>
          <Link to="/Resources">
           <ListItem button>
            <ListItemIcon><LiveHelpIcon /></ListItemIcon>
            <ListItemText primary="FAQ" />
           </ListItem>
          </Link>
          <Link to="/Settings">
           <ListItem button>
            <ListItemIcon><SettingsIcon /></ListItemIcon>
            <ListItemText primary="Settings" />
           </ListItem>
          </Link>
         </List>
         <Divider />
         <ListItem button>
           <ListItemText primary="External Resources" />
         </ListItem>
         <Divider />
         <a href="https://www.opensecurity.io/blog/wargaming-giac-certifications">
         <ListItem button>
           <ListItemText primary="Study Strategy Guide" />
         </ListItem>
         </a>
         <a href="https://www.opensecurity.io/blog/wargaming-giac-certifications">
         <ListItem button>
           <ListItemText primary="GIAC Prep Manual" />
         </ListItem>
         </a>
         <a href="https://www.opensecurity.io/blog/wargaming-giac-certifications">
         <ListItem button>
           <ListItemText primary="Hacksforpancakes Blog" />
         </ListItem>
         </a>

       </Drawer>

      </div>
    );
  }
}
export default withStyles(styles)(Nav);
