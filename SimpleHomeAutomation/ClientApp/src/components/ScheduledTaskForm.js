import React, { Component } from 'react';
import { Modal, Button, Col } from 'react-bootstrap';

export default class ScheduledTaskForm extends Component {
    constructor(props) {
        super(props);
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
                        <h4 className="text-center">Create a new Scheduled Task</h4>
                    </Col>
                </Modal.Header>
                <Modal.Body>
                    <div class="flex-container">
                        <div class="flex-item"></div>
                        <div class="flex-item"></div>
                        <div class="flex-item"></div>
                        <div class="flex-item"></div>
                        <div class="flex-item"></div>
                        <div class="flex-item"></div>
                        <div class="flex-item"></div>
                        <div class="flex-item"></div>
                        <div class="flex-item"></div>
                        <div class="flex-item"></div>
                        <div class="flex-item"></div>
                        <div class="flex-item"></div>
                        <div class="flex-item"></div>
                        <div class="flex-item"></div>
                        <div class="flex-item"></div>
                        <div class="flex-item"></div>
                        <div class="flex-item"></div>
                        <div class="flex-item"></div>
                        <div class="flex-item"></div>
                        <div class="flex-item"></div>
                        <div class="flex-item"></div>
                        <div class="flex-item"></div>
                        <div class="flex-item"></div>
                        <div class="flex-item"></div>
                        <div class="flex-item"></div>
                        <div class="flex-item"></div>
                        <div class="flex-item"></div>
                        <div class="flex-item"></div>
                        <div class="flex-item"></div>
                        <div class="flex-item"></div>
                        <div class="flex-item"></div>
                        <div class="flex-item"></div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onclick={this.props.addNewControl}>Add</Button>
                    <Button variant="secondary" onClick={this.props.handleClose}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}