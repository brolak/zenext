import React, {Component} from 'react';
import logo from '../assets/logo.png';
import '../App.css';

class NoButtonNav extends Component {

    render() {
        return (
            <div className="row">
                <div className="col-md-12 navbar">
                    <table width="100%">
                        <tr>
                            <td className="align-left"><img src={logo} className="App-logo" alt="logo"/></td>
                        </tr>
                    </table>
                </div>
                <hr/>        
            </div>
        );
    }
}

export default NoButtonNav;
