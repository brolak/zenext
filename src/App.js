import React, { Component } from 'react';
import logo from './logo.png';
import axios from 'axios';
import Tickets from './Tickets';
import './App.css';

class App extends Component {

  constructor(props) {
      super(props);
      this.state = {
          ticketsArr: [],
          newTickets: 0,
          zendeskDomain:"",
          userOnline:false
      };
      // this.updateBadge = this.updateBadge.bind(this);
      // this.newMessage = this.newMessage.bind(this);
  }


  componentWillMount = () => {

    window.chrome.storage.local.get((cb) => {
      console.log(cb);
      if(cb.zendeskDomain){
        this.setState({
          ticketsArr: cb.ticketsArr,
          newTickets: cb.newTickets,
          userOnline:true
          })
      }
      else{
        console.log("logged out");
      }
    });
  }

  handleSignIn = (e) => {
    console.log("sign in")
    e.preventDefault();
    console.log("domain:" , this.state.zendeskDomain)
    axios.get('https://'+this.state.zendeskDomain+'.zendesk.com/api/v2/search.json?query=type:ticket%20status:open%20status:new')
      .then( (response) => {
        console.log(response);
        //update the state
        this.setState({
          ticketsArr: response.data.results,
          newTickets: response.data.count,
          userOnline:true
        });
        //update the local storage
        window.chrome.storage.local.set(
          {
            ticketsArr: this.state.ticketsArr,
            newTickets: this.state.newTickets,
            zendeskDomain:this.state.zendeskDomain
          }
        ,function(){
      	//callback
      });
    })
      .catch( (error) => {
        console.log(error);
      });
  }

  handleInput = (e) => {
    console.log("print")
    this.setState({
      zendeskDomain: e.target.value
    })
  }

  render() {
    //check user is logged in
    if(this.state.userOnline){
      return (
        <div className="container">
          <div className="row">
            <div className="col-md-12 navbar">
              <img src={logo} className="App-logo" alt="logo" />
            </div>
              <hr/>
          <Tickets newTickets={this.state.newTickets} tickets={this.state.ticketsArr}/>
          </div>
        </div>

          )

    }
    else{
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
}



export default App;
