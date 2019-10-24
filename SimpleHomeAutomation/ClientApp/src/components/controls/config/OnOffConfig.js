import React, { Component } from 'react';
import { Form, Col } from 'react-bootstrap';

export default class OnOffConfig extends Component {
    constructor(props) {
        super(props);
    }

    onChange = e => {
        let key = e.target.name;
        let value = e.target.value;

        this.props.controlData(key, value);
    }

    render() {
        return (
            <div>
                <Form.Group>
                    <Form.Label>Label for Control</Form.Label>
                    <Form.Control placeholder="Default 'On/Off'" onChange={this.onChange} name="label" />
                </Form.Group>
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Label>On button publish message</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Default is 'ON'"
                            onChange={this.onChange}
                            name="onPublishMessage"
                        />
                    </Form.Group>

                    <Form.Group as={Col}>
                        <Form.Label>Off button publish message</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Default is 'OFF'"
                            onChange={this.onChange}
                            name="offPublishMessage"
                        />
                    </Form.Group>
                </Form.Row>
            </div>
        );
    }
}