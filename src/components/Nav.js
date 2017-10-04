import React, {Component} from 'react';
import exit from '../assets/power.png';
import logo from '../assets/logoNEW.png';
import notifyOn from '../assets/notifyOn.svg';
import notifyOff from '../assets/notifyOff.svg';
import notifySound from '../assets/notifySound.svg';
import '../App.css';
//icons color #d8d8d8
class Nav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notificationSetting: 0
        }
    }
    //setting the state to be aligned with the local storage on notification settings
    componentDidMount = () => {
        window.chrome.storage.local.get((storage) => {
            if (storage.zendeskDomain) {
                this.setState({
                    notificationSetting: storage.notificationSetting || 0
                })
            }
        })
    }
    //toggle chrome desktop notifications
    toggleNotifications = () => {
        let notify = this.state.notificationSetting + 1;
        if (notify > 2) {
            notify = 0;
        }
        window.chrome.storage.local.set({notificationSetting: notify});
        this.setState({notificationSetting: notify});
        setTimeout(() => {
            this.alertMsg.classList.remove('fade-out');
            this.alertMsg.classList.remove('init-fade');
            setTimeout(() => {
                this.alertMsg.classList.add('fade-out');
            }, 0)
        }, 0)
    }
    render() {
        let buttons;
        let notifyButton;
        let msg;
        switch (this.state.notificationSetting) {
            case 0:
                notifyButton = notifySound;
                msg = "SOUND ON"
                break;
            case 1:
                notifyButton = notifyOn;
                msg = "SOUND OFF"
                break;
            case 2:
                notifyButton = notifyOff;
                msg = "NOTIFICATIONS OFF"
        }
        console.log("notification", this.state.notificationSetting)
        if (this.props.hasButtons) {
            buttons = (
                <td className="align-right">
                    <img src={notifyButton} className="settings-logo"
                      onClick={this.toggleNotifications}/>
                    <img src={exit} className="exit-logo"
                       alt="Sign out" title="Logout"
                       onClick={this.props.logout}/>
                </td>
            )
        }
        return (
            <div className="row">
                <div className="col-md-12 topNavbar navbar">
                    <table width="100%" className="header-table">
                        <tr>
                            <td className="align-left"><img src={logo}
                              className="App-logo" alt="logo"/></td>
                            <td className="align-center">
                                <span className="init-fade"
                                  ref={(value) => this.alertMsg = value}>
                                  {msg}
                                </span>
                            </td>
                            {buttons}
                        </tr>
                    </table>
                </div>
                <hr/>
            </div>
        );
    }
}
export default Nav;
