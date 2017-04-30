import React, {Component} from 'react';
import SingleTicket from './SingleTicket';
import TimeAgo from 'react-timeago';
import './App.css';

class TicketList extends Component {
    render() {
        let sortedArr = this.props.tickets.sort((a, b) => b.id - a.id)
        console.log(sortedArr)
        let items = sortedArr.map((ticket)=> {
            return (<SingleTicket domain={this.props.domain} key={ticket.ticket.id} description={ticket.ticket.description} subject={ticket.ticket.subject} status={ticket.ticket.status} id={ticket.ticket.id} requester_id={ticket.requester_id} created_at={ticket.created} requester="assaf"/>)
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
