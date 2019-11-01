import React, { Component } from 'react';
import Fab from '../components/Fab';
import ControlForm from '../components/ControlForm';
import { saveUI, getUI } from '../services/APICalls';
import { UIBuilder } from '../util/UIBuilder';

export default class Home extends Component {
  static displayName = Home.name;
  constructor(props) {
    super(props);
    this.state = {
      uiJSON: [],
      show: false,
      showConfig: false
    }
  }

  componentDidMount() {
    getUI()
      .then(res => res.json())
      .then(json => {
        this.setState({ uiJSON: json })
      })
      .catch(err => console.log(err));
  }

  handleShow = () => this.setState({ show: true })
  handleClose = () => this.setState({ show: false, showConfig: false })
  hideConfig = () => this.setState({ showConfig: false })
  showConfig = () => this.setState({ showConfig: true })

  addControl = (control) => {
    let uiJSON = [...this.state.uiJSON, control]
    this.setState({ uiJSON: uiJSON });
    saveUI(control);
  }

  render() {
    let controls = UIBuilder(this.state.uiJSON)

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