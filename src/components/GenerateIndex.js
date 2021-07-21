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
  link:{
    fontweight:"bold",
    color:"grey",
    fontDecoration:"underline"
  },
  body:{
    marginTop: "30px", maxWidth: "100vw"
  },
  padding:{
    marginTop: "16px"
  }

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
       num: [],
       a: [],
       b: [],
       c: [],
       d: [],
       e: [],
       f: [],
       g: [],
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
      console.log({grid:newState[0].grid})
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

     console.log(data, "data");

     //Build and Sort List
    for (let item in data) {
      item = data[item]
      if(!item[1].readOnly){
        tmpList.push({
           title: item[1].value.toString(),
           description: item[2].value.toString(),
           page: item[3].value.toString(),
           book: item[4].value.toString()
        });
      }
    }

    tmpList.sort(function(a, b){
        a = a.title.toLowerCase()
        b = b.title.toLowerCase()
        if(a < b) return -1;
        if(a > b) return 1;
        return 0;
     });

    var cache="";
    var usedChars="";

    for(let itema in tmpList){
        var item = tmpList[itema]
        var letter = item.title.charAt(0).toLowerCase();
        //Current Letter
        if(letter === cache){
          tmpList2.push({...item})
        }else{
        //New Letter
          this.setState({
            [cache.toLowerCase()]: tmpList2
          });

          tmpList2 = Array(item)
          cache=letter;
          usedChars=usedChars+cache
        }
        /* Be sure to save the last value (Z?)... !important; */
        this.setState({
          [cache.toLowerCase()]: tmpList2
        });

    }

    //listOfChars

    var nonalphabet = ""
    var alphabet = "abcdefghijklmnopqrstuvwxyz";

    for(let char in usedChars){
      char = usedChars[char];
      if(alphabet.indexOf(char) == -1){
        nonalphabet = nonalphabet + char
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

      /*
        Generates Heading for all Numbers used in Form.
      */
      const generateNumbers = () => {
        var arr=[];
        for(let char in nonalphabet){
          char=nonalphabet[char];

          if(!isNaN(parseInt(char))){
            arr.push(this.createHeading("#"+char),
              ...this.createIndexSection(this.state[char]),
              new Paragraph({children: [new PageBreak()],})
            )
          }
        }
        return arr;
      }
      /*
        Generates Heading for A->Z
      */
      const generateText = () => {
        var arr = [];
        for(let char in alphabet){
          char=alphabet[char];

          if(isNaN(parseInt(char))){
            arr.push(this.createHeading(char.toUpperCase()+char.toLowerCase()),
              ...this.createIndexSection(this.state[char]),
              new Paragraph({children: [new PageBreak()],})
            )
          }
        }
        return arr;
      }
      /*
        Generates Heading for all Symbols Provided in Form.
      */
      const generateSymbols = () => {
        var arr=[];
        for(let char in nonalphabet){
          char=nonalphabet[char];

          if(isNaN(parseInt(char))){
            arr.push(this.createHeading(char),
              ...this.createIndexSection(this.state[char]),
              new Paragraph({children: [new PageBreak()],})
            )
          }
        }
        return arr;
      }

     //Index Sections
     //var img = base64Img.base64Sync('../assets/images/indexes.png');
     const image2base64 = require('image-to-base64');
     fetch('https://api.github.com/users/0sm0s1z')
      .then(
          (response) => {

            var numbers = generateNumbers();
            var text = generateText();
            var symbols = generateSymbols();




              var children = [].concat(numbers,text,symbols);

              console.log(this.state)
              console.log(response); //cGF0aC90by9maWxlLmpwZw==
              //Load State
              doc.addSection({
                footers: {
                  default: new Footer({
                      children: [
                          new Paragraph({
                              alignment: AlignmentType.CENTER,
                              children: [
                                  new TextRun("Created with Voltaire an Open Security Tool"),
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
               children: children,
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
      <center>
      <Container>

        <Grid container
        direction="row"
        justify="center"
        spacing={3}
        >
          <Grid item xs={7}>
            <Card className={"red-border", classes.body}>
              <Grid container direction="column">
                <CardContent>
                <Typography onClick={this.showOptions} className={classes.heading} variant={'h4'} gutterBottom>
                  Good luck on the exam!
                </Typography>
                <Typography onClick={this.showOptions} className={classes.heading} variant={'h6'} gutterBottom>
                  Enjoy the tool? Check out our <u><a className={classes.link} href="https://discord.gg/VTjqSxkJqX">Discord</a></u>.
                </Typography>

                  <Button onClick={this.buildIndex} className={classes.padding} variant="contained" color="primary" className="voltaire-action">                    Download Index
                  </Button>

                </CardContent>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </Container>
      </center>
    );
  }
}
export default withStyles(styles)(GenerateIndex);
