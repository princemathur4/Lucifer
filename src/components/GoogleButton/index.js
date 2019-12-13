import React, { Component, Fragment } from 'react';
import { Auth } from "aws-amplify";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class GoogleButton extends Component {

    render() {
        return (
            <button className="button federated-sign-in">
                <span className="icon" style={{ height: "1rem" }}>
                    <FontAwesomeIcon icon={['fab', 'google']} style={{ color: "#cb0808" }} />
                </span>
                <span>Google</span>
            </button>
        )
    }
}