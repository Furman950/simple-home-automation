import React, { Component } from 'react';
import { Form, Col, Jumbotron } from 'react-bootstrap';
import { MinuteType, IntervalType } from '../util/const';
import RadioButton from './RadioButton';

const MinuteSelect = ({ minuteInterval, onChange }) => {
    let options = [];
    for (let i = 1; i < 60; i++) {
        options.push(<option key={i} value={i}>{i}</option>)
    }

    return (<Form.Group>
        <Form.Label>Every 'X' minutes</Form.Label>
        <Form.Control as="select" value={minuteInterval} name="minuteInterval" onChange={onChange}>
            {options}
        </Form.Control>
    </Form.Group>);
}

export default class MinuteCrons extends Component {
    constructor(props) {
        super(props);
        this.state = {
            minuteInterval: 1,
            minuteType: MinuteType.everyXMinute,
            crons: "0 0/1 * 1/1 * ? *"
        }
    }

    minuteIntervalTypeSelected = (e) => {
        let crons = this.getCrons(this.state.minuteType);
        this.props.updateCrons(crons, IntervalType.minute);
    }

    onMinuteTypeChange = (e) => {
        let name = e.target.name;
        let minuteType = e.target.value;
        this.setState({ [name]: minuteType });

        let crons = this.getCrons(minuteType);
        this.props.updateCrons(crons, IntervalType.minute);
    }

    onChange = (e) => this.setState({ [e.target.name]: e.target.value });


    minuteIntervalChange = (e) => {
        let minuteInterval = e.target.value;
        this.setState({ [e.target.name]: minuteInterval, minuteType: MinuteType.everyXMinute });

        let crons = `0 0/${minuteInterval} * 1/1 * ? *`
        this.props.updateCrons(crons, IntervalType.minute);
    }


    getCrons = (minuteType) => {
        switch (minuteType) {
            case MinuteType.evenMinute:
                return '0 */2 * ? * *';
            case MinuteType.oddMinute:
                return '0 1/2 * ? * *';
            case MinuteType.everyXMinute:
            default:
                return `0 0/${this.state.minuteInterval} * 1/1 * ? *`;
        }
    }

    render() {
        let minuteIntervalSelected = this.props.intervalType === IntervalType.minute;

        return (
            <Col>
                <Jumbotron className={minuteIntervalSelected ? '' : 'unselected'}>
                    <Form.Group className="text-center">
                        <RadioButton
                            label={(<h4>Minutes</h4>)}
                            name="intervalType"
                            value={"minute"}
                            checked={minuteIntervalSelected}
                            onClick={this.minuteIntervalTypeSelected} />
                    </Form.Group>

                    <Form.Group>
                        <RadioButton
                            label={<MinuteSelect minuteInterval={this.state.minuteInterval} onChange={this.minuteIntervalChange} />}
                            name="minuteType"
                            value={MinuteType.everyXMinute}
                            checked={this.state.minuteType === MinuteType.everyXMinute}
                            onClick={this.onMinuteTypeChange} />
                    </Form.Group>
                    <Form.Group>
                        <RadioButton
                            label="Every even minutes"
                            name="minuteType"
                            value={MinuteType.evenMinute}
                            checked={this.state.minuteType === MinuteType.evenMinute}
                            onClick={this.onMinuteTypeChange} />
                    </Form.Group>
                    <Form.Group>
                        <RadioButton
                            label="Every odd minutes"
                            name="minuteType"
                            value={MinuteType.oddMinute}
                            checked={this.state.minuteType === MinuteType.oddMinute}
                            onClick={this.onMinuteTypeChange} />
                    </Form.Group>
                </Jumbotron>
            </Col>
        );
    }
}