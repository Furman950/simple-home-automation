import React from 'react';
import '../css/addNewControl.css';

export default function Fab(props) {
    return (
        <div className="fab-container">
            <button onClick={props.onClick}
                className="fab-item">
                <i className="material-icons text-color">
                    add
                </i>
            </button>
        </div>
    )
}