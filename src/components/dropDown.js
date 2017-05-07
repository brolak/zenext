import React, {Component} from 'react';

class DropDown extends Component {

    constructor(props) {
        super(props);

        this.state = {
            value: this.props.defaultViewTitle
        };

    }

    onChange(e) {
        this.setState({value: e.target.value})
        this.props.changeView(e.target.value)
    }
    render() {
        console.log("current view", this.state.value)
        return (
            <div className="form-group">
                <select value={this.state.value} onChange={this.onChange.bind(this)} className="form-control">
                    {this.props.viewsArr.map(option => {
                        return <option value={option.title} id={option.id} key={option.id}>{option.title}</option>
                    })}
                </select>
            </div>

        )
    }
}

export default DropDown;
