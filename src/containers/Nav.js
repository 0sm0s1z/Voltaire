import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
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
import BuildIcon from '@material-ui/icons/Build';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import Box from '@material-ui/core/Box';

import { auth } from '../firebase.js';
import { DeprecationBanner, NEW_SITE_URL } from '../components/DeprecationGuard';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
    fontFamily: "'Fredoka One', cursive",
    fontSize: "30px",
    color: "#fff",
    textDecoration: "none",
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
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  buildButton: {
    color: "#fff",
    border: "2px solid rgba(255,255,255,0.35)",
    padding: "6px 12px",
    margin: "0px 0px 0px 12px",
    fontWeight: 600,
    whiteSpace: "nowrap",
    textTransform: "none",
  },
  newSiteButton: {
    backgroundColor: "#FA6900",
    color: "#fff",
    padding: "6px 14px",
    margin: "0px 0px 0px 12px",
    fontWeight: 700,
    whiteSpace: "nowrap",
    textTransform: "none",
    '&:hover': {
      backgroundColor: '#d75c04',
    },
  },
  spacer: {
    height: '126px',
  },
});

class Nav extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
      open: false,
    };
    this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
    this.handleDrawerClose = this.handleDrawerClose.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    this.unsubscribe = auth.onAuthStateChanged((user) => {
      this.setState({ user: user || null });
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  handleDrawerClose() {
    this.setState({ open: false });
  }

  handleDrawerOpen() {
    this.setState({ open: true });
  }

  logout() {
    auth.signOut().then(() => {
      this.setState({ user: null });
      window.location.href = '/';
    });
  }

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
          <DeprecationBanner />
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
              <Link className={classes.title} to="/Indexes">Voltaire (Legacy Read-Only)</Link>
            </Typography>
            <Box display={{ xs: 'none', sm: 'block' }}>
              <a href={NEW_SITE_URL} style={{ textDecoration: 'none' }}>
                <Button className={classes.newSiteButton} endIcon={<OpenInNewIcon />}>
                  training.opensecurity.com
                </Button>
              </a>
            </Box>
            {this.state.user ? (
              <Link to="/BuildIndex" style={{ textDecoration: 'none' }}>
                <Button className={classes.buildButton}>
                  <BuildIcon color="inherit" style={{ marginRight: 6 }} />
                  Export / Build Index
                </Button>
              </Link>
            ) : null}
            {this.state.user ? (
              <Button className={classes.buildButton} onClick={this.logout}>
                Logout
              </Button>
            ) : null}
          </Toolbar>
        </AppBar>
        <div className={classes.spacer} />

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
          <ListItem>
            <b>New Platform</b>
          </ListItem>
          <Divider />
          <List>
            <a href={NEW_SITE_URL} style={{ textDecoration: 'none', color: 'inherit' }}>
              <ListItem button>
                <ListItemIcon><OpenInNewIcon style={{ color: '#FA6900' }} /></ListItemIcon>
                <ListItemText primary="training.opensecurity.com" secondary="Active platform" />
              </ListItem>
            </a>
          </List>

          <Divider />
          <ListItem>
            <b>Legacy Data Recovery</b>
          </ListItem>
          <Divider />
          <List>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              <ListItem button>
                <ListItemIcon><AssignmentIcon /></ListItemIcon>
                <ListItemText primary="My Indexes (Read-Only)" />
              </ListItem>
            </Link>
            <Link to="/BuildIndex" style={{ textDecoration: 'none', color: 'inherit' }}>
              <ListItem button>
                <ListItemIcon><BuildIcon /></ListItemIcon>
                <ListItemText primary="Export / Build Index" />
              </ListItem>
            </Link>
            <Link to="/Settings" style={{ textDecoration: 'none', color: 'inherit' }}>
              <ListItem button>
                <ListItemIcon><SettingsIcon /></ListItemIcon>
                <ListItemText primary="Export History" />
              </ListItem>
            </Link>
            <Link to="/Resources" style={{ textDecoration: 'none', color: 'inherit' }}>
              <ListItem button>
                <ListItemIcon><MenuBookIcon /></ListItemIcon>
                <ListItemText primary="Resources" />
              </ListItem>
            </Link>
          </List>
        </Drawer>
      </div>
    );
  }
}

export default withStyles(styles)(Nav);
