import React, { Component, Fragment } from "react";
import "./style.scss";
import { getSession } from "../../utils/AuthUtils";
import commonApi from "../../apis/common";
import { titleCase } from "../../utils/utilFunctions";
import { profileEditableFields } from "../../constants";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profileData: {},
            mode: "view",
            responseMsg: ""
        }
    }

    componentDidMount() {
        this.makeFetchApiCall();
    }

    async makeFetchApiCall() {
        let session = await getSession();
        console.log("profile session", session)
        try {
            let response = await commonApi.get('profile',
                { headers: { "Authorization": session.accessToken.jwtToken } }
            );
            console.log("response", response)
            if (response.data && response.data.success) {
                this.setState({ profileData: response.data.data });
            } else {
                this.setState({ profileData: { name: "Prince Mathur", email: "princemathur.mathur4@gmail.com", phone: 9971936873 } });
            }
        }
        catch (e) {
            console.log("error", e);
            this.setState({ profileData: { name: "Prince Mathur", email: "princemathur.mathur4@gmail.com", phone: 9971936873 } });
        }
    }
    
    handleSubmit = (e) => {
        let payload = {};
        let isError = false;
        let errors = {...this.state.errors};
        profileEditableFields.forEach((obj, idx)=>{
            console.log(this.state[obj.name])
            if (!this.state[obj.name]){
                errors[obj.name] = true;
                isError = true;
                return;
            }
            payload[obj.name] = this.state[obj.name];
        })
        if(isError){
            this.setState({
                errors: errors
            })
            return;
        }
        this.makeUpdateApiCall(payload);
    }

    async makeUpdateApiCall(payload) {
        let session = await getSession();
        console.log("profile session", session)
        try {
            let response = await commonApi.post('edit_profile',
                { data: payload },
                { headers: { "Authorization": session.accessToken.jwtToken } }
            );
            console.log("response", response)
            if (response.data && response.data.success) {
                console.log("success")
            } else {
                console.log("error")
            }
            this.setState({ responseMsg: response.data.message });
        }
        catch (e) {
            console.log("error", e);
            this.setState({ responseMsg: "Something Went wrong." });
        }
    }

    handleEdit = (e) => {
        let errors = {};
        let editableStates = {};
        profileEditableFields.forEach((obj) => {
            errors[obj.name] = false;
            editableStates[obj.name] = this.state.profileData.hasOwnProperty(obj.name) ? this.state.profileData[obj.name] : '';
        })
        this.setState({
            mode: "edit",
            errors: errors,
            ...editableStates
        });
    }

    handleCancel = (e) => {
        this.setState({ mode: "view" });
    }
    onCloseResponse = () =>{
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
                <div className="profile-container">
                    {
                        this.state.mode === "view" &&
                        <Fragment>
                            <div className="profile-header">
                                <div className="header-text is-size-5">
                                    Your Info
                                </div>
                                <div className="btn-container">
                                    <button className="button is-dark" onClick={this.handleEdit}>Edit</button>
                                </div>
                            </div>
                            <div className="profile-body">
                                {
                                    Object.keys(this.state.profileData).map((key, idx) => {
                                        return (
                                            <div key={idx} className="field">
                                                <div className="field-title is-size-6">
                                                    {titleCase(key)}
                                                </div>
                                                <div className="field-value is-size-6">
                                                    {this.state.profileData[key]}
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </Fragment>
                    }
                    {
                        this.state.mode === "edit" &&
                        <Fragment>
                            <div className="profile-header">
                                <div className="header-text is-size-5">
                                    Edit your info
                                </div>
                                <div className="btn-container">
                                </div>
                            </div>
                            <div className="profile-body">
                                <Fragment>
                                    {
                                    profileEditableFields.map((obj, idx) => {
                                        return (
                                            <div className="editable-field" key={idx}>
                                                <div className="editable-field-label">{obj.title}</div>
                                                {
                                                    obj.type === "text" &&
                                                    <div className={!this.state.errors[obj.name] ? "control has-icons-left" : "control has-icons-left has-icons-right is-danger"}>
                                                        <input
                                                            className={!this.state.errors[obj.name] ? "input" : "input is-danger"}
                                                            type="text"
                                                            defaultValue={this.state.profileData[obj.name]}
                                                            name={obj.name}
                                                            onChange={this.onInputChange}
                                                            disabled={!obj.editable}
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
                                    <button className="button submit-btn" onClick={this.handleSubmit}>Submit</button>
                                    <button className="button cancel-btn" onClick={this.handleCancel}>Cancel</button>
                                </div>
                                {
                                    this.state.responseMsg &&
                                    <div className="response-text is-error">
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

export default Profile;