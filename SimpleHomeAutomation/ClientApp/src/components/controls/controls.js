import React, { Component } from 'react';
import OnOff from './OnOff';
import Switch from './Switch';
import Toggle from './Toggle';


export default class Controls extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: -1
        }
    }

    select = (id, componentName) => {
        this.props.updateSelectedControl(componentName);
        this.setState({ selected: id })
    }

    render() {
        return (
            <div className="flex-container">
                <div className={`flex-item modal-control ${this.state.selected === 1 ? 'selected' : ''}`}
                    onClick={() => this.select(1, OnOff)}
                >
                    <OnOff disabled={true}/>
                </div>
                <div className={`flex-item modal-control ${this.state.selected === 2 ? 'selected' : ''}`}
                    onClick={() => this.select(2, Switch)}
                >
                    <Switch disabled={true} />
                </div>
                <div className={`flex-item modal-control ${this.state.selected === 3 ? 'selected' : ''}`}
                    onClick={() => this.select(3, Toggle)}
                >
                    <Toggle disabled={true} />
                </div>
            </div>
        )
    }
}