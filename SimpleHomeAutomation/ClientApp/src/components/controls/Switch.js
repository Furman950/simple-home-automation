import React, { Component } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { publishMessage, deleteControl } from '../../services/APICalls';
import TheSwitch from 'react-switch';

var timeout;

export default class Switch extends Component {
    constructor(props) {
        super(props);
        let checked, label, onPublishMessage, offPublishMessage, topic;

        if (this.props.data === undefined || this.isEmpty(this.props.data)) {
            checked = false;
            label = "On/Off";
            onPublishMessage = "ON";
            offPublishMessage = "OFF";
        }
        else {
            checked = this.props.data.checked ? this.props.data.checked : false;
            label = this.props.data.label ? this.props.data.label : "On/OFF";
            onPublishMessage = this.props.data.onPublishMessage ? this.props.data.onPublishMessage : "ON";
            offPublishMessage = this.props.data.offPublishMessage ? this.props.data.offPublishMessage : "OFF";
            topic = this.props.data.topic;
        }

        this.state = {
            checked: checked,
            label: label,
            onPublishMessage: onPublishMessage,
            offPublishMessage: offPublishMessage,
            topic: topic
        }
    }

    isEmpty = (obj) => Object.entries(obj).length === 0 && obj.constructor === Object

    publishOn = () => {
        publishMessage(this.state.topic, this.state.onPublishMessage)
            .then(res => console.log(res));
    }

    publishOff = () => {
        publishMessage(this.state.topic, this.state.offPublishMessage)
            .then(res => console.log(res));
    }

    handleChange = (checked) => {
        if (checked) {
            this.publishOn();
        }
        else {
            this.publishOff();
        }

        this.setState({ checked })
    }

    toggleDeleteMode = (e) => {
        let deleteMode = !this.props.deleteMode;
        timeout = setTimeout(() => this.props.setDeleteMode(deleteMode), 750);
    }

    dontEnterDeleteMode = (e) => {
        if (timeout == null)
            return;

        clearTimeout(timeout);
        timeout = null;
    }

    delete = async (e) => {
        let remove = window.confirm(`Are you sure you want to delete '${this.state.label}'?`);

        if (!remove) return;

        let id = {
            id: this.props.data.id
        }

        let response = await deleteControl(id);

        if (!response.ok) {
            let body = await response.text();
            this.props.showNotification("Failed to Delete Control!", body);
            return;
        }

        this.props.showNotification("Succesfully Delete Control!", `Deleted Control '${this.state.label}'`);
        this.props.update();
    }

    render() {
        return (
            <Card className={this.props.theClasses} onMouseDown={this.toggleDeleteMode} onMouseUp={this.dontEnterDeleteMode}>
                <Card.Header>
                    <Row>
                        <Col></Col>
                        <Col><p className="text-center">{this.state.label}</p></Col>
                        <Col className="text-right">
                        {this.props.deleteMode ? <i className="material-icons pointer" onClick={this.delete}>delete</i> : null}
                        </Col>
                    </Row>
                </Card.Header>
                <Card.Body>
                    <Container className="text-center">
                        <TheSwitch onChange={this.handleChange} checked={this.state.checked} />
                    </Container>
                </Card.Body>

            </Card >

        )
    }
}