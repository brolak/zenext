import React, {Component} from 'react';
import SingleTicket from './SingleTicket';

class TicketList extends Component {
    render() {

        let items = this.props.tickets.map((ticket) => {
            var requesterIndex = this.props.requestersArr.findIndex(result => result.id == ticket.requester_id);
            var requesterName = this.props.requestersArr[requesterIndex].name
            return (
              <SingleTicket
              domain={this.props.domain}
              key={ticket.ticket.id}
              description={ticket.ticket.description}
              subject={ticket.ticket.subject}
              status={ticket.ticket.status}
              id={ticket.ticket.id}
              requester_id={ticket.requester_id}
              created_at={ticket.created}
              requester={requesterName}
              />
          )
        })

        if (this.props.newTickets == 0) {
            return (
                <div>
                  <br />
                    <span text-align="center">No tickets - all good :)</span>
                </div>
            )
        } else {

            return (
                <div>
                    <div className="row">
                        <div className="ticketList">
                            {items}
                        </div>
                    </div>
                </div>
            )
        }
    }
}
export default TicketList;
