import React, {Component} from 'react';
import OpenTicketCounter from './OpenTicketCounter.js';
import TicketList from './sub-components/TicketList';

class Tickets extends Component {
    render() {
        return (
            <div className="row ticketsContainer">
                <div className="navbar">
                    <OpenTicketCounter newTickets={this.props.newTickets}/>
                    <TicketList
                       requestersArr={this.props.requestersArr}
                       domain={this.props.domain}
                       tickets={this.props.tickets}
                       newTickets={this.props.newTickets}/>
                </div>
            </div>
        );
    }
}
export default Tickets;
