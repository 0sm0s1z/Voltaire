import React, { Component } from 'react';

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

import * as fs from "fs";
import * as docx from "docx";
import * as base64Img from "base64-img";
import { AlignmentType, Document, Footer, Header, Packer, PageBreak, PageNumber, PageNumberFormat, Paragraph, TextRun, HeadingLevel, Media
 } from "docx";
import { saveAs } from 'file-saver';

import { CSVLink, CSVDownload } from "react-csv";

import IndexImg from "../assets/images/indexes.png";

import firebase, { auth } from '../firebase.js';

const styles = theme => ({
  root: {
    minWidth: 275,
  },
});



class GenerateIndex extends Component {
  constructor (props) {
     super(props)
     this.state = {
       indexName: '',
       img: '',
       grid: [],
       data: [],
       dex: [],
       sym: [],
       a: [],
       b: [],
       c: [],
       d: [],
       e: [],
       f: [],
       d: [],
       h: [],
       i: [],
       j: [],
       k: [],
       l: [],
       m: [],
       n: [],
       o: [],
       p: [],
       q: [],
       r: [],
       s: [],
       t: [],
       u: [],
       v: [],
       w: [],
       x: [],
       y: [],
       z: [],
       indexExportData: [],
       historyDl: null,
       headers: [
        { label: "Title", key: "title.1.value" },
        { label: "Description", key: "description.2.value" },
        { label: "Page", key: "page.3.value" },
        { label: "Book", key: "book.4.value" }
      ],
     }
     this.showOptions = this.showOptions.bind(this);
     this.handleChange = this.handleChange.bind(this);
     this.buildIndex = this.buildIndex.bind(this);
     this.createHeading = this.createHeading.bind(this);
     this.createIndexSection = this.createIndexSection.bind(this);
   }
   componentDidMount() {
      var id = this.props.buildData.name;
      const indexesRef = firebase.database().ref('/users/' + this.props.buildData.uid + '/indexdata/' + id);
      indexesRef.on('value', (snapshot) => {
      let items = snapshot.val();
      let newState = [];
      for (let item in items) {
          newState.push({
           grid: items[item].grid,
          });
      }
      this.setState({
          grid: newState[0].grid,
      });
    });

   }
   showOptions() {
     this.setState({
       options: true
     });
   }
   handleChange(event: React.ChangeEvent<{ value: unknown }>) {
     this.showOptions()
     console.log(event.target)
     if (event.target.value) {
       this.setState({
         [event.target.name]: event.target.value
       });
     } else {
       this.setState({
         [event.target.name]: event.target.checked
       });
     }
   }
   handleSomeEvent(itemId) {
     this.exportHistory(itemId)
     var data = this.state.history
     this.setState({
       historyDl: data
     });
   }
   createHeading(text: string): Paragraph {
       return new Paragraph({
           text: text,
           heading: HeadingLevel.HEADING_1,
           alignment: AlignmentType.CENTER,
           thematicBreak: true,
       });
   }
   createIndexSection(rows: any[]): Paragraph[] {
    if (rows) {
      return rows.map(
        (row) =>
          new Paragraph({
            children: [
                new TextRun({
                    text: row.title,
                    bold: true,
                }),
                new TextRun({
                    text: " [b" + row.book + "/p" + row.page + "] ",
                    italics: true,
                }),
                new TextRun({
                    text: row.description,
                }),
            ],
            spacing: {
              after: 100,
            }
        }),
      );
    } else {
      return new Paragraph({
          children: [new TextRun("s")],
      });
    }
   }
   buildIndex() {

     //Compile Index
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
        if(a.title.value.toLowerCase() < b.title.value.toLowerCase()) return -1;
        if(a.title.value.toLowerCase() > b.title.value.toLowerCase()) return 1;
        return 0;
     });

     //Segment by Alpha
     var curLetter = ""
     for (let item in tmpList) {
       var letter = tmpList[item].title.value.charAt(0).toLowerCase()
       if (letter == curLetter || letter.toUpperCase() == curLetter) {
         tmpList2.push({
            title: tmpList[item].title.value,
            description: tmpList[item].description.value,
            page: tmpList[item].page.value,
            book: tmpList[item].book.value
         });

       } else {
         //New letter
         console.log(curLetter, tmpList2)
         this.setState({
             [curLetter.toLowerCase()]: tmpList2
         });
         curLetter = letter
         tmpList2 = [];
         tmpList2.push({
            title: tmpList[item].title.value,
            description: tmpList[item].description.value,
            page: tmpList[item].page.value,
            book: tmpList[item].book.value
         });
       }
    }

     // Create document
     const doc = new docx.Document({
          creator: "Voltaire",
          description: "My new Index",
          title: "GIAC Index",
          styles: {
            paragraphStyles: [
              {
                  id: "Heading1",
                  name: "Heading 1",
                  basedOn: "Normal",
                  next: "Normal",
                  quickFormat: true,
                  run: {
                      size: 72,
                      bold: true,
                  },
                  paragraph: {
                      spacing: {
                          after: 120,
                      },
                  },
              },
              {
                  id: "Heading2",
                  name: "Heading 2",
                  basedOn: "Normal",
                  next: "Normal",
                  quickFormat: true,
                  run: {
                      size: 65,
                      bold: true,
                  },
                  paragraph: {
                      spacing: {
                          before: 3000,
                      },
                  },
              },
            ]
          }
      });

     //Index Sections
     //var img = base64Img.base64Sync('../assets/images/indexes.png');
     const image2base64 = require('image-to-base64');
     fetch('https://api.github.com/users/0sm0s1z')
      .then(
          (response) => {
              console.log(response); //cGF0aC90by9maWxlLmpwZw==
              //Load State
              doc.addSection({
                footers: {
                  default: new Footer({
                      children: [
                          new Paragraph({
                              alignment: AlignmentType.CENTER,
                              children: [
                                  new TextRun("Created using Voltaire an Open Security Tool"),
                              ],
                          }),
                      ],
                  }),
                },
                children: [
                 new Paragraph({
                    text: " ",
                 }),
                 //new Paragraph(image),
                 new Paragraph({
                     text: this.props.buildData.indexName,
                     heading: HeadingLevel.HEADING_2,
                     alignment: AlignmentType.CENTER,
                 }),
                ]
              });

             //Main Index
             doc.addSection({
               headers: {
                   default: new Header({
                       children: [
                           new Paragraph({
                               children: [
                                   new TextRun({
                                       children: [PageNumber.CURRENT],
                                   }),
                               ],
                           }),
                       ],
                   }),
               },
               footers: {
                   default: new Footer({
                       children: [
                           new Paragraph({
                               alignment: AlignmentType.CENTER,
                               children: [
                                   new TextRun({
                                       children: ["Page: ", PageNumber.CURRENT],
                                   }),
                                   new TextRun({
                                       children: [" to ", PageNumber.TOTAL_PAGES],
                                   }),
                               ],
                           }),
                       ],
                   }),
               },
               properties: {
                   pageNumberStart: 1,
                   pageNumberFormatType: PageNumberFormat.DECIMAL,
                   column: {
                      space: 708,
                      count: 2,
                  },
               },
               children: [

                  this.createHeading("Aa"),
                  ...this.createIndexSection(this.state.a),
                  new Paragraph({
                      children: [new PageBreak()],
                  }),
                  this.createHeading("Bb"),
                  ...this.createIndexSection(this.state.b),
                  new Paragraph({
                      children: [new PageBreak()],
                  }),
                  this.createHeading("Cc"),
                  ...this.createIndexSection(this.state.c),
                  new Paragraph({
                      children: [new PageBreak()],
                  }),
                  this.createHeading("Dd"),
                  ...this.createIndexSection(this.state.d),
                  new Paragraph({
                      children: [new PageBreak()],
                  }),
                  this.createHeading("Ee"),
                  ...this.createIndexSection(this.state.e),
                  new Paragraph({
                      children: [new PageBreak()],
                  }),
                  this.createHeading("Ff"),
                  ...this.createIndexSection(this.state.f),
                  new Paragraph({
                      children: [new PageBreak()],
                  }),
                  this.createHeading("Gg"),
                  ...this.createIndexSection(this.state.g),
                  new Paragraph({
                      children: [new PageBreak()],
                  }),
                  this.createHeading("Hh"),
                  ...this.createIndexSection(this.state.h),
                  new Paragraph({
                      children: [new PageBreak()],
                  }),
                  this.createHeading("Ii"),
                  ...this.createIndexSection(this.state.i),
                  new Paragraph({
                      children: [new PageBreak()],
                  }),
                  this.createHeading("Jj"),
                  ...this.createIndexSection(this.state.j),
                  new Paragraph({
                      children: [new PageBreak()],
                  }),
                  this.createHeading("Kk"),
                  ...this.createIndexSection(this.state.k),
                  new Paragraph({
                      children: [new PageBreak()],
                  }),
                  this.createHeading("Ll"),
                  ...this.createIndexSection(this.state.l),
                  new Paragraph({
                      children: [new PageBreak()],
                  }),
                  this.createHeading("Mm"),
                  ...this.createIndexSection(this.state.m),
                  new Paragraph({
                      children: [new PageBreak()],
                  }),
                  this.createHeading("Nn"),
                  ...this.createIndexSection(this.state.n),
                  new Paragraph({
                      children: [new PageBreak()],
                  }),
                  this.createHeading("Oo"),
                  ...this.createIndexSection(this.state.o),
                  new Paragraph({
                      children: [new PageBreak()],
                  }),
                  this.createHeading("Pp"),
                  ...this.createIndexSection(this.state.p),
                  new Paragraph({
                      children: [new PageBreak()],
                  }),
                  this.createHeading("Qq"),
                  ...this.createIndexSection(this.state.q),
                  new Paragraph({
                      children: [new PageBreak()],
                  }),
                  this.createHeading("Rr"),
                  ...this.createIndexSection(this.state.r),
                  new Paragraph({
                      children: [new PageBreak()],
                  }),
                  this.createHeading("Ss"),
                  ...this.createIndexSection(this.state.s),
                  new Paragraph({
                      children: [new PageBreak()],
                  }),
                  this.createHeading("Tt"),
                  ...this.createIndexSection(this.state.t),
                  new Paragraph({
                      children: [new PageBreak()],
                  }),
                  this.createHeading("Uu"),
                  ...this.createIndexSection(this.state.u),
                  new Paragraph({
                      children: [new PageBreak()],
                  }),
                  this.createHeading("Vv"),
                  ...this.createIndexSection(this.state.v),
                  new Paragraph({
                      children: [new PageBreak()],
                  }),
                  this.createHeading("Ww"),
                  ...this.createIndexSection(this.state.w),
                  new Paragraph({
                      children: [new PageBreak()],
                  }),
                  this.createHeading("Xx"),
                  ...this.createIndexSection(this.state.x),
                  new Paragraph({
                      children: [new PageBreak()],
                  }),
                  this.createHeading("Yy"),
                  ...this.createIndexSection(this.state.y),
                  new Paragraph({
                      children: [new PageBreak()],
                  }),
                  this.createHeading("Zz"),
                  ...this.createIndexSection(this.state.z),
                  new Paragraph({
                      children: [new PageBreak()],
                  }),
               ],
             });


             Packer.toBlob(doc).then(blob => {
                console.log(blob);
                saveAs(blob, this.props.buildData.indexName + ".docx");
                console.log("Document created successfully");
            });


          }
      )
      .catch(
          (error) => {
              console.log(error); //Exepection error....
          }
      )



   }

  render() {
    const { classes } = this.props;
    return (
      <Container>
        <center>
          <Typography onClick={this.showOptions} className={classes.heading} variant={'h4'} gutterBottom>
            We hope you enjoy your new index! Good luck on the exam!
          </Typography>
          <Typography onClick={this.showOptions} className={classes.heading} variant={'h4'} gutterBottom>
          </Typography>
        </center>
        <Grid container
        direction="row"
        justify="center"
        spacing={3}
        >
          <Grid item xs={4}>
            <Card style={{marginTop: "30px", maxWidth: "100vw"}}>
              <Grid container direction="column">
                <CardContent>
                  <Button onClick={this.buildIndex} variant="contained" color="primary">
                    Generate
                  </Button>
                </CardContent>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </Container>
    );
  }
}
export default withStyles(styles)(GenerateIndex);
