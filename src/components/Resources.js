import React, { Component } from 'react';
import ReactDataSheet from 'react-datasheet';
import Modal from 'react-modal';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Icon from '@material-ui/core/Icon';
import DownloadIcon from '@material-ui/icons/CloudDownload';

import IndexImg from "../assets/images/indexes.png";
import OSBlack from "../assets/images/os-black-flat.png";
import GuideBanner from "../assets/images/guide-banner.png";

import '../css/indextable.css';

import firebase, { auth } from '../firebase.js';

Modal.setAppElement('#root');

const styles = theme => ({
  root: {
    minWidth: 275,
  },
  main: {
    marginTop: "130px",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  button: {
    margin: theme.spacing(1),
  },
  certCard: {
    width: '100%',
    maxWidth: 500,
    borderRadius: "16px", // 16px
    transition: '0.3s',
    boxShadow: '0px 14px 80px rgba(34, 35, 58, 0.2)',
    position: 'relative',
    overflow: 'initial',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    paddingLeft: 8,
    paddingRight: 8,
    background:
      'linear-gradient(34deg, rgba(55,16,83,1) 0%, rgba(162,73,190,1) 29%, rgba(33,16,83,1) 92%)',
  },
  media: {
    flexShrink: 0,
    width: '30%',
    paddingTop: '30%',
    marginTop: '10px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  overline: {
    lineHeight: 2,
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: '0.625rem',
    opacity: 0.7,
  },
  heading: {
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  certButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 100,
    paddingLeft: 32,
    paddingRight: 32,
    color: '#ffffff',
    textTransform: 'none',
    width: '100%',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.32)',
    },
  },
  topColumn: {
    marginTop: "10px",
  }
});

class Resources extends Component {

  constructor (props) {
     super(props)

     this.state = {
        newTitle: '',
        newDescription: '',
        newPage: '',
        newBook: '',
        indexImport: '',
        showModal: false,
        user: null,
        uid: null,
        as: 'table'
     }
   }


  render() {
    const { classes } = this.props;
    return (
        <Container className={classes.main}>
          <Grid container
          spacing={3}
          direction="row"
          justify="flex-start"
          style={{ backgroundImage: `url(${OSBlack})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: '35%' }}
          >
            <Grid item >
              <img width="500" src={IndexImg} />
            </Grid>
            <Grid item xs={12} sm={5}>
              <Grid container
                spacing={3}
                direction="column"
                alignItems="center"
                className={classes.topColumn}
              >
                <Grid alignItems="center">
                  <Card className={classes.certCard}>
                    <CardMedia className={classes.media} image={'https://images.youracclaim.com/images/6ce47e59-60ab-44fe-9590-15f88b3a2bd2/giac.png'} />
                    <CardContent className={classes.content}>
                      <Typography className={classes.overline} variant={'overline'}>
                        Indexing is the best way to succeed on GIAC Exams
                      </Typography>
                      <Typography className={classes.heading} variant={'h6'} gutterBottom>
                        Get Certified!
                      </Typography>
                      <Link className="navlogo" to="/Indexes">
                        <Button className={classes.certButton}>Start Indexing</Button>
                      </Link>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid>
                  <Card style={{marginTop: "30px", maxWidth: "100vw"}}>
                    <CardActionArea>
                      <CardMedia
                        style={{height: 175}}
                        image={GuideBanner}
                        title="Guide"
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                          Learn the Tips & Tricks of Indexing
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                          Taking a GIAC certification exam soon? Checkout a test taking strategy guide based on my experiences as an instructor, course author, and SANS.edu Masters alumnus.
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                    <CardActions>
                      <Button size="small" color="primary">
                        <Link href="https://twitter.com/intent/tweet?url=https%3A%2F%2Fwww.opensecurity.io%2Fblog%2Fwargaming-giac-certifications&text=As+a+SANS+instructor+one+of+the+things+I+get+asked+about+most+...">
                          Share
                        </Link>
                      </Button>
                      <Button size="small" color="primary" >
                        <Link href="https://www.opensecurity.io/blog/wargaming-giac-certifications">
                          Learn More
                        </Link>
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            style={{ background: 'rgb(238,174,202)', background: 'radial-gradient(circle, rgb(255, 234, 253) 38%, rgba(254, 251, 255, 0.643) 70%)', paddingTop: "30px", paddingBottom: "30px", borderTop: "2px solid #cfe8fc" }}
          >
            <Grid container direction="row" justify="center" alignItems="center">
              <Grid item xs={6}>
                <center>
                  <Typography gutterBottom variant="h5" component="h2">
                    How to Index with Voltaire
                  </Typography>

                  <iframe width="560" height="315" src="https://www.youtube.com/embed/bHpkTArlXWc" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                  <Typography variant="body2" color="textSecondary" component="p">
                    Voltaire is a web-based indexing tool for GIAC certification examinations. Creating an index with Voltaire is a simple three phase process involving: documentation/note-taking, sorting & normalization, and word processing.
                  </Typography>
                </center>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            style={{ paddingTop: "30px", paddingBottom: "30px", borderTop: "2px solid #cfe8fc" }}
          >
            <Grid item xs={6}>
              <Typography gutterBottom variant="h5" component="h2">
                External Resources
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                - <Link href="https://tisiphone.net/2015/08/18/giac-testing/"> Hacksforpancakes Blog Post</Link>
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Link href="https://www.opensecurity.io/s/giac-prep-guide.pdf">
                <Button
                  size="large"
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  startIcon={<DownloadIcon />}>
                    Download a SANS GIAC Prep Guide
                </Button>
              </Link>
              <Typography variant="body2" color="textSecondary" component="p">

              </Typography>
            </Grid>
          </Grid>

        </Container>
    );
  }
}
export default withStyles(styles)(Resources);
