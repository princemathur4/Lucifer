import React, { Component, Fragment } from "react";
import "./style.scss";
import { getSession } from "../../utils/AuthUtils";
import commonApi from "../../apis/common";
import { titleCase } from "../../utils/utilFunctions";

class Addresses extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profileData: {},
            mode: "view"
        }
    }

    componentDidMount() {
        this.makeFetchApiCall();
    }

    async makeFetchApiCall() {
        let session = await getSession();
        console.log("profile session", session);
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

    handleEdit = (e) => {
        this.setState({ mode: "edit" })
    }

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
                                <button className="button is-dark" onClick={this.handleEdit}>Edit</button>
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
                                <button className="button is-dark" onClick={this.handleEdit}>Edit</button>
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
                </div>
            </Fragment>
        )
    }
}

export default Addresses;