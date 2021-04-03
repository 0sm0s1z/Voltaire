import React, { Component } from 'react';

class BuildIndex extends Component {
  constructor() {
    super();
    this.state = {
      indexName: '',
      grid: [],
      indexExportData: []
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Nav />
        <Container className={classes.main}>
          <GenerateIndex buildData={this.props.location.state}/>
        </Container>
      </div>
    );
  }
}

export default withStyles(styles)(BuildIndex);
