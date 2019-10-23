import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { publishMessage } from '../../services/APICalls';

export default class OnOff extends Component {
    constructor(props) {
        super(props);
        this.state = {
            on: false,
            topic: "testOnOff",
        }
    }

    publishOn = () => {
        publishMessage(this.state.topic, "ON")
            .then(res => console.log(res));
    }

    publishOff = () => {
        publishMessage(this.state.topic, "OFF")
            .then(res => console.log(res));
    }

    render() {
        console.log(this.props.disabled)
        return (
            <div className={this.props.theClasses}>
                <p className="text-center">{this.props.label}</p>
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
    label: "On/Off",
    disabled: false
}