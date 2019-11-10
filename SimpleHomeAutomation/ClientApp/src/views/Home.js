import React, { Component } from 'react';
import Fab from '../components/Fab';
import ControlModal from '../components/ControModal';
import { getUI } from '../services/APICalls';
import { UIBuilder } from '../util/UIBuilder';
import Notification from '../components/Notification';
import MiddleOfScreenText from '../components/MiddleOfScreenText';

export default class Home extends Component {
  static displayName = Home.name;
  constructor(props) {
    super(props);
    this.state = {
      uiJSON: [],
      show: false,
      showConfig: false,
      deleteMode: false,
      showNotification: false,
    }
  }

  componentDidMount() {
    this.getUI();
  }

  handleShow = () => this.setState({ show: true })
  handleClose = () => this.setState({ show: false, showConfig: false })
  hideConfig = () => this.setState({ showConfig: false })
  showConfig = () => this.setState({ showConfig: true })

  deleteMode = (value) => this.setState({ deleteMode: value })

  getUI = async () => {
    getUI()
      .then(res => res.json())
      .then(json => {
        this.setState({ uiJSON: json })
      })
      .catch(err => console.log(err));
  }

  addControl = (control) => {
    let uiJSON = [...this.state.uiJSON, control];
    this.setState({ uiJSON });
  }

  showNotification = (header, body) => {
    this.setState({
      showNotification: true,
      notificationHeader: header,
      notificationBody: body
    })
  }

  closeNotification = () => this.setState({
    showNotification: false,
    notificationHeader: "",
    notificationBody: ""
  });

  render() {
    let controls = UIBuilder(
      this.state.uiJSON,
      this.getUI,
      this.state.deleteMode,
      this.deleteMode,
      this.showNotification
    );

    if (controls.length === 0) {
      controls.push(<MiddleOfScreenText text="No controls yet..." />)
    }

    return (
      <div>
        <h4 className="text-center text-color">Home</h4>
        <div className="flex-container">
          {controls}
        </div>
        <Notification show={this.state.showNotification} close={this.closeNotification} header={this.state.notificationHeader} body={this.state.notificationBody} />

        <ControlModal
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