import React, { Component } from 'react';
import { Modal, Button, Col, Form } from 'react-bootstrap';
import MinuteCrons from './MinuteCrons';
import DayCrons from './DayCrons';
import { Day, MinuteType, IntervalType } from '../util/const';

export default class ScheduledTaskForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            crons: "0 0/1 * 1/1 * ? *",
            name: "",
            group: "",
            message: "",
            topic: "",

            intervalType: IntervalType.minute,
        }
    }

    onChange = (e) => this.setState({ [e.target.name]: e.target.value });

    dayCheckboxClick = (e) => {
        let tempDayCheckBox = { ...this.state.dayCheckedMap };

        let name = e.target.name;
        tempDayCheckBox[name] = true;
    }

    updateInterval = (intervalType) => this.setState({ intervalType: intervalType })

    updateCrons = (crons, intervalType) => {
        console.log(`Crons: ${crons}`);
        this.setState({
            crons: crons,
            intervalType: intervalType,
        });
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
                    <Form>
                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>Scheduled Task Name*</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ex: Sprinklers"
                                    value={this.state.name}
                                    onChange={this.onChange}
                                    name="name"
                                />
                            </Form.Group>

                            <Form.Group as={Col}>
                                <Form.Label>Group*</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ex: Irrigation System"
                                    value={this.state.group}
                                    onChange={this.onChange}
                                    name="group"
                                />
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
                                />
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label>Message*</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ex 'ON'"
                                    value={this.state.message}
                                    onChange={this.onChange}
                                    name="message"
                                />
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
                    {/* <Button variant="primary" onclick={this.props.addNewControl}>Add</Button> */}
                    <Button variant="primary" onClick={() => console.log(this.state.crons)}>Add</Button>
                    <Button variant="secondary" onClick={this.props.handleClose}>Cancel</Button>
                </Modal.Footer>
            </Modal >
        )
    }
}