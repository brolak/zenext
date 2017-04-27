import React, {Component} from 'react';
import logo from './logo.png';
import OpenTicketCounter from './OpenTicketCounter';
import TicketList from './TicketList';
import './App.css';

class Tickets extends Component {

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="navbar">
                        <OpenTicketCounter newTickets={this.props.newTickets}/>
                        <TicketList domain={this.props.domain} tickets={this.props.tickets}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default Tickets;
