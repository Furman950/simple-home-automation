import React from 'react';
import '../css/AddNewControl.css';

export default function Fab(props) {
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