import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';

export default class ErrorAlert extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Alert variant="danger" onClose={this.props.close} dismissible>
                <Alert.Heading>{this.props.header}</Alert.Heading>
                {this.props.body}
            </Alert>
        )
    }
}