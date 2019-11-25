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
                    <span class="tag">{titleCase(this.props.data.address_type)}</span>
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
                    <button class="button is-fullwidth" onClick={this.props.handleEdit}>
                        <span class="icon is-small">
                            <FontAwesomeIcon icon="edit" className="edit-btn-icon" />
                        </span>
                        Edit
                    </button>
                </footer>
            </div>
        )
    }
}

export default Address;