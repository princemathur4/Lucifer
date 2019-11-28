import React, { Component, Fragment } from "react";
import './style.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default class Checkbox extends Component {
    constructor(props){
        super(props)
    }

    render(){
        return(
            <FontAwesomeIcon icon="check" />
        )
    }

} 