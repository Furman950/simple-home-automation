import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import OnOffConfig from './controls/config/OnOffConfig';
import Switch from './controls/Switch';
import Toggle from './controls/Toggle';

export default class ControlConfiguration extends Component {
    constructor(props) {
        super(props);
    }

    configComponents = {
        "OnOff": OnOffConfig,
        "Switch": Switch,
        "Toggle": Toggle
    }

    render() {
        const Config = this.configComponents[this.props.componentName]
        return (
            <Form>
                <Form.Group>
                    <Form.Label>Publish Topic</Form.Label>
                    <p><small>Exmaple 'house/bedroom/light'</small></p>
                    <Form.Control
                        type="text"
                        pattern="^[A-Za-z][A-Za-z\/-]*"
                        placeholder="Leave blank for default"
                    />
                    <Config />

                </Form.Group>
            </Form>
        )
    }
}