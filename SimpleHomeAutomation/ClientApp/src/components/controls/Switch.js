import React, { Component } from 'react';
import { publishMessage } from '../../services/APICalls';
import TheSwitch from 'react-switch';

export default class Switch extends Component {
    constructor(props) {
        super(props);
        let checked, label, onPublishMessage, offPublishMessage, topic;

        if (this.props.data === undefined || this.isEmpty(this.props.data)) {
            checked = false;
            label = "On/Off";
            onPublishMessage = "ON";
            offPublishMessage = "OFF";
        }
        else {
            checked = this.props.data.checked ? this.props.data.checked : false;
            label = this.props.data.label ? this.props.data.label : "On/OFF";
            onPublishMessage = this.props.data.onPublishMessage ? this.props.data.onPublishMessage : "ON";
            offPublishMessage = this.props.data.offPublishMessage ? this.props.data.offPublishMessage : "OFF";
            topic = this.props.data.topic;
        }

        this.state = {
            checked: checked,
            label: label,
            onPublishMessage: onPublishMessage,
            offPublishMessage: offPublishMessage,
            topic: topic
        }
    }

    isEmpty = (obj) => Object.entries(obj).length === 0 && obj.constructor === Object

    publishOn = () => {
        publishMessage(this.state.topic, this.state.onPublishMessage)
            .then(res => console.log(res));
    }

    publishOff = () => {
        publishMessage(this.state.topic, this.state.offPublishMessage)
            .then(res => console.log(res));
    }

    handleChange = (checked) => {
        if (checked) {
            this.publishOn();
        }
        else {
            this.publishOff();
        }

        this.setState({ checked })
    }

    render() {
        return (
            <label>
                <span>{this.state.label}</span>
                <TheSwitch onChange={this.handleChange} checked={this.state.checked} />
            </label>
        )
    }
}