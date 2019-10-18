import React, { Component } from 'react';
import { Modal, Button as BootstrapButton } from 'react-bootstrap';
import { Button } from '../components/widgets/Button'
import Fab from '../components/Fab';
import ControlForm from '../components/ControlForm';
// import Example from '../components/AddNewControlForm';

export default class Home extends Component {
  static displayName = Home.name;
  constructor(props) {
    super(props);
    this.state = {
      ui: {},
      show: false
    }
  }
  
  //http://negomi.github.io/react-burger-menu/

  handleShow = () => this.setState({ show: true })
  handleClose = () => this.setState({ show: false })

  render() {
    return (
      <div>
        <ControlForm show={this.state.show} handleClose={this.handleClose}/>
        <Fab onClick={this.handleShow} />
        
      </div>
    );
  }
}