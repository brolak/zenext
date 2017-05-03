import React, {Component} from 'react';
import OpenTicketCounter from './OpenTicketCounter.js';
import TicketList from './sub-components/TicketList';

class Tickets extends Component {

    render() {
        return (

                <div className="row ticketsContainer">
                    <div className="navbar">
                      
                        <OpenTicketCounter newTickets={this.props.newTickets}/>
                        <TicketList domain={this.props.domain} tickets={this.props.tickets}/>
                    </div>
                </div>

        );
    }
}

export default Tickets;
