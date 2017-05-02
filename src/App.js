import React, {Component} from 'react';
import logo from './assets/logo.png';
import preloader from './assets/preloader.gif';
import settings from './assets/settings.png';

import power from './assets/power.png'
import Toggle from 'react-toggle'
import ReactTooltip from 'react-tooltip'

//import exit from './assets/exit.png'

import axios from 'axios';
import Tickets from './components/Tickets';
import './App.css';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ticketsArr: [],
            newTickets: 0,
            zendeskDomain: "",
            //1-online, 2-offline, 3-unauthorized, 4-loading
            userStatus: 2
        };
    }
    //before component load update the state to
    componentWillMount = () => {
        window.chrome.storage.local.get((cb) => {
            console.log(cb);
            if (cb.zendeskDomain) {
                this.setState(
                  {
                    ticketsArr: cb.ticketsArr,
                    newTickets: cb.newTickets,
                    userStatus: 1,
                    zendeskDomain:cb.zendeskDomain,
                    defaultViewID:cb.defaultViewID,
                  })
            }
        })
    }
    //bind event to catch changes in local storage
    componentDidMount = () => {
        window.chrome.storage.onChanged.addListener((NewStore) => {
            console.log("changes in local storage" , NewStore)
            if (NewStore.ticketsArr.newValue){
              this.setState({
                ticketsArr:NewStore.ticketsArr.newValue ,
                newTickets:NewStore.ticketsArr.newValue.length
              })
            }
        });
    }

    //making an API call and creating the view list array
    createViewList = (domain) => {
      //set up the views list in local storage
      axios.get('https://'+domain+'.zendesk.com/api/v2/views/compact')
      .then((response) => {
          console.log("api view list" ,response);
          this.setState(
            {
              viewListArr: response.data.views,
              defaultViewID:response.data.views[0].id
            })
            //set the local storage with the default view id
            window.chrome.storage.local.set({
              defaultViewID:response.data.views[0].id,
              viewListArr:response.data.views
            });
            this.createTicketList(response.data.views[0].id);
      }).catch((error) => {
          console.log(error);
          this.setState({userStatus: 3})
      });
    }

    //making an API call and creating the ticket list array
    createTicketList = (defaultViewID) => {
      axios.get('https://'+this.state.zendeskDomain+'.zendesk.com/api/v2/views/'+defaultViewID+'/execute.json?per_page=60&page=1&sort_by=id&sort_order=desc&group_by=+&include=via_id')
      .then((response) => {
          //update the state
          this.setState({userStatus: 4});
          setTimeout(() => {
              //update the state
              this.setState(
                {
                ticketsArr: response.data.rows,
                newTickets: response.data.count,
                userStatus: 1
                });
          }, 4000);
          //update the badge counter
          window.chrome.browserAction.setBadgeText({
              text: String(response.data.count)
          });
          //  update the local storage
          window.chrome.storage.local.set({
            ticketsArr: this.state.ticketsArr,
             newTickets: this.state.newTickets,
             zendeskDomain: this.state.zendeskDomain});
      })
      .catch((error) => {
          console.log(error);
      });
    }

    handleSignIn = (e) => {
      e.preventDefault();
      this.createViewList(this.state.zendeskDomain);

    }

    handleInput = (e) => {
        console.log("print")
        this.setState({zendeskDomain: e.target.value})
    }

    logout = () => {
        window.chrome.storage.local.clear();
        window.chrome.browserAction.setBadgeText({text: ''});
        this.setState({userStatus: 2})
    }
    //update background JS to stop sending desktop notification to this user
    toggleNotifications = () => {
        window.chrome.storage.local.get(null,function(storage){
            window.chrome.storage.local.set({
                notificationSetting: !storage.notificationSetting
            });
        })
    }



    settings = () => {}

    //updating the default view for the user
    updateDefaultView = (viewID) => {

    }

    updateTickets = () => {

    }


    render() {
        //check user is logged in
        if (this.state.userStatus == 1) {
            return (
                <div className="container">
                    <div className="row">

                        <div className="col-md-12 navbar">
                            <table width="100%">
                                <tr>
                                    <td className="align-left"><img src={logo} className="App-logo" alt="logo"/></td>
                                    <td className="align-right">
                                            <ReactTooltip place="bottom" type="info" effect="solid" class="toggle"/>
                                            <span align="left" data-tip="Toggle notification ON or OFF">
                                            <Toggle defaultChecked={this.state.notifyme} onChange={this.handleBaconChange} />
</span>
                                      &nbsp;&nbsp;
                                      <a href=""><img src={power} className="exit-logo" data-tip="Logout" onClick={this.logout} /></a>
                                    </td>
                                </tr>
                            </table>
                        </div>

                        <hr/>
                        <Tickets newTickets={this.state.newTickets} tickets={this.state.ticketsArr} domain={this.state.zendeskDomain}/>
                    </div>
                </div>
            )
        }
        if (this.state.userStatus == 2) {
            return (

                <div className="container">
                    <div className="row">
                        <div className="col-md-12 navbar" data-tip="hello world">
                            <img src={logo} className="App-logo" alt="logo"/>
                        </div>
                        <hr/>
                        <h3 className="title">Hello There Agent</h3>
                        <p className="intro">
                            Please sign in with your Zendesk account to start getting real time notification on new tickets
                        </p>

                    </div>
                    <div className="row">
                        <div className="col-md-12 input">
                            <input type="text" className="inputDomain" onChange={this.handleInput} placeholder=" Domain Name"></input>
                            <span className="intro">.zendesk.com</span>
                        </div>
                    </div>
                    <br/>

                    <div className="row">
                        <div className="col-md-12 submit">
                            <button className="myButton" onClick={this.handleSignIn}>
                                Sign In</button>
                        </div>
                    </div>
                    <br/>
                    <hr/>

                </div>
            );
        }
        if (this.state.userStatus == 3) {
            return (
                <div >oops seems like you have problem logging in, please check your zendesk account is logged in and then try again</div>
            )
        }
        if (this.state.userStatus == 4) {
            return (
                    <div className="preloader">
                      <img className="preloaderImg" src={preloader}/>
                      <div className="preloaderText">LOADING YOUR ZENDESK ACCOUNT</div>
                    </div>
            )
        }
    }
}

export default App;
