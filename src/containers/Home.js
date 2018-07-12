import React, { Component } from 'react';
import { Link } from 'react-router-dom';

//import logo from '../logo.svg';
import '../App.css';
import firebase, { auth, provider } from '../firebase.js';

class App extends Component {
  constructor() {
    super();
    this.state = {
      indexName: '',
      items: [],
      user: null,
      uid: null
    }
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  logout() {
     auth.signOut()
      .then(() => {
        this.setState({
          user: null
        });
      });
  }
  login() {
    auth.signInWithRedirect(provider)
      .then((result) => {
        const user = result.user;
        this.setState({
          user
        });
      });
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  handleSubmit(e) {
    e.preventDefault();
    const indexesRef = firebase.database().ref('/users/' + this.state.uid + '/indexes');
    const item = {
      title: this.state.indexName
    }
    indexesRef.push(item);
    this.setState({
      indexName: ''
    });
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
  removeItem(itemId) {
    const itemRef = firebase.database().ref(`/users/${this.state.uid}/indexes/${itemId}`);
    itemRef.remove();
  }
  importIndex() {
     console.log("tmp");
  }
  render() {
    return (
      <div className='app'>
        <div className='container'>
          <section className='add-item'>
          {this.state.user ?
            <div>
                <form onSubmit={this.handleSubmit}>
                  <input type="text" name="indexName" placeholder="Index Title" onChange={this.handleChange} value={this.state.indexName} />
                  <button>Create New Index</button>
                </form>
                <br />

                   <div className='user-profile'>
                     <img alt="" src={this.state.user.photoURL} />
                   </div>
                   <button onClick={this.logout}>Log Out</button>
                  </div>
                   :
                   <button onClick={this.login}>Log In</button>
                 }
          </section>

            {this.state.items.map((item) => {
              return (
                 <section key={item.id} className='display-item'>
                  <div className="wrapper">
                     <ul>
                     <li>
                        <h3>{item.title}</h3>
                        <br />
                        <center>
                           <img alt="img" src="https://acclaim-production-app.s3.amazonaws.com/images/6ce47e59-60ab-44fe-9590-15f88b3a2bd2/large_giac.png" />
                        </center>
                        <p>
                          <Link to={{
                             pathname: "/IndexTool",
                             state: {
                                indexId: item.id,
                                indexName: item.title
                             }
                          }}><button>Edit</button></Link>

                          <button onClick={() => this.removeItem(item.id)}>Delete Index</button>
                        </p>
                     </li>
                     </ul>
                  </div>
               </section>
              )
            })}

        </div>
      </div>
    );
  }
}

export default App;
