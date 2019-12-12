import React, { Component, Fragment } from "react";
import "./style.scss";
import { getSession } from "../../utils/AuthUtils";
import commonApi from "../../apis/common";
import { titleCase } from "../../utils/utilFunctions";
import { addresses, addressEditableFields } from "../../constants";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Address from "../Address";
import Spinner from "../Spinner";
import find from "lodash.find";
import Modal from "../Modal";

class Addresses extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addresses: {},
            mode: "",
            responseMsg: "",
            responseType: "",
            isEditLoading: false,
        }
        this.current_address_id = '';
    }

    componentDidMount() {
        this.makeFetchApiCall();
    }

    async makeFetchApiCall() {
        let session = await getSession();
        console.log("addresses token", session.accessToken.jwtToken);
        this.clearErrorStates();
        this.updateEditableFieldStates();
        this.setState({ isLoading: true, mode: "view" });
        try {
            let response = await commonApi.get('get_addresses',
                {
                    params: {},
                    headers: { Authorization: session.accessToken.jwtToken }
                }
            );
            console.log("response", response);
            if (response.data && response.data.success) {
                this.setState({ addresses: response.data.data, isLoading: false });
            } else {
                this.setState({ addresses: [], isLoading: false });
            }
        }
        catch (e) {
            console.log("error", e);
            this.setState({ addresses: [], isLoading: false });
        }
    }

    handleSubmit = (e) => {
        let payload = {};
        let isError = false;
        let errors = { ...this.state.errors };
        addressEditableFields.forEach((obj, idx) => {
            if (!this.state[obj.name]) {
                errors[obj.name] = true;
                isError = true;
                return;
            }
            payload[obj.name] = this.state[obj.name];
        })
        if (isError) {
            this.setState({
                errors: errors,
            })
            return;
        }
        this.makeUpdateApiCall(payload)
    }

    async makeUpdateApiCall(payload) {
        let url = '';
        let self = this;
        this.setState({ isEditLoading: true });
        if (this.state.mode === "add") {
            url = 'add_address';
        } else {
            url = 'edit_address';
            payload["address_id"] = this.current_address_id;
        }

        let session = await getSession();
        try {
            let response = await commonApi.post(url,
                { ...payload },
                { headers: { "Authorization": session.accessToken.jwtToken } }
            );
            console.log("response", response);
            if (response.data && response.data.success) {
                this.setState({ responseMsg: response.data.message, responseType: "success", isEditLoading: false });
                this.current_address_id = '';
                setTimeout(function(){
                    self.makeFetchApiCall();
                },3000);
            } else {
                this.setState({ responseMsg: response.data.message, responseType: "error", isEditLoading: false });
            }
        }
        catch (e) {
            console.log("error", e);
            this.setState({ responseMsg: "Something went wrong.", responseType: "error", isEditLoading: false });
        }
    }

    async onAddressRemove (){
        let session = await getSession();
        try {
            let response = await commonApi.post('delete_address',
                { address_id: this.current_address_id },
                { headers: { "Authorization": session.accessToken.jwtToken } }
            );
            console.log("response", response);
            if (response.data && response.data.success) {
                this.setState({ isModalActive: false, mode: "view" });
                this.makeFetchApiCall();
            } else {
                this.setState({ isModalActive: false });
            }
        }
        catch (e) {
            console.log("error", e);
            this.setState({ isModalActive: false });
        }
    }

    clearErrorStates(){
        let errors = {};
        addressEditableFields.forEach((obj) => {
            errors[obj.name] = false;
        })
        this.setState({
            errors: errors,
            responseMsg: '', 
            responseType: ""
        });
    }

    updateEditableFieldStates = (editableObj) =>{
        let editableStates = {};
        addressEditableFields.forEach((obj) => {
            editableStates[obj.name] = editableObj && editableObj[obj.name] ? editableObj[obj.name] : '';
        })
        this.setState({
            ...editableStates
        });
    }

    handleAddBtnClick = () => {
        this.clearErrorStates();
        this.updateEditableFieldStates();
        this.current_address_id = '';
        this.setState({
            mode: "add",
        });
    }

    handleEditBtnClick = (_id) => {
        this.clearErrorStates();
        this.current_address_id = _id;
        let editableObj = find(this.state.addresses, function (addressObj) { return addressObj._id === _id });
        console.log("editableObj",editableObj);
        this.updateEditableFieldStates(editableObj);
        this.setState({
            mode: "edit",
        });
    }

    onDeleteClick = (_id) => {
        this.setState({ isModalActive: true });
        this.current_address_id = _id;
    }

    handleCancel = (e) => {
        this.current_address_id = '';
        this.setState({ mode: "view" });
    }

    handleCancelDelete = ()=>{
        this.current_address_id = '';
        this.setState({ isModalActive: false });
    }

    onCloseResponse = () => {
        this.setState({ responseMsg: "" })
    }

    onInputChange = event => {
        console.log(event.target.name, " = ", event.target.value)
        this.setState({
            [event.target.name]: event.target.value,
        });
    };

    render() {
        return (
            <Fragment>
                <div className="addresses-container">
                    {
                        this.state.mode === "view" &&
                        <Fragment>
                            <div className="addresses-header">
                                <div className="header-text is-size-5">
                                    Your Saved Addresses
                                </div>
                                {
                                    this.props.addBtnPosition === "header" &&
                                    <button className="button add-btn" onClick={this.handleAddBtnClick}>
                                        <span className="icon is-small">
                                            <FontAwesomeIcon icon="plus" />
                                        </span>
                                        Add New Address
                                    </button>
                                }
                            </div>
                            <Modal 
                                isActive={this.state.isModalActive} 
                                title="Delete Confirmation"
                                content="Are you sure you want to delete this address?"
                                positiveBtnTitle="Yes"
                                negativeBtnTitle="No"
                                handlePositiveFeedback={this.onAddressRemove.bind(this)}
                                handleNegativeFeedback={this.handleCancelDelete}
                            />
                            <div className="addresses-body">
                                {
                                    !this.state.isLoading && this.props.addBtnPosition === "card" && 
                                    <div className="add-address-card">
                                        <button className="button add-btn" onClick={this.handleAddBtnClick}>
                                            <span className="icon is-small">
                                                <FontAwesomeIcon icon="plus" />
                                            </span>
                                        </button>
                                        Add New Address
                                    </div>
                                }
                                {
                                    !this.state.isLoading && !!Object.keys(this.state.addresses).length ?
                                        Object.keys(this.state.addresses).map((key, idx) => {
                                            return (
                                                <Address 
                                                    key={idx} 
                                                    data={this.state.addresses[key]} 
                                                    handleEditBtnClick={this.handleEditBtnClick}
                                                    onDeleteClick={this.onDeleteClick.bind(this)}
                                                    radio={this.props.radio}
                                                />
                                            )
                                        })
                                        :
                                        (!this.state.isLoading ?
                                            <div className="no-data">
                                                <div className="has-text-grey is-size-5">
                                                    No Saved Addresses
                                                </div>
                                            </div>
                                            :
                                            <div className="loader-container">
                                                <Spinner color="primary" size="medium" />
                                            </div>
                                        )
                                }
                            </div>
                        </Fragment>
                    }
                    {
                        (this.state.mode === "add" ||
                        this.state.mode === "edit" )&&
                        <Fragment>
                            <div className="addresses-header">
                                <div className="header-text is-size-5">
                                    {this.state.mode === "add" ? "Add new address" : "Edit Address"}
                                </div>
                                <div className="btn-container">
                                </div>
                            </div>
                            <div className="addresses-editable-body">
                                <Fragment>
                                    {
                                        addressEditableFields.map((obj, idx) => {
                                            return (
                                                <div className="editable-field" key={idx}>
                                                    <div className="editable-field-label">{obj.title}</div>
                                                    {
                                                        obj.type === "text" &&
                                                        <div className={!this.state.errors[obj.name] ? "control has-icons-left" : "control has-icons-left has-icons-right is-danger"}>
                                                            <input
                                                                className={!this.state.errors[obj.name] ? "input" : "input is-danger"}
                                                                type="text"
                                                                value={this.state[obj.name]}
                                                                name={obj.name}
                                                                onChange={this.onInputChange}
                                                            />
                                                            {
                                                                this.state.errors[obj.name] &&
                                                                <Fragment>
                                                                    <span className="icon is-small is-right">
                                                                        <FontAwesomeIcon icon="exclamation-triangle" />
                                                                    </span>
                                                                    <p className="help is-danger">
                                                                        This is a mandatory field
                                                                </p>
                                                                </Fragment>
                                                            }
                                                        </div>
                                                    }
                                                    {
                                                        obj.type === "radio" &&
                                                        <div className="control">
                                                            {
                                                                obj.options.map((option, idx) => {
                                                                    return (
                                                                        <label className="radio" key={idx}>
                                                                            <input type="radio"
                                                                                name={obj.name}
                                                                                value={option.value}
                                                                                onChange={this.onInputChange}
                                                                                checked={this.state[obj.name] === option.value}
                                                                            />
                                                                            {option.title}
                                                                        </label>
                                                                    )
                                                                })
                                                            }
                                                            {
                                                                this.state.errors[obj.name] &&
                                                                <Fragment>
                                                                    <p className="help is-danger">
                                                                        This is a mandatory field
                                                                </p>
                                                                </Fragment>
                                                            }
                                                        </div>
                                                    }
                                                </div>
                                            )
                                        })
                                    }
                                    <div className="action-buttons">
                                        <button className={!this.state.isEditLoading ? "button submit-btn" : "button submit-btn is-loading"} onClick={this.handleSubmit}>Submit</button>
                                        <button className="button cancel-btn" onClick={this.handleCancel}>Cancel</button>
                                    </div>
                                    {
                                        this.state.responseMsg &&
                                        <div className={"response-text is-" + this.state.responseType}>
                                            <span className="response-tag">
                                                {this.state.responseMsg}
                                            </span>
                                            <button className="delete is-small" onClick={this.onCloseResponse} ></button>
                                        </div>
                                    }
                                </Fragment>
                            </div>
                        </Fragment>
                    }
                </div>
            </Fragment>
        )
    }
}

export default Addresses;