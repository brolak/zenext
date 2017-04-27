import React, {Component} from 'react';
import SingleTicket from './SingleTicket';
import TimeAgo from 'react-timeago';
import './App.css';

class TicketList extends Component {
    render() {
        let sortedArr = this.props.tickets.sort((a, b) => b.id - a.id)
        let items = sortedArr.map(function(ticket) {
            return (<SingleTicket key={ticket.ticketID} description={ticket.description} subject={ticket.subject} status={ticket.status} requester_id={ticket.requester_id} created_at={ticket.created_at} requester={ticket.via.source.from.name}/>)
        })
        return (
            <div className="container">
                <div className="row">
                    <div className="ticketList">
                        {/* <ul className="itemList"> */}
                        {items}
                        {/* </ul> */}
                    </div>
                </div>
            </div>
        )
    }
}

export default TicketList;
