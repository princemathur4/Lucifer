import React, { Component } from "react";
import "./style.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { titleCase } from "../../utils/utilFunctions";

class Address extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="card">
                <div className="user-header">
                    <div className="user-name is-size-6">
                        {this.props.data.name}
                    </div>
                    <span class="tag is-medium">{titleCase(this.props.data.address_type)}</span>
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
                <footer class="card-footer">
                    <div class="field has-addons action-btns">
                        <p class="control">
                            <button class="button" onClick={() => { this.props.handleEditBtnClick(this.props.data._id)}}>
                                <span class="icon is-small">
                                    <FontAwesomeIcon icon="edit" className="edit-btn-icon" />
                                </span>
                                <span>Edit</span>
                            </button>
                        </p>
                        <p class="control">
                            <button class="button" onClick={()=>{this.props.onDeleteClick(this.props.data._id)}}>
                                <span class="icon is-small">
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