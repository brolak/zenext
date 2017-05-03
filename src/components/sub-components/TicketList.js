import React, {Component} from 'react';
import SingleTicket from './SingleTicket';
import noTicketsAnimation from './rocketGif.gif'


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

                      <div className="preloader">
                        <div className="preloaderText">
                        No tickets.. you rock!
                        </div>
                      <img className="rocketImage" src={noTicketsAnimation}/>
                      </div>
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
// <span text-align="center">No tickets - all good :)</span>
