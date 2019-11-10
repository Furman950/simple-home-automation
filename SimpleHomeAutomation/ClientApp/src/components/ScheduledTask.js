import React, { Component } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { resumeScheduledTask, pauseScheduledTask, deleteScheduledTask } from '../services/APICalls';
import cronstrue from 'cronstrue';

export default class ScheduledTask extends Component {
    constructor(props) {
        super(props);
    }

    updateScheduledTask = async () => {
        let name = this.props.scheduledTask.name;
        let group = this.props.scheduledTask.group;
        let response;

        if (this.props.scheduledTask.status)
            response = await pauseScheduledTask(name, group);
        else
            response = await resumeScheduledTask(name, group);

        if (response.ok) {
            this.props.update();
            return;
        }
    }

    delete = async (e) => {
        let name = this.props.scheduledTask.name;
        let group = this.props.scheduledTask.group;

        let confirm = window.confirm(`Are your sure you want to delete Scheduled Task with Name: ${name} and Group: ${group}`);

        if (!confirm)
            return;

        let response = await deleteScheduledTask(name, group);

        if (response.ok) {
            this.props.showNotification("Successfully Deleted!", `Deleted Scheduled Task with Name: ${name} and Group: ${group}`);
            this.props.update();
        }

    }

    render() {
        let status = this.props.scheduledTask.status;
        let option = status ? 'pause' : 'play_arrow'
        let intervals = [];

        this.props.scheduledTask.crons.forEach((cron) => intervals.push(<p>Interval: {cronstrue.toString(cron)}</p>))
        return (
            <Card
                bg={status ? "success" : "warning"}
                className="scheduled-task-card"
                text="white"
            >
                <Card.Header>
                    <Row>
                        <Col>{this.props.scheduledTask.name}</Col>
                        <Col className="text-right pointer">
                            <i className="material-icons" onClick={this.updateScheduledTask}>
                                {option}
                            </i>
                            <i className="material-icons pointer" onClick={this.delete}>
                                delete
                            </i>
                        </Col>
                    </Row>
                </Card.Header>
                <Card.Body>
                    <p>Topic: {this.props.scheduledTask.mqttMessage.topic}</p>
                    <p>Message: {this.props.scheduledTask.mqttMessage.message}</p>
                    {intervals}
                </Card.Body>
            </Card>
        )
    }
}