import React, { Component } from 'react';
import { publishMessage } from '../../services/APICalls';

export class Button extends Component {

    constructor(props) {
        super(props);
    }

    onClick = () => {
        publishMessage(this.props.topic, this.props.message)
            .then(res => {
                console.log(res.re)
                console.log(res);
            })
            .catch(err => {

                console.log(err);
            });
    }

    render() {
        return (
            <div>
                <p>Button</p>
                <button
                    onClick={this.onClick}
                >{this.props.label}</button>
            </div>

        )
    }
}