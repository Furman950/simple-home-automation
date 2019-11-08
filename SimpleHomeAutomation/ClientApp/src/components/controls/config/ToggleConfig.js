import React, { Component } from 'react';
import { Form, Col } from 'react-bootstrap';

export default class ToggleConfig extends Component {
    constructor(props) {
        super(props);
    }

    onChange = e => {
        let key = e.target.name;
        let value = e.target.value;

        this.props.addControlData(key, value);
    }

    render() {
        return(
            <div>
                <Form.Group>
                    <Form.Label>Label for Toggle Control</Form.Label>
                    <Form.Control placeholder="Default 'Toggle'" onChange={this.onChange} name="label" />
                </Form.Group>
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Label>Toggle button publish message</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Default is 'Toggle'"
                            onChange={this.onChange}
                            name="publishMessage"
                        />
                    </Form.Group>

                    <Form.Group as={Col}>
                        <Form.Label>Toggle button label</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Default is 'Toggle'"
                            onChange={this.onChange}
                            name="buttonLabel"
                        />
                    </Form.Group>
                </Form.Row>
            </div>
        )
    }
}