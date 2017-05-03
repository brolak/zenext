import React, {Component} from 'react';
import mute from '../assets/alarm.png';
import muted from '../assets/alarmno.png'
import exit from '../assets/power.png';
import logo from '../assets/logo.png';
import '../App.css';

class Nav extends Component {

  constructor(props) {
      super(props);
        this.state ={
          notificationSetting : ''
      }
    }

    //setting the state to be aligned with the local storage on notification settings
    componentWillMount = () => {
      window.chrome.storage.local.get((storage) => {
            this.setState({notificationSetting: storage.notificationSetting})
      })
    }

     //toggle chrome desktop notifications
    toggleNotifications = () => {
      console.log("tetet")
      window.chrome.storage.local.set({
                notificationSetting: !this.state.notificationSetting
            });
      this.setState({notificationSetting: !this.state.notificationSetting});

    }


    render() {
      let buttons;
        if (this.props.hasButtons){
          buttons= (<td className="align-right">
                      <img src={(this.state.notificationSetting) ? mute : muted} className="settings-logo" alt="settings" onClick={this.toggleNotifications}/>
                      <img src={exit} className="exit-logo" alt="Sign out" onClick={this.props.logout}/>
                    </td>)
                  }
        return (
            <div className="row">
                <div className="col-md-12 navbar">
                    <table width="100%">
                        <tr>
                            <td className="align-left"><img src={logo} className="App-logo" alt="logo"/></td>
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
