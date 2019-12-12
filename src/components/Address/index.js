import React, { Component } from "react";
import "./style.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { titleCase } from "../../utils/utilFunctions";
import { Radio } from 'semantic-ui-react';

class Address extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="card">
                <div className="card-body">
                    {
                        this.props.radio && !!Object.keys(this.props.radio).length &&
                        <div className="radio-container">
                            <Radio
                                // key={chbx}
                                name={this.props.radio.name}
                                value={this.props.data._id}
                                checked={this.props.radio.selected === this.props.data._id}
                                onChange={()=>{this.props.radio.handleRadioChange(this.props.data)}}
                                label={
                                    <label className="address-radio-label">
                                        {this.props.radio.title}
                                    </label>
                                }
                            />
                        </div>
                    }
                    <div className="user-header">
                        <div className="user-name is-size-6">
                            {this.props.data.name}
                        </div>
                        <span className="tag is-medium">{titleCase(this.props.data.address_type)}</span>
                    </div>
                    <div className="user-address is-size-6">
                        {this.props.data.address}
                    </div>
                    <div className="user-address is-size-6">
                        {this.props.data.city}
                    </div>
                    <div className="user-address is-size-6">
                        {this.props.data.state}
                    </div>
                    <div className="user-address is-size-6">
                        {this.props.data.pincode}
                    </div>
                    <div className="user-mobile is-size-6">
                        Mobile - {this.props.data.mobile}
                    </div>
                </div>
                <footer className="card-footer">
                    <div className="field has-addons action-btns">
                        <p className="control">
                            <button className="button" onClick={() => { this.props.handleEditBtnClick(this.props.data._id)}}>
                                <span className="icon is-small">
                                    <FontAwesomeIcon icon="edit" className="edit-btn-icon" />
                                </span>
                                <span>Edit</span>
                            </button>
                        </p>
                        <p className="control">
                            <button className="button" onClick={()=>{this.props.onDeleteClick(this.props.data._id)}}>
                                <span className="icon is-small">
                                    <FontAwesomeIcon icon="trash-alt" className="delete-btn-icon" />
                                </span>
                                <span>Remove</span>
                            </button>
                        </p>
                    </div>
                </footer>
            </div>
        )
    }
}

export default Address;