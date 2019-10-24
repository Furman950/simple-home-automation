import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import OnOffConfig from './controls/config/OnOffConfig';
import SwitchConfig from './controls/config/SwitchConfig';
import ToggleConfig from './controls/config/ToggleConfig';

export default class ControlConfiguration extends Component {
    constructor(props) {
        super(props)
    }
    
    configComponents = {
        "OnOff": OnOffConfig,
        "Switch": SwitchConfig,
        "Toggle": ToggleConfig
    }

    onChange = e => {
        let key = e.target.name;
        let value = e.target.value;

        this.props.controlData(key, value);
    }

    render() {
        const Config = this.configComponents[this.props.componentName]
        return (
            <Form>
                <Form.Group>
                    <Form.Label>Publish Topic*</Form.Label>
                    <Form.Control
                        type="text"
                        pattern="^[A-Za-z][A-Za-z\/-]*"
                        placeholder="Exmaple 'house/bedroom/light'"
                        onChange={e => this.props.controlData(e.target.name, e.target.value)}
                        name="topic"
                    />
                </Form.Group>
                <Config controlData={this.props.controlData}/>
            </Form>
        )
    }
}