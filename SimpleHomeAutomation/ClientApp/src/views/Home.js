import React, { Component } from 'react';
import Fab from '../components/Fab';
import ControlForm from '../components/ControlForm';

export default class Home extends Component {
  static displayName = Home.name;
  constructor(props) {
    super(props);
    this.state = {
      ui: [],
      show: false,
      showConfig: false
    }
  }

  handleShow = () => this.setState({ show: true })
  handleClose = () => this.setState({ show: false, showConfig: false })
  hideConfig = () => this.setState({ showConfig: false })
  showConfig = () => this.setState({ showConfig: true })

  addControl = (component) => {
    this.setState({ ui: [...this.state.ui, component] })
  }

  render() {
    let controls = [];
    this.state.ui.forEach((control, i) => {
      const Control = control.component;
      controls.push(<Control key={i} data={control.data} theClasses={"flex-item"} />)
    })

    return (
      <div>
        <h4 className="text-center">Home</h4>
        <div className="flex-container">
          {controls}
        </div>

        <ControlForm
          show={this.state.show}
          showConfig={this.state.showConfig}
          unhideConfig={this.showConfig}
          hideConfig={this.hideConfig}
          handleClose={this.handleClose}
          addControl={this.addControl}
        />
        <Fab onClick={this.handleShow} />
      </div>
    );
  }
}