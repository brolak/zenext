import React, { Component } from 'react';
import logo from './logo.png';
import axios from 'axios'
import './App.css';

class App extends Component {

  constructor(props) {
      super(props);
      this.state = {
          ticketsArr: [],
          newTasks: 0,
          zendeskDomain:""
      };
      this.updateBadge = this.updateBadge.bind(this);
      this.newMessage = this.newMessage.bind(this);
  }


  componentWillMount = () =>{
    window.chrome.storage.local.get((cb) => {
      console.log(cb);
      if(cb.settings){
        this.setState({
          newTasks:cb.settings.newCounter
          })
      }
      else{
        console.log("logged out");
      }
    })
  }

  handleSignIn = (e) => {
    console.log("sign in")
    e.preventDefault();
    console.log("domain:" , this.state.zendeskDomain)
    axios.get('https://'+this.state.zendeskDomain+'.zendesk.com/api/v2/search.json?query=type:ticket%20status:new')
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  handleInput = (e) => {
    console.log("print")
    this.setState({
      zendeskDomain: e.target.value
    })
  }

  componentDidMount() {
    //dummy new message timer when extension opens
    this.messageTimer = setInterval(
      () => this.newMessage(),
      1000
    )
  }

  newMessage () {
    this.setState({newTasks: this.state.newTasks +=1});
    this.updateBadge();
  }

  updateBadge() {
    // window.chrome.browserAction.setBadgeText({text: String(this.state.newTasks)});
    // if(this.state.newTasks == 5){
    //   clearInterval(this.messageTimer);
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
