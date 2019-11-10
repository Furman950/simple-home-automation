import React, { Component } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { publishMessage, deleteControl } from '../../services/APICalls';

var timeout;

export default class Toggle extends Component {
    constructor(props) {
        super(props);
        let label, buttonLabel, publishMessage, topic;

        if (this.props.data === undefined || this.isEmpty(this.props.data)) {
            label = "Toggle";
            buttonLabel = "Toggle";
            publishMessage = "toggle";
        }
        else {
            label = this.props.data.label ? this.props.data.label : "Toggle";
            buttonLabel = this.props.data.buttonLabel ? this.props.data.buttonLabel : "Toggle";
            publishMessage = this.props.data.publishMessage ? this.props.data.publishMessage : "toggle";
            topic = this.props.data.topic;
        }

        this.state = {
            label: label,
            buttonLabel: buttonLabel,
            publishMessage: publishMessage,
            topic: topic
        }
    }

    isEmpty = (obj) => Object.entries(obj).length === 0 && obj.constructor === Object

    publish = (e) => {
        publishMessage(this.state.topic, this.state.publishMessage)
            .then(res => res.text())
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
                    <Container className="text-center">
                        <Button
                            onClick={this.publish}
                            disabled={this.props.disabled}
                        >
                            {this.state.buttonLabel}
                        </Button>
                    </Container>
                </Card.Body>
            </Card>
        )
    }
}