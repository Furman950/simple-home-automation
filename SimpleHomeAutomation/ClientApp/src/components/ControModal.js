import React, { Component } from 'react';
import { Modal, Button, Col, } from 'react-bootstrap';
import Controls from './controls/controls';
import ControlForm from './ControForm';
import { saveUI } from '../services/APICalls';

export default class ControlModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            control: {},
        }
    }

    addControl = () => {
        this.props.addControl({ control: this.state.control })
        this.props.handleClose();
        this.setState({
            control: {}
        })
    }

    saveControl = async () => {
        console.log(this.state.control);
        console.log(JSON.stringify(this.state.control));
        let response = await saveUI({ control: this.state.control }).catch(err => {
            console.log("ERROR");
            console.log(err);
        });

        if (response === undefined) {
            console.log("Error happened trying to save control, please make sure the server is runnin");
            return;
        }

        console.log(response);

        if (response.ok) {
            console.log("Saved");
            let id = await response.json();
            console.log(`Body: ${id}`);
            this.state.control["id"] = id;
            console.log("Control added! ControlModal")
            console.log(this.state.control);
            this.props.addControl({ control: this.state.control });
            this.props.handleClose();
            this.setState({ control: {} });

            return;
        }

        window.alert("HTTP-Error: " + response.status);
    }

    addControlData = (key, value) => {
        let control = { ...this.state.control }
        control[key] = value;
        this.setState({ control: control })

        if (key === "componentName") {
            this.props.unhideConfig();
        }
    }

    render() {
        let buttons = [];
        if (this.props.showConfig) {
            buttons.push(<Button key="1" variant="primary" type="submit" form="form">Add</Button>)
            buttons.push(<Button key="2" variant="secondary" onClick={this.props.hideConfig}>Go Back</Button>);
        }

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
                        <h4 className="text-center">{this.props.showConfig ? "Configuration" : "Add new control"}</h4>
                    </Col>
                </Modal.Header>
                <Modal.Body>
                    {/* {errorMessage} */}
                    {this.props.showConfig ?
                        <ControlForm
                            addControlData={this.addControlData}
                            componentName={this.state.control.componentName}
                            saveControl={this.saveControl} /> :
                        <Controls addControlData={this.addControlData} />}

                </Modal.Body>
                <Modal.Footer>
                    {buttons}
                    <Button variant="secondary" onClick={this.props.handleClose}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}