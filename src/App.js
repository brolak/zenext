import React, {Component} from 'react';
import logo from './logo.png';
import settings from './settings.png';
import exit from './exit.png'
import axios from 'axios';
import Tickets from './Tickets';
import './App.css';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ticketsArr: [],
            newTickets: 0,
            zendeskDomain: "",
            //1-online, 2-offline, 3-unauthorized
            userStatus: 2
        };
    }

    componentWillMount = () => {

        window.chrome.storage.local.get((cb) => {
            console.log(cb);
            if (cb.zendeskDomain) {
                this.setState({ticketsArr: cb.ticketsArr, newTickets: cb.newTickets, userStatus: 1})
                window.chrome.browserAction.setBadgeText({
                    text: String(cb.ticketsArr.length)
                });

            } else {
                console.log("logged out");
            }
        });
    }

    handleSignIn = (e) => {
        console.log("sign in")
        e.preventDefault();
        console.log("domain:", this.state.zendeskDomain)
        axios.get('https://' + this.state.zendeskDomain + '.zendesk.com/api/v2/search.json?query=type:ticket%20status:open%20status:new').then((response) => {
            console.log(response);
            //update the state
            this.setState({ticketsArr: response.data.results, newTickets: response.data.count, userStatus: 1});
            //update the badge counter
            window.chrome.browserAction.setBadgeText({
                text: String(response.data.count)
            });
            //  update the local storage
            window.chrome.storage.local.set({ticketsArr: this.state.ticketsArr, newTickets: this.state.newTickets, zendeskDomain: this.state.zendeskDomain});
        }).catch((error) => {
            console.log(error);
            this.setState({userStatus: 3})
        });

    }

    handleInput = (e) => {
        console.log("print")
        this.setState({zendeskDomain: e.target.value})
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
                                        <a href=""><img src={settings} className="settings-logo" alt="settings"/></a>&nbsp;&nbsp;&nbsp;
                                        <a href=""><img src={exit} className="exit-logo" alt="Sign out"/></a>
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <hr/>
                        <Tickets newTickets={this.state.newTickets} tickets={this.state.ticketsArr}/>
                    </div>
                </div>

            )

        } else if (this.state.userStatus == 2) {
            return (

                <div className="container">
                    <div className="row">
                        <div className="col-md-12 navbar">
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
        } else if (this.state.userStatus == 3) { < div > oops seems like you have problem logging in < /div>
    }

  }
}



export default App;
