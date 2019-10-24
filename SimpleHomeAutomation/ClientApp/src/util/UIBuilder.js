import OnOff from '../components/controls/OnOff';
export default function(ui) {
    let controls = [];
    ui.forEach(control => {
        let component = control.component;
        
        switch(component) {
            case "OnOff":
                controls.push({ component: OnOff, data: control.data})
                break;
        }
    })

    return controls;
};