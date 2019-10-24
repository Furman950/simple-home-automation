import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { publishMessage } from '../../services/APICalls';

export default class OnOff extends Component {
    constructor(props) {
        super(props);
        let label, onPublishMessage, offPublishMessage, topic;

        if (this.props.data === undefined || this.isEmpty(this.props.data)) {
            label = "On/Off";
            onPublishMessage = "ON";
            offPublishMessage = "OFF";
        }
        else {
            label = this.props.data.label ? this.props.data.label : "On/OFF";
            onPublishMessage = this.props.data.onPublishMessage ? this.props.data.onPublishMessage : "ON";
            offPublishMessage = this.props.data.offPublishMessage ? this.props.data.offPublishMessage : "OFF";
            topic = this.props.data.topic;
        }

        this.state = {
            on: false,
            label: label,
            onPublishMessage: onPublishMessage,
            offPublishMessage: offPublishMessage,
            topic: topic
        }
    }

    isEmpty = (obj) => Object.entries(obj).length === 0 && obj.constructor === Object

    publishOn = () => {
        console.log(this.state)
        publishMessage(this.state.topic, this.state.onPublishMessage)
            .then(res => console.log(res));
    }

    publishOff = () => {
        publishMessage(this.state.topic, this.state.offPublishMessage)
            .then(res => console.log(res));
    }

    render() {
        return (
            <div className={this.props.theClasses}>
                <p className="text-center">{this.state.label}</p>
                <Row>
                    <Col md={6} className="text-center">
                        <button
                            onClick={this.publishOn}
                            disabled={this.props.disabled}
                        >
                            On
                        </button>
                    </Col>
                    <Col md={6} className="text-center">
                        <button
                            onClick={this.publishOff}
                            disabled={this.props.disabled}
                        >
                            Off
                        </button>
                    </Col>
                </Row>
            </div>
        )
    }
}

OnOff.defaultProps = {
    disabled: false,
}