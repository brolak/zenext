import React, { Component } from 'react';
import logo from './logo.png';
import './App.css';

class App extends Component {





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
            <div className="col-md-12 navbar">
            <div className="col-md-6 input">
              <input type ="text" className="inputDomain" placeholder="Domain Name"></input>
            </div>
            <div className="col-md-6 ">
              <p className="intro">zendesk.com</p>
            </div>
          </div>
          </div>
        </div>



    );
  }
}


export default App;
