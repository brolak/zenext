import React, {Component} from 'react';
import TimeAgo from 'react-timeago';

class SingleTicket extends Component {

    click = () => {
      window.chrome.tabs.create({ url: 'http://'+this.props.domain+'zenext.zendesk.com/agent/tickets/'+this.props.id });
    }

    render() {
        return (
            <div class="ticket" onClick={this.click}>
                <table className="tickets">
                    <tr className="upper-title">
                        <td className="ticketSubject align-left">{this.props.subject}</td>
                        <td className="ticketRequester align-right">{this.props.requester}</td>
                    </tr>
                    <tr className="lower-desc">
                        <td className="ticketDesc align-left">{this.props.description}</td>
                        <td className="ticketTime align-right"><TimeAgo date={this.props.created_at}/></td>
                    </tr>
                </table>
                <hr/>
            </div>
        )
    }
}
// onClick="window.open('https://facebook.com','mywindow');"

export default SingleTicket;

{/* <div className="ticketSubject">{this.props.subject}</div>
<div>{this.props.status}</div>
<div className="ticketDesc">{this.props.description}</div> */
}
