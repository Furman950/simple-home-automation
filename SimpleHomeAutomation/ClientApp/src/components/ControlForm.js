import React, { Component } from 'react';
import { Modal, Button, Col, } from 'react-bootstrap';
import Controls from './controls/controls';
import ControlConfiguration from './ControlConfiguration';

export default class ControlForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            control: {
                data: {},
                component: undefined,
            },
        }
    }

    updateSelectedControl = (control) => {
        let temp = { ...this.state.control }
        temp.component = control
        this.setState({ control: temp })
        this.props.unhideConfig();
    }

    addControl = () => {
        if (this.state.control.data.topic === undefined) {
            alert("Publish topic is required, it cannot start with a '/'\n\nExample:\n\nhouse/bedroom/light")
            return;
        }
        this.props.addControl(this.state.control)
        this.props.handleClose();
        this.setState({
            control: {
                data: {},
                component: undefined,
            },
            selectedControlData: undefined,
        })
    }

    controlData = (key, value) => {
        let temp = { ...this.state.control }
        temp.data[key] = value;
        this.setState({ control: temp })
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
                        <ControlConfiguration controlData={this.controlData} componentName={this.state.control.component.prototype.constructor.name} /> :
                        <Controls updateSelectedControl={this.updateSelectedControl} />}

                </Modal.Body>
                <Modal.Footer>
                    {buttons}
                    <Button variant="secondary" onClick={this.props.handleClose}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}