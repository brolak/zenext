import React, {Component} from 'react';
import SingleTicket from './SingleTicket';
import TimeAgo from 'react-timeago';
import './App.css';

class TicketList extends Component {
    render() {
        let items = this.props.tickets.map(function(ticket) {
            return (<SingleTicket key={ticket.ticketID} description={ticket.description} subject={ticket.subject} status={ticket.status} requester_id={ticket.requester_id} created_at={ticket.created_at}/>)
        })
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-12 ticketList">
                        <ul className="itemList">
                            {items}
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

export default TicketList;
