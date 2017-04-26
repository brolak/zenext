import React, {Component} from 'react';
import logo from './logo.png';
import OpenTicketCounter from './OpenTicketCounter';
import TicketList from './TicketList';
import './App.css';

class Tickets extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ticketsArr: [
                {
                    ticketID: 1,
                    subject: "Failed API",
                    created_at : "2017-04-26T15:34:32Z",
                    description: "Wow I how I wish your API would actually work and be a failure.",
                    url: "https://zenext.zendesk.com/api/v2/tickets/6.json",
                    status: "new",
                    requester_id: "Assaf"
                }, {
                    ticketID: 2,
                    subject: "Image Broken Please Help!",
                    created_at: "2017-03-25T08:34:32Z",
                    description: "Mati, here is the image that doesn't work. Can you please take a look?",
                    url: "https://zenext.zendesk.com/api/v2/tickets/6.json",
                    status: "open",
                    requester_id: "Guy"
                }, {
                    ticketID: 3,
                    subject: "Looking for a developer?",
                    created_at: "2017-04-25T08:34:32Z",
                    description: "Hello to the CTO of ZeNext (Assaf).",
                    url: "https://zenext.zendesk.com/api/v2/tickets/6.json",
                    status: "deleted",
                    requester_id: "Mati"
                }, {
                    ticketID: 4,
                    subject: "Do you believe in Jesus?!",
                    created_at: "2017-04-23T08:34:32Z",
                    description: "test description4",
                    url: "https://zenext.zendesk.com/api/v2/tickets/6.json",
                    status: "deleted",
                    requester_id: "Tal"
                }
            ],
            newTasks: 1,
            zendeskDomain: "zenext"
        };
    }
    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-12 navbar">
                        <img src={logo} className="App-logo" alt="logo"/>
                    </div>
                    <hr/>
                </div>
                <OpenTicketCounter newTickets={this.state.newTasks}/>
                <TicketList tickets={this.state.ticketsArr}/>
                <br/>
            </div>
        );
    }
}

export default Tickets;
