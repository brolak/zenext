import React, {Component} from 'react';

class OpenTicketCounter extends Component {
    render() {
        return (
            <div className="counterDiv">

                <div className="counterBorder">
                    <div className="openTicketCounterInteger">
                        {this.props.newTickets}
                    </div>
                    <div className="openTicketCounterString">OPEN TICKETS</div>
                </div>

            </div>
        )
    }
}

export default OpenTicketCounter;
