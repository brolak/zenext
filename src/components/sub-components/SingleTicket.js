import React, {Component} from 'react';
import TimeAgo from 'react-timeago';

class SingleTicket extends Component {

    findAndOpenTab = (ticketId, domain) => {
        window.chrome.tabs.getAllInWindow( (cb) => {
            const re = /zendesk\.com\/agent\//
            let tab = cb.filter(function ( obj ) {
                return obj.url.match(re);
            })[0];
            //return first matching tab based on url
            //if there is one update that tab's url based on ticket id
            if(tab){
                window.chrome.tabs.update(tab.id, {url:"https://"+domain+".zendesk.com/agent/tickets/"+ticketId, active:true}, function (cb){
                    window.chrome.windows.update(cb.windowId, {focused: true});
                })
            } else {
            //otherwise open new tab base on ticket id
                window.chrome.tabs.create({url:"https://"+domain+".zendesk.com/agent/tickets/"+ticketId, active:true}, function (cb){
                    window.chrome.windows.update(cb.windowId, {focused: true});
                })
            }
        })
    }

    click = () => {
        this.findAndOpenTab(this.props.id, this.props.domain);
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
