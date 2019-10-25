import React, { Component } from 'react';
import { Modal, Button, Col, } from 'react-bootstrap';
import Controls from './controls/controls';
import ControlConfiguration from './ControlConfiguration';
import { getUIControl } from '../util/UIBuilder';

export default class ControlForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            control: {},
        }
    }

    addControl = () => {
        if (this.state.control.topic === undefined) {
            alert("Publish topic is required, it cannot start with a '/'\n\nExample:\n\nhouse/bedroom/light")
            return;
        }

        this.props.addControl({ control: this.state.control })
        this.props.handleClose();
        this.setState({
            control: {}
        })
    }

    addControlData = (key, value) => {
        let control = { ...this.state.control }
        control[key] = value;
        this.setState({ control: control })

        if (key === "componentName") {
            this.props.unhideConfig();
        }
    }

    render() {
        let buttons = [];
        if (this.props.showConfig) {
            buttons.push(<Button key="1" variant="primary" onClick={this.addControl}>Add</Button>)
            buttons.push(<Button key="2" variant="secondary" onClick={this.props.hideConfig}>Go Back</Button>);
        }

        return (
            <Modal
                show={this.props.show}
                onHide={this.props.handleClose}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                scrollable="true"
            >
                <Modal.Header>
                    <Col md="12">
                        <h4 className="text-center">{this.props.showConfig ? "Configuration" : "Add new control"}</h4>
                    </Col>
                </Modal.Header>
                <Modal.Body>
                    {this.props.showConfig ?
                        <ControlConfiguration addControlData={this.addControlData} componentName={this.state.control.componentName} /> :
                        <Controls addControlData={this.addControlData} />}

                </Modal.Body>
                <Modal.Footer>
                    {buttons}
                    <Button variant="secondary" onClick={this.props.handleClose}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}