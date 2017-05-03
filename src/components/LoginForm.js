import React, {Component} from 'react';
import '../App.css';

class LoginForm extends Component {
    constructor() {
        super();
        this.state = {};
    }
    _handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.setState({clicked: true})
            setTimeout(() => {
                this.props.handleSignIn(e)
            }, 100);
        }
    }
    render() {
        return (
            <div>
                <div className="row">
                    <h3 className="title">Hello Agent,</h3>
                    <p className="intro">
                        Please sign in with your Zendesk account
                        <br/>
                        and enter your domain to begin
                    </p>
                </div>

                <div className="row">
                    <div className="col-md-12 input">
                        <input type="text" className="inputDomain" onChange={this.props.handleInput} onKeyPress={this._handleKeyPress} placeholder="Zendesk Domain"></input>
                        <span className="intro">.zendesk.com</span>
                    </div>
                </div>
                <br/>

                <div className="row">
                    <div className="col-md-12 submit">
                        <button className={'myButton ' + (this.state.clicked
                            ? 'blue'
                            : '')} onClick={this.props.handleSignIn}>
                            LAUNCH
                        </button>
                    </div>
                </div>
                <br/>
                <hr/>
            </div>
        );
    }
}

export default LoginForm;
