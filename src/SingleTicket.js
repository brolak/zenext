import React, {Component} from 'react';
import TimeAgo from 'react-timeago';
import './App.css';

class SingleTicket extends Component {
    render() {
        return (
            <div>
                <table width="100%" className="tickets">
                    <tr>
                        <td className="ticketSubject">{this.props.subject}</td>
                        <td className="ticketRequester">{this.props.requester}</td>
                    </tr>
                    <tr>
                        <td className="ticketDesc">{this.props.description}</td>
                        <td className="ticketTime"><TimeAgo date={this.props.created_at}/></td>
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
