import React, { Component } from 'react';
import { Modal, Button, Col, Row } from 'react-bootstrap';
import Controls from './controls/controls';
import ControlConfiguration from './ControlConfiguration';

export default class AddNewControlForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedControl: undefined,
            selectedControlData: undefined,
            showConfig: false
        }
    }

    updateSelectedControl = (componentName) => {
        this.setState({
            selectedControl: componentName,
            showConfig: true
        })
    }

    addControl = () => {
        if (this.state.selectedControl === undefined) {
            alert("You need to choose control");
            return;
        }

        this.props.addControl(this.state.selectedControl)
        this.props.handleClose();
        this.setState({
            selectedControl: undefined,
            selectedControlData: undefined,
            showConfig: false
        })
    }

    controlConfig = (config) => {
        this.setState({ selectedControlData: config })
    }

    handleClose = () => {
        this.reset();
        this.props.handleClose();
    }

    reset = () => this.setState({ showConfig: false })

    render() {
        let buttons = [];
        if (this.state.showConfig) {
            buttons.push(<Button variant="primary" onClick={this.addControl}>Add</Button>)
            buttons.push(<Button variant="secondary" onClick={this.reset}>Go Back</Button>);
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
                        <h4 className="text-center">{this.state.showConfig ? "Configuration" : "Add new control"}</h4>
                    </Col>
                </Modal.Header>
                <Modal.Body>
                    {this.state.showConfig ?
                        <ControlConfiguration controlConfig={this.controlConfig} componentName={this.state.selectedControl.prototype.constructor.name} /> :
                        <Controls updateSelectedControl={this.updateSelectedControl} />}

                </Modal.Body>
                <Modal.Footer>
                    {buttons}
                    <Button variant="secondary" onClick={this.handleClose}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}