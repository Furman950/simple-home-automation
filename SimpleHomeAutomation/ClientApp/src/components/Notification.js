import React, { Component } from 'react';
import Toast from 'react-bootstrap/Toast';

export default class Notification extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Toast className="notification" show={this.props.show} onClose={this.props.close} delay={5000} autohide>
                <Toast.Header>
                    <strong className="mr-auto">{this.props.header}</strong>
                </Toast.Header>
                <Toast.Body>{this.props.body}</Toast.Body>
            </Toast>
        )
    }
}