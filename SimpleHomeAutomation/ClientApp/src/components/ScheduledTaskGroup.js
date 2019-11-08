import React, { Component } from 'react';
import ScheduledTask from './ScheduledTask';
import { Container } from 'reactstrap';
import '../css/scheduledTask.scss';
export default class ScheduledTaskGroup extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let scheduledTasks = [];
        this.props.scheduledTasksList.forEach(scheduledTask =>
            scheduledTasks.push(<ScheduledTask scheduledTask={scheduledTask} />))

        return (
            <Container className="group-container">
                <p>{this.props.groupName}</p>
                {scheduledTasks}
            </Container>
        )
    }
}