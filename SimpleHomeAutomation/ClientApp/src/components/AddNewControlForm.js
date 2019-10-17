import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';

export default class AddNewControlForm extends Component {
    constructor(props){
        super(props);
    }
    render() {
        return (
            <Modal
                show={this.props.show}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Body>
                    <h4 className="text-center">Add new control</h4>
                    <p>
                        Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
                        dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
                        consectetur ac, vestibulum at eros.
                    </p>
                </Modal.Body>
            </Modal>
        )
    }
}