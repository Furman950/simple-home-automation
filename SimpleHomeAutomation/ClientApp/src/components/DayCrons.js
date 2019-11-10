import React, { Component } from 'react';
import Checkbox from './Checkbox';
import { Form, Col, Jumbotron } from 'react-bootstrap';
import { IntervalType, DayType, Day } from '../util/const';

export default class DayCrons extends Component {
    constructor(props) {
        super(props);
        let dayCheckedMap = {};
        for (let key in Day) {
            dayCheckedMap[key] = false
        }

        this.state = {
            dayCheckedMap: dayCheckedMap,
            dayType: DayType.everyday,
            time: "",
        };
    }

    componentDidMount() {
        let date = new Date();
        let currentHour = date.getHours();
        let currentMinute = date.getMinutes();

        currentHour = (currentHour < 10 ? "0" : "") + currentHour;
        currentMinute = (currentMinute < 10 ? "0" : "") + currentMinute;

        let currentTime = `${currentHour}:${currentMinute}`;
        this.setState({ time: currentTime });
    }

    dayIntervalTypeSelected = (e) => {
        let crons = this.getCronsWithTime(this.state.time);
        this.props.updateCrons(crons, IntervalType.day);
    }

    onDayTypeChange = (e) => {
        let name = e.target.name;
        let dayType = e.target.value;
        this.setState({ [name]: dayType });

        let crons = this.getCronsWithDayType(dayType);
        this.props.updateCrons(crons, IntervalType.day);
    }

    getCronsWithDayType = (dayType) => {
        let timeParts = this.state.time.split(':');
        if (dayType == DayType.everyday) {

            return `0 ${timeParts[1]} ${timeParts[0]} ? * * *`;
        }

        let days = this.getSelectedDays(this.state.dayCheckedMap);

        return `0 ${timeParts[1]} ${timeParts[0]} ? ${days} *`;

    }

    onTimeChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
        let crons = this.getCronsWithTime(e.target.value);
        this.props.updateCrons(crons, IntervalType.day);
    }

    getCronsWithTime = (time) => {
        let timeParts = time.split(':');

        if (this.state.dayType == DayType.everyday) {
            return `0 ${timeParts[1]} ${timeParts[0]} ? * * *`;
        }

        let days = this.getSelectedDays(this.state.dayCheckedMap);

        return `0 ${timeParts[1]} ${timeParts[0]} ? * ${days} *`;
    }

    dayCheckboxClick = (e) => {
        const dayCheckedMap = { ...this.state.dayCheckedMap };
        dayCheckedMap[e.target.name] = e.target.checked;
        this.setState({ dayCheckedMap });

        let days = this.getSelectedDays(dayCheckedMap);
        let timeParts = this.state.time.split(':');
        let crons = `0 ${timeParts[1]} ${timeParts[0]} ? * ${days} *`;
        this.props.updateCrons(crons, IntervalType.day);
    }

    getSelectedDays = (map) => Object.keys(map)
        .filter((key) => map[key])
        .map((key) => Day[key])
        .join(',');

    render() {
        let dayIntervalSelected = this.props.intervalType === IntervalType.day;
        let daysDisabled = this.state.dayType === DayType.everyday;
        let dayCheckBoxes = [];

        for (let key in this.state.dayCheckedMap) {
            dayCheckBoxes.push(<Checkbox
                disabled={daysDisabled}
                key={key}
                label={key}
                value={Day[key]}
                name={key}
                onClick={this.dayCheckboxClick} />)
        }

        return (
            <Col>
                <Jumbotron className={dayIntervalSelected ? '' : 'unselected'} >
                    <Form.Group className="text-center">
                        <Form.Check
                            label={(<h4>Days</h4>)}
                            type="radio"
                            name="intervalType"
                            checked={dayIntervalSelected}
                            onClick={this.dayIntervalTypeSelected} />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Time</Form.Label>
                        <Form.Control
                            type="time"
                            name="time"
                            value={this.state.time}
                            onChange={this.onTimeChange} />
                    </Form.Group>

                    <Form.Group>
                        <Form.Check
                            label="Everyday"
                            type="radio"
                            name="dayType"
                            value={DayType.everyday}
                            checked={this.state.dayType === DayType.everyday}
                            onClick={this.onDayTypeChange} />
                    </Form.Group>

                    <Form.Group>
                        <Form.Check
                            label="Selected Days"
                            type="radio"
                            name="dayType"
                            value={DayType.selectedDays}
                            checked={this.state.dayType === DayType.selectedDays}
                            onClick={this.onDayTypeChange} />
                    </Form.Group>
                    <Col>
                        <Form.Group>
                            {dayCheckBoxes}
                        </Form.Group>
                    </Col>
                </Jumbotron>
            </Col>
        )
    }
}