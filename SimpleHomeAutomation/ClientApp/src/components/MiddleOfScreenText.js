import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';

export default class MiddleOfScreenText extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Row>
                <Col>
                    <p className="text-color">{this.props.text}</p>
                </Col>
            </Row >
        )
    }
}