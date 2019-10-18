import React, { Component } from 'react';
import { Container } from 'reactstrap';
import Fab from '../components/Fab';
import ScheduledTaskForm from '../components/ScheduledTaskForm';


export default class ScheduledTasks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false
        }
    }

    handleShow = () => this.setState({ show: true })
    handleClose = () => { this.setState({ show: false }) }

    render() {
        return (
            <Container>
                <p>Scheduled Tasks Page</p>
                <Fab onClick={this.handleShow}/>
                <ScheduledTaskForm show={this.state.show} handleClose={this.handleClose} />
            </Container>
        )
    }
}