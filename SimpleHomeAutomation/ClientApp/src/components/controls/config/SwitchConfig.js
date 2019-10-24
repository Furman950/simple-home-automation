import React, { Component } from 'react';
import { Form, Col } from 'react-bootstrap';

export default class SwitchConfig extends Component {
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
                    <Form.Label>Label for Switch</Form.Label>
                    <Form.Control placeholder="Default 'Switch'" onChange={this.onChange} name="label" />
                </Form.Group>
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Label>On switch turn on publish message</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Default is ON"
                            onChange={this.onChange}
                            name="onPublishMessage"
                        />
                    </Form.Group>

                    <Form.Group as={Col}>
                        <Form.Label>On switch turn off publish message</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Default is 'OFF'"
                            onChange={this.onChange}
                            name="offPublishMessage"
                        />
                    </Form.Group>
                </Form.Row>
            </div>
        )
    }
}