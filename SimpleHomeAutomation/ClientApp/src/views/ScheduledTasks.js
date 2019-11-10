import React, { Component } from 'react';
import { Container } from 'reactstrap';
import Fab from '../components/Fab';
import ScheduledTaskForm from '../components/ScheduledTaskForm';
import { scheduledTaskBuilder } from '../util/UIBuilder';
import { getScheduledTasks } from '../services/APICalls';
import Notification from '../components/Notification';


export default class ScheduledTasks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scheduledTaskJSON: {},
            show: false,
            showNotification: false,
        }
    }

    componentDidMount() { this.update(); }

    update = () => {
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

    showNotification = (header, body) => {
        this.setState({
            showNotification: true,
            notificationHeader: header,
            notificationBody: body
        })
    }

    closeNotification = () => this.setState({
        showNotification: false,
        notificationHeader: "",
        notificationBody: ""
    });

    render() {
        let scheduledTasks = scheduledTaskBuilder(this.state.scheduledTaskJSON, this.update, this.showNotification);
        return (
            <Container>
                <Notification show={this.state.showNotification} close={this.closeNotification} header={this.state.notificationHeader} body={this.state.notificationBody} />
                <h4 className="text-center text-color">Scheduled Tasks Page</h4>
                <div className="flex-container">
                    {scheduledTasks}
                </div>

                <Fab onClick={this.handleShow} />
                <ScheduledTaskForm show={this.state.show} handleClose={this.handleClose} showNotification={this.showNotification} update={this.update}/>
            </Container>
        )
    }
}