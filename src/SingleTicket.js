import React, {Component} from 'react';
import TimeAgo from 'react-timeago';
import './App.css';

class SingleTicket extends Component {
    render() {
        return (
            <div>
                <table width="100%" className="tickets">
                    <tr>
                        <td className="ticketSubject align-left">{this.props.subject}</td>
                        <td className="ticketRequester align-right">{this.props.requester}</td>
                    </tr>
                    <tr>
                        <td className="ticketDesc align-left">{this.props.description}</td>
                        <td className="ticketTime align-right"><TimeAgo date={this.props.created_at}/></td>
                    </tr>
                </table>
                <hr/>
            </div>
        )
    }
}

export default SingleTicket;

{/* <div className="ticketSubject">{this.props.subject}</div>
<div>{this.props.status}</div>
<div className="ticketDesc">{this.props.description}</div> */
}
