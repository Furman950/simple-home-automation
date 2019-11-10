import React, { Component } from 'react';
import { Row, Col, Button, Card } from 'react-bootstrap';
import { publishMessage, deleteControl } from '../../services/APICalls';

var timeout;

export default class OnOff extends Component {
    constructor(props) {
        super(props);
        let label, onPublishMessage, offPublishMessage, topic;

        if (this.props.data === undefined || this.isEmpty(this.props.data)) {
            label = "On/Off";
            onPublishMessage = "ON";
            offPublishMessage = "OFF";
        }
        else {
            label = this.props.data.label ? this.props.data.label : "On/OFF";
            onPublishMessage = this.props.data.onPublishMessage ? this.props.data.onPublishMessage : "ON";
            offPublishMessage = this.props.data.offPublishMessage ? this.props.data.offPublishMessage : "OFF";
            topic = this.props.data.topic;
        }

        this.state = {
            on: false,
            label: label,
            onPublishMessage: onPublishMessage,
            offPublishMessage: offPublishMessage,
            topic: topic
        }
    }

    isEmpty = (obj) => Object.entries(obj).length === 0 && obj.constructor === Object

    publishOn = (e) => {
        publishMessage(this.state.topic, this.state.onPublishMessage)
            .then(res => console.log(res));
    }

    publishOff = (e) => {
        publishMessage(this.state.topic, this.state.offPublishMessage)
            .then(res => console.log(res));
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
            console.log(body);
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
                    <Row>
                        <Col md={6} className="text-center">
                            <Button
                                onClick={this.publishOn}
                                disabled={this.props.disabled}
                            >
                                On
                         </Button>
                        </Col>
                        <Col md={6} className="text-center">
                            <Button
                                onClick={this.publishOff}
                                disabled={this.props.disabled}
                            >
                                Off
                         </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        )
    }
}

OnOff.defaultProps = {
    disabled: false,
}