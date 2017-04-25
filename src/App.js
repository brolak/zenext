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
              <div className="col-md-12 navbar">
                <img src={logo} className="App-logo" alt="logo" />
              </div>

          </div>
        </div>



    );
  }
}


export default App;
