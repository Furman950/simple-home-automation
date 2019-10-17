import React from 'react';
import '../css/AddNewControl.css';

const Fab = props => {
    return (
        <div className="fab-container">
            <button onClick={props.onClick}
                className="fab-item">
                <i className="material-icons">
                    add
                </i>
            </button>
        </div>
    )
}

export { Fab }