import React, {Component} from 'react';

class OpenTicketCounter extends Component {
    render() {
        return (
            <div className={'counterDiv ' + (this.props.newTickets == 0
                ? 'noTickets'
                : '')}>
                <div className="counterBorder">
                    <div className="openTicketCounterInteger">
                        {this.props.newTickets}
                    </div>
                    <div className="openTicketCounterString">TICKETS</div>
                </div>
            </div>
        )
    }
}
export default OpenTicketCounter;
