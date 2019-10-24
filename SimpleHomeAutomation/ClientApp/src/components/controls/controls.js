import React, { Component } from 'react';
import OnOff from './OnOff';
import Switch from './Switch';
import Toggle from './Toggle';


export default class Controls extends Component {
    constructor(props) {
        super(props);
    }

    select = (componentName) => {
        this.props.updateSelectedControl(componentName);
    }

    render() {
        return (
            <div className="flex-container">
                <div className={`flex-item modal-control`}
                    onClick={() => this.select(OnOff)}
                >
                    <OnOff disabled={true}/>
                </div>
                <div className={`flex-item modal-control`}
                    onClick={() => this.select(Switch)}
                >
                    <Switch disabled={true} />
                </div>
                <div className={`flex-item modal-control`}
                    onClick={() => this.select(Toggle)}
                >
                    <Toggle disabled={true} />
                </div>
            </div>
        )
    }
}