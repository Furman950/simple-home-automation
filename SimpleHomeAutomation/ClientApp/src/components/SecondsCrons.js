import React, { Component } from 'react';
import { Form, Col, Jumbotron } from 'react-bootstrap';
import { MinuteType, IntervalType } from '../util/const';
import RadioButton from './RadioButton';

const SecondsSelect = ({ secondInterval, onChange }) => {
    let options = [];
    for (let i = 1; i < 60; i++) {
        options.push(<option key={i} value={i}>{i}</option>)
    }
    return (<Form.Group>
        <Form.Label>Every 'X' seconds</Form.Label>
        <Form.Control as="select" value={secondInterval} name="secondInterval" onChange={onChange}>
            {options}
        </Form.Control>
    </Form.Group>);
}

export default class SecondsCrons extends Component {
    constructor(props) {
        super(props);
        this.state = {
            secondInterval: 1,
            crons: "",
        }
    }

    secondsIntervalTypeSelected = (e) => {
        this.props.updateCrons(this.state.secondInterval, IntervalType.seconds);
    }

    secondsIntervalChange = (e) => {
        let secondInterval = e.target.value;
        console.log(`Settings second interval to ${secondInterval}`);
        this.setState({ [e.target.name]: secondInterval });
        this.props.updateCrons(secondInterval, IntervalType.seconds);
    }

    render() {
        let secondIntervalSelected = this.props.intervalType === IntervalType.seconds;
        return (
            <Col>
                <Jumbotron className={secondIntervalSelected ? '' : 'unselected'}>
                    <Form.Group className="text-center">
                        <RadioButton
                            label={(<h4>Seconds</h4>)}
                            name="intervalType"
                            value={"minute"}
                            checked={secondIntervalSelected}
                            onClick={this.secondsIntervalTypeSelected} />
                    </Form.Group>

                    <SecondsSelect
                        secondInterval={this.state.secondInterval}
                        onChange={this.secondsIntervalChange}
                        onClick={this.secondsIntervalTypeSelected} />
                </Jumbotron>
            </Col>
        )
    }
}