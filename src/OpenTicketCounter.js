import React, {Component} from 'react';
import logo from './logo.png';
import axios from 'axios'
import './App.css';

class OpenTicketCounter extends Component {
    render() {
        return (
            <div>
                {/* <div className="row"> */}
                <div className="counterBorder">
                    <div className="openTicketCounterInteger">
                        {this.props.newTickets}
                    </div>
                    <div className="openTicketCounterString">OPEN TICKETS</div>
                </div>
                {/* </div> */}
                <hr/>
            </div>
        )
    }
}

export default OpenTicketCounter;
