import React, { Component } from 'react';
import { Container } from 'reactstrap';
import Fab from '../components/Fab';
import ScheduledTaskForm from '../components/ScheduledTaskForm';
import { scheduledTaskBuilder } from '../util/UIBuilder';
import { getScheduledTasks } from '../services/APICalls';


export default class ScheduledTasks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scheduledTaskJSON: {},
            show: false
        }
    }

    componentDidMount() {
        getScheduledTasks()
            .then(res => res.json())
            .then(json => {
                console.log(json)
                this.setState({
                    scheduledTaskJSON: json
                })
            })
            .catch(err => console.log(err));
    }

    handleShow = () => this.setState({ show: true })
    handleClose = () => { this.setState({ show: false }) }

    render() {
        let scheduledTasks = scheduledTaskBuilder(this.state.scheduledTaskJSON);
        return (
            <Container>
                <h4 className="text-center text-color">Scheduled Tasks Page</h4>
                <div className="flex-container">
                    {scheduledTasks}
                </div>
                <Fab onClick={this.handleShow}/>
                <ScheduledTaskForm show={this.state.show} handleClose={this.handleClose} />
            </Container>
        )
    }
}