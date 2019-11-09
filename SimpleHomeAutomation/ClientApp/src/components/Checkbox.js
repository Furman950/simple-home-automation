import React, { Component } from 'react';
import { Form } from 'react-bootstrap';

export default class Checkbox extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Form.Check
                label={this.props.label}
                type="checkbox"
                disabled={this.props.disabled ? 'disabled' : ''}
                onClick={this.props.onClick}
                name={this.props.name}
                value={this.props.value} />
        );
    }
}