import React, {Component} from 'react';
import preloader from './assets/preloader.gif';
import settings from './assets/settings.png';
import power from './assets/power.png'
import Toggle from 'react-toggle'
import ReactTooltip from 'react-tooltip'
import axios from 'axios';
import Tickets from './components/Tickets';
import Nav from './components/Nav';
import NoButtonNav from './components/NoButtonNav';
import LoginForm from './components/LoginForm';
import './App.css';

class App extends Component {

    constructor(props) {
        super(props);
        //set initial state
        this.state = {
            ticketsArr: [],
            newTickets: 0,
            zendeskDomain: "",
            userStatus: 2
            //1-online, 2-offline, 3-unauthorized, 4-loading
        }
        //listener for changes in local storage tickets from bg calls
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

    componentWillMount = () => {
        window.chrome.storage.local.get((cb) => {
            if (cb.zendeskDomain && cb.defaultViewID) {
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

    componentDidMount = () => {
        //if user isn't logged in and opens ext
        //this will start detecting for an open zendesk tab
        if(this.state.userStatus == 2){
            this.detectTab();
        }
        
    }

    //function for detecting open zendesk tab
    //can be used to find viewId
    //and domain, but not implemented...
    detectTab = () => {
        window.chrome.tabs.getAllInWindow(null, function(cb){
            let re = /zendesk\.com\/agent\/filters\//
            let result = cb.filter(function ( obj ) {
                return obj.url.match(re);
            })[0];
            if(result){
                let reViewId = /\w+$/;
                let viewId= result.url.match(reViewId)[0];
                console.log("found tab and viewId",result,viewId);
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
          //set the user's state to loading
          this.setState({userStatus: 4});
          setTimeout(() => {
              //after a 'loading period' set user to online
              this.setState(
                {
                ticketsArr: response.data.rows,
                newTickets: response.data.count,
                userStatus: 1
                });
          }, 4000);
          //if ticket count is 0, empty badge
          if(response.data.count == 0){
               window.chrome.browserAction.setBadgeText({
                    text: ''
                });
            }else {
            //otherwise change badge to reflect ticket #
                window.chrome.browserAction.setBadgeText({
                    text: String(response.data.count)
                });
            }
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
        this.setState({zendeskDomain: e.target.value})
    }

    //function for logging out
    //clear all storage and change user status
    logout = () => {
        window.chrome.storage.local.clear();
        window.chrome.browserAction.setBadgeText({text: ''});
        this.setState({userStatus: 2})
    }

    //toggle chrome desktop notifications
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

    //switch zendesk domain
    changeDomain = (domain) => {

    }


    //render function for user online status
    renderOnline() {
        return (
            <div className="container">
                <Nav logout={this.logout}/>
                <Tickets newTickets={this.state.newTickets} tickets={this.state.ticketsArr} domain={this.state.zendeskDomain}/>
            </div>
        )
    }

    //render function for user offline status
    renderOffline(){
        return (
            <div className="container">
                <NoButtonNav/>
                <LoginForm handleInput={this.handleInput} handleSignIn={this.handleSignIn}/>
            </div>
        )
    }

    //render function for user unauthorized status
    renderUnauthorized() {
        return (
            <div className="container">
                <Nav logout={this.logout}/>
                <div >There was a problem logging in, please check your zendesk account is logged in and then try again
                </div>
            </div>
        )
    }

    //render function for user loading status
    renderLoading(){
        return (
            <div className="container">
                <NoButtonNav/>
                <div className="preloader">
                <img className="preloaderImg" src={preloader}/>
                    <div className="preloaderText">
                    LOADING YOUR ZENDESK ACCOUNT
                    </div>
                </div>
            </div>  
        )
    }

    render() {
        //main render- according to user status
        if (this.state.userStatus == 1) {
            return this.renderOnline()
        } else if (this.state.userStatus == 2) {
            return this.renderOffline()
        } else if (this.state.userStatus == 3) {
            return this.renderUnauthorized()
        } else if (this.state.userStatus == 4) {
            return this.renderLoading()
        }
    }
}

export default App;
