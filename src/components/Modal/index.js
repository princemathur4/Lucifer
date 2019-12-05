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
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">{this.props.title}</p>
                        <button className="delete" aria-label="close" onClick={this.props.handleNegativeFeedback}></button>
                    </header>
                    <section className="modal-card-body">
                        {this.props.content}
                    </section>
                    <footer className="modal-card-foot">
                        <button className="button is-success" onClick={this.props.handlePositiveFeedback}>{this.props.positiveBtnTitle}</button>
                        <button className="button is-danger" onClick={this.props.handleNegativeFeedback}>{this.props.negativeBtnTitle}</button>
                    </footer>
                </div>
            </div>
        )
    }
}

export default Modal;