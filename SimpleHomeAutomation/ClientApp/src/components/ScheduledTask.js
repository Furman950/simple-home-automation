import React, { Component } from 'react';
import { Container } from 'reactstrap';

export default class ScheduledTask extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Container className="scheduled-task-container">
                <p>{this.props.scheduledTask.name}</p>
                <p>Topic: {this.props.scheduledTask.mqttMessage.topic}</p>
                <p>Message: {this.props.scheduledTask.mqttMessage.message}</p>
            </Container>
        )
    }
}