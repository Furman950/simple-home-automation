import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import { getUIConfig } from '../util/UIBuilder';

export default class ControlConfiguration extends Component {
    constructor(props) {
        super(props)
    }

    onChange = e => {
        let key = e.target.name;
        let value = e.target.value;

        this.props.addControlData(key, value);
    }

    render() {
        const Config = getUIConfig(this.props.componentName)
        return (
            <Form>
                <Form.Group>
                    <Form.Label>Publish Topic*</Form.Label>
                    <Form.Control
                        type="text"
                        pattern="^[A-Za-z0-9]+(\/[A-za-z0-9-]*)*[A-za-z0-9]$"
                        placeholder="Exmaple 'house/bedroom/light'"
                        onChange={this.onChange}
                        name="topic"
                    />
                </Form.Group>
                <Config addControlData={this.props.addControlData}/>
            </Form>
        )
    }
}