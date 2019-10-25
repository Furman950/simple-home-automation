import React from 'react';
import OnOff from '../components/controls/OnOff';
import Switch from '../components/controls/Switch';
import OnOffConfig from '../components/controls/config/OnOffConfig';
import SwitchConfig from '../components/controls/config/SwitchConfig';
import ToggleConfig from '../components/controls/config/ToggleConfig';


function getUIControl(controlName) {
    switch (controlName) {
        case "OnOff":
            return OnOff;
        case "Switch":
            return Switch;
    }
}

function UIBuilder(uiObjects) {
    let controls = [];
    uiObjects.forEach((obj, i) => {
        const Control = getUIControl(obj.control.componentName);
        controls.push(<Control key={i} data={obj.control} theClasses={"flex-item"} />)
    })

    return controls;
};

function getUIConfig(controlName) {
    switch (controlName) {
        case "OnOff":
            return OnOffConfig;
        case "Switch":
            return SwitchConfig;
        case "Toggle":
            return ToggleConfig;
        default:
            return null;
    }
}

export {
    getUIControl,
    UIBuilder,
    getUIConfig
}