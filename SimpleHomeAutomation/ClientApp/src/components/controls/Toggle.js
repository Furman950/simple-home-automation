import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { publishMessage } from '../../services/APICalls';

export default class Toggle extends Component {
    constructor(props) {
        super(props);
        let label, buttonLabel, publishMessage, topic;

        if (this.props.data === undefined || this.isEmpty(this.props.data)) {
            label = "Toggle";
            buttonLabel = "Toggle";
            publishMessage = "toggle";
        }
        else {
            label = this.props.data.label ? this.props.data.label : "Toggle";
            buttonLabel = this.props.data.buttonLabel ? this.props.data.buttonLabel : "Toggle";
            publishMessage = this.props.data.publishMessage ? this.props.data.publishMessage : "toggle";
            topic = this.props.data.topic;
        }

        this.state = {
            label: label,
            buttonLabel: buttonLabel,
            publishMessage: publishMessage,
            topic: topic
        }
    }

    isEmpty = (obj) => Object.entries(obj).length === 0 && obj.constructor === Object

    publish = () => {
        publishMessage(this.state.topic, this.state.publishMessage)
            .then(res => res.text())
            .then(res => console.log(res));
    }

    render() {
        return (
            <div className={this.props.theClasses}>
                <p className="text-center">{this.state.label}</p>
                <Row>
                    <Col className="text-center">
                        <button
                            onClick={this.publish}
                            disabled={this.props.disabled}
                        >
                            {this.state.buttonLabel}
                        </button>
                    </Col>
                </Row>
            </div>
        )
    }
}