import React, {Component} from 'react';
import SingleTicket from './SingleTicket';

class TicketList extends Component {
    render() {

        let items = this.props.tickets.map((ticket)=> {
            return (<SingleTicket domain={this.props.domain} key={ticket.ticket.id} description={ticket.ticket.description} subject={ticket.ticket.subject} status={ticket.ticket.status} id={ticket.ticket.id} requester_id={ticket.requester_id} created_at={ticket.created} requester="assaf"/>)
        })
        return (
            <div className="container">
                <div className="row">
                    <div className="ticketList">
                        {items}
                    </div>
                </div>
            </div>
        )
    }
}

export default TicketList;
