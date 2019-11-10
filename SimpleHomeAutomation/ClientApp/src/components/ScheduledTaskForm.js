import React, { Component } from 'react';
import { Modal, Button, Col, Form } from 'react-bootstrap';
import MinuteCrons from './MinuteCrons';
import DayCrons from './DayCrons';
import { IntervalType } from '../util/const';
import { saveScheduledTask } from '../services/APICalls';
import ErrorAlert from './ErrorAlert';


export default class ScheduledTaskForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            crons: ["0 0/1 * 1/1 * ? *"],
            name: "",
            group: "",
            message: "",
            topic: "",

            intervalType: IntervalType.minute,
            validated: false,

            showErrorAlert: false,
            errorHeader: "",
            errorBody: ""
        }
    }

    onChange = (e) => this.setState({ [e.target.name]: e.target.value });

    updateInterval = (intervalType) => this.setState({ intervalType: intervalType })

    updateCrons = (crons, intervalType) => {
        this.setState({
            crons: [crons],
            intervalType: intervalType,
        });
    }

    saveScheduledTask = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const form = e.currentTarget;
        this.setState({ validated: true });
        if (form.checkValidity() === false) {
            return;
        }

        let scheduledTask = this.buildScheduledTask();
        let response = await saveScheduledTask(scheduledTask);

        if (response.ok) {
            this.handleClose();
            let body = `Name: ${scheduledTask.name}, Group: ${scheduledTask.group}`;
            this.props.showNotification("Successfully Created Scheduled Task!", body);
            return;
        }
        let body = await response.text();
        this.showErrorAlert("Error :(", body);
    }

    buildScheduledTask = () => {
        let crons = this.state.crons;
        let name = this.state.name;
        let group = this.state.group;
        let message = this.state.message;
        let topic = this.state.topic;
        let mqttMessage = {
            topic: this.state.topic,
            message: this.state.message
        }

        let scheduledTask = {
            crons,
            name,
            group,
            message,
            topic,
            mqttMessage
        }

        return scheduledTask;
    }

    showErrorAlert = (header, body) => {
        this.setState({
            showErrorAlert: true,
            errorHeader: header,
            errorBody: body
        });
    }

    closeAlert = () => {
        this.setState({
            showErrorAlert: false,
            errorHeader: "",
            errorBody: ""
        });
    }

    handleClose = (e) => {
        this.setState({
            crons: ["0 0/1 * 1/1 * ? *"],
            name: "",
            group: "",
            message: "",
            topic: "",

            intervalType: IntervalType.minute,
            validated: false,
        });
        this.props.handleClose();
    }

    render() {
        let errorMessage = this.state.showErrorAlert ? <ErrorAlert close={this.closeAlert}
            header={this.state.errorHeader}
            body={this.state.errorBody} />
            : null;
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
                    {errorMessage}
                    <Form noValidate validated={this.state.validated} onSubmit={this.saveScheduledTask} id="form">
                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>Scheduled Task Name*</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Ex: Sprinklers"
                                    value={this.state.name}
                                    onChange={this.onChange}
                                    name="name" />
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col}>
                                <Form.Label>Group*</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Ex: Irrigation System"
                                    value={this.state.group}
                                    onChange={this.onChange}
                                    name="group" />
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            </Form.Group>
                        </Form.Row>

                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>Topic*</Form.Label>
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
                            <Form.Group as={Col}>
                                <Form.Label>Message*</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Ex 'ON'"
                                    value={this.state.message}
                                    onChange={this.onChange}
                                    name="message"
                                />
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            </Form.Group>
                        </Form.Row>

                        <Form.Row>
                            <MinuteCrons
                                intervalType={this.state.intervalType}
                                updateCrons={this.updateCrons} />
                            <DayCrons
                                intervalType={this.state.intervalType}
                                updateCrons={this.updateCrons} />
                        </Form.Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" type="submit" form="form">Add</Button>
                    <Button variant="secondary" onClick={this.handleClose}>Cancel</Button>
                </Modal.Footer>
            </Modal >
        )
    }
}