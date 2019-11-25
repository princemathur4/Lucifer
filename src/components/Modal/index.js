import React, { Component, Fragment } from 'react';
import "./style.scss"

class Modal extends Component {
    constructor(props){
        super(props)
    }

    render() {
        return (
            <div className={!this.props.isActive ? "modal": "modal is-active"}>
                <div className="modal-background"></div>
                <div class="modal-card">
                    <header class="modal-card-head">
                        <p class="modal-card-title">{this.props.title}</p>
                        <button class="delete" aria-label="close" onClick={this.props.handleNegativeFeedback}></button>
                    </header>
                    <section class="modal-card-body">
                        {this.props.content}
                    </section>
                    <footer class="modal-card-foot">
                        <button class="button is-success" onClick={this.props.handlePositiveFeedback}>{this.props.positiveBtnTitle}</button>
                        <button class="button is-danger" onClick={this.props.handleNegativeFeedback}>{this.props.negativeBtnTitle}</button>
                    </footer>
                </div>
            </div>
        )
    }
}

export default Modal;