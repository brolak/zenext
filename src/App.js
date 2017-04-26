import React, { Component } from 'react';
import logo from './logo.png';
import axios from 'axios'
import './App.css';

class App extends Component {

  constructor(props) {
      super(props);
      this.state = {
          tasks: [],
          newTasks: 0,
          domainName:""
      };

  }
  handleSignIn = (e) => {
    e.preventDefault();
    console.log("domain:" , this.state.domainName)
    axios.get('https://zenext.zendesk.com/api/v2/search.json?query=type:ticket%20status:new')
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  handleInput = (e) => {
    this.setState({
      domainName: e.target.value
    })
  }

  componentDidMount = () => {
    this.state
    setInterval( (x)=> {

      this.setState({newTasks:this.state.newTasks+=1})
    }, 5000);
  }


  render() {
    return (

        <div className="container">
          <div className="row">
            <div className="col-md-12 navbar">
              <img src={logo} className="App-logo" alt="logo" />
            </div>
            <hr/>
            <h3 className="title">Hello There Agent</h3>
            <p className="intro">
                Please sign in with your Zendesk account
                to start getting real time notification
                on new tickets
            </p>

          </div>
          <div className="row">
            <div className="col-md-12 input">
              <input type ="text" className="inputDomain" onChange={this.handleInput} placeholder=" Domain Name"></input><span className="intro">.zendesk.com</span>
            </div>
          </div>
          <br/>

          <div className="row">
            <div className="col-md-12 submit">
              <button className="myButton" onClick={this.handleSignIn}> Sign In</button>
            </div>
          </div>
          <br/>
          <hr/>

        </div>



    );
  }
}


export default App;
