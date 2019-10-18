import React, { Component } from 'react';
import Fab from '../components/Fab';
import ControlForm from '../components/ControlForm';

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
        <h4 class="text-center">Home</h4>
        <ControlForm show={this.state.show} handleClose={this.handleClose}/>
        <Fab onClick={this.handleShow} />
      </div>
    );
  }
}