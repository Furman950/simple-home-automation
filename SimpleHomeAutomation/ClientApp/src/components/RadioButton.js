import React, { Component } from 'react';
import { Form } from 'react-bootstrap';

export default class RadioButton extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Form.Check
                label={this.props.label}
                type="radio"
                name={this.props.name}
                value={this.props.value}
                checked={this.props.checked}
                onClick={this.props.onClick} />
        );
    }
}