import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import { getUIConfig } from '../util/UIBuilder';

export default class ControlConfiguration extends Component {
    constructor(props) {
        super(props)

        this.state = {
            validated: false,
        }
    }

    onChange = e => {
        let key = e.target.name;
        let value = e.target.value;

        this.props.addControlData(key, value);
    }

    saveControl = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const form = e.currentTarget;
        this.setState({ validated: true });

        if (form.checkValidity() === false) {
            return;
        }

        this.props.saveControl();
    }



    render() {
        const Config = getUIConfig(this.props.componentName)
        return (
            <Form noValidate validated={this.state.validated} onSubmit={this.saveControl} id="form">
                <Form.Group>
                    <Form.Label>Publish Topic*</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Ex: home/bedroom/light"
                        value={this.state.topic}
                        onChange={this.onChange}
                        name="topic"
                        required
                        pattern="^[A-Za-z0-9]+(\/[A-za-z0-9-]*)*[A-za-z0-9]$"
                    />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    <Form.Control.Feedback type="invalid">
                        Topic has to start with a letter or number and cannot end with a '/'. Please follow this format 'home/bedroom/light'
                    </Form.Control.Feedback>
                </Form.Group>
                <Config addControlData={this.props.addControlData} />
            </Form>
        )
    }
}