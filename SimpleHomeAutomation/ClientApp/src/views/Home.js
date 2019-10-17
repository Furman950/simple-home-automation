import React, { Component } from 'react';
import { Modal, Button as BootstrapButton } from 'react-bootstrap';
import { Button } from '../components/widgets/Button'
import { Fab } from '../components/Fab';
import AddNewControlForm from '../components/AddNewControlForm';

export default class Home extends Component {
  static displayName = Home.name;
  constructor(props) {
    super(props);
    this.state = {
      ui: {},
      showModal: false
    }
  }
//http://negomi.github.io/react-burger-menu/

  showModal = () =>  {
    this.setState({
      showModal: true
    })
  }

  render() {
    return (
      <div>
        <AddNewControlForm show={this.state.showModal} />
        <Fab onClick={this.showModal}/>
      </div>
    );
  }
}