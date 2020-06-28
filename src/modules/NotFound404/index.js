import React, { Component, Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "./style.scss";


export default class NotFound404 extends Component {
    render() {
        return (
            <div className="not-found-container">
                <div className="icon-container">
                    <FontAwesomeIcon className="not-found-icon" icon="shoe-prints" />
                    <FontAwesomeIcon className="not-found-icon" icon="shoe-prints" />
                    <FontAwesomeIcon className="not-found-icon" icon="shoe-prints" />
                </div>
                <div className="not-found-title">
                    Oops! We couldn't find the content you came here for
                </div>
            </div>
        )
    }
}