import React, { Component } from "react";
import "./style.scss";

class Spinner extends Component {
    constructor(props){
        super(props);
        this.state = {
            loaderClass : `${props.color} ${props.size}` 
        }
    }

    render(){
        return(
            <div className={"spinner " + this.state.loaderClass}></div>
        )
    }
}

export default Spinner;