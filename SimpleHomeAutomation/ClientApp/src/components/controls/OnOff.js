import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';

export default class OnOff extends Component {
    constructor(props) {
        super(props);
        this.state = {
            on: false,
        }
    }

    render() {
        return (
            <div className={this.props.theClasses}>
                <p className="text-center">{this.props.label}</p>
                <Row>
                    <Col md={6} className="text-center">
                        <button>On</button>
                    </Col>
                    <Col md={6} className="text-center">
                        <button>Off</button>
                    </Col>
                </Row>
            </div>
        )
    }
}

OnOff.defaultProps = {
    label: "On/Off"
}