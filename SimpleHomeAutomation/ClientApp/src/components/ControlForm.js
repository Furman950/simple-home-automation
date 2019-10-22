import React, { Component } from 'react';
import { Modal, Button, Col } from 'react-bootstrap';
import Controls from './controls/controls';

export default class AddNewControlForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedControl: undefined
        }
    }

    updateSelectedControl = (componentName) => {
        console.log(componentName);
        this.setState({
            selectedControl: componentName
        })
    }

    addControl = () => {
        if (this.state.selectedControl === undefined) {
            alert("You need to choose control");
            return;
        }

        this.props.addControl(this.state.selectedControl)
        this.props.handleClose();
        this.setState({ selectedControl: undefined })
    }

    render() {
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
                        <h4 className="text-center">Add new control</h4>
                    </Col>
                </Modal.Header>
                <Modal.Body>
                    <Controls updateSelectedControl={this.updateSelectedControl} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={this.addControl}>Add</Button>
                    <Button variant="secondary" onClick={this.props.handleClose}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}