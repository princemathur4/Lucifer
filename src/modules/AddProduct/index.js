import React, { Component, Fragment } from 'react';
import commonApi from "../../apis/common";
import { getSession } from "../../utils/AuthUtils";
import "./style.scss";
import axios from "axios";
import { titleCase } from "../../utils/utilFunctions";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const moment = require('moment');

axios.interceptors.response.use((response) => { 
    return response;
}, error => {
    let err;
    if (error.hasOwnProperty("response")) {
        console.log("interceptor", error.response)
        err = error.response;
    } else {
        err = error;
    }
    return Promise.reject(err);
});

export default class AddProduct extends Component {
    constructor(props) {
        super(props);
        this.fileInput = React.createRef();
        this.state = {
            isLoading: false,
            fileInputKey: moment.now(),
            files: [],
            payload: {
                category: "",
                sub_category: "",
                price: "",
                discount: "",
                title: "",
                description: "",
                color: "",
                color_code: "",
                size: "",
                fabric: "",
                stock: "",
            },
            responseText: "",
            responseType: "error",
            activeDropdown: false,
            errors: {
                file_invalid: null,
            },
        };
    }

    clearFieldStates = () => {
        this.setState({
            fileInputKey: moment.now(),
            files: [],
            payload: {
                category: "",
                sub_category: "",
                price: "",
                discount: "",
                title: "",
                description: "",
                color: "",
                color_code: "",
                size: "",
                fabric: "",
                stock: "",
            }
        });
    }

    clearErrorState = () => {
        this.setState({
            responseText: "",
            errors: {
                file_invalid: null,
            }
        });
    };

    handleSubmit = async event => {
        event.preventDefault();
        this.setState({ isLoading: true });
        this.clearErrorState();

        let form_data = new FormData();
        Array.from(this.state.files).forEach((file, idx)=>{
            form_data.append('files[]', this.state.files[idx])
        });

        let payloadState = { ...this.state.payload };
        form_data.append('data', JSON.stringify(payloadState));

        let session = await getSession();
        if (!session) {
            return;
        }
        let response;
        try {
            response = await commonApi.post(
                'add_product',
                form_data,
                {
                    headers: { "Content-Type": "text/plain", "Authorization": session.accessToken.jwtToken }
                }
            );
            console.log("response", response);
            if (response && response.status === 200 && response.data.status) {
                this.clearFieldStates();
            } else {
                this.setState({
                    responseType: "error",
                    responseText: response.data.message
                }); 
            }
            this.setState({ isLoading: false });
        } catch (err) {
            this.setState({ isLoading: false });
        }
    };

    componentDidMount() {
        let adminuser = this.props.auth.user &&
            this.props.auth.user.signInUserSession.accessToken.hasOwnProperty("payload") &&
            this.props.auth.user.signInUserSession.accessToken.payload.hasOwnProperty("cognito:groups") &&
            this.props.auth.user.signInUserSession.accessToken.payload["cognito:groups"].length &&
            this.props.auth.user.signInUserSession.accessToken.payload["cognito:groups"].includes("labroz_admin");
        if (!adminuser){
            this.props.history.push('/');
        }
    }

    getInputJSX = (type, name, title, classname) => {
        return (
            <div className={"control " + classname}
            >
                <input
                    placeholder={"Enter " + titleCase(name)}
                    className={"input is-fullwidth "}
                    type={type}
                    name={name}
                    value={this.state.payload[name]}
                    onChange={this.onInputChange}
                />
            </div>
        )
    }

    onInputChange = event => {
        let payload = { ...this.state.payload };
        payload[event.target.name] = event.target.value;
        this.setState({
            payload
        });
    };

    handleChooseBtnClick = () =>{
        this.fileInput.current.click();
    }

    onFilesSelect = (e) => {
        let files = e.target.files;
        console.log("file chosen",files);
        this.setState({
            files
        });
    }

    render() {
        return (
            <div className="product-form-container">
                <div className="card">
                    <div className="product-card-header">
                        <div className="card-title">
                            Add products
                        </div>
                    </div>
                    <div className="card-body">
                        <input 
                            type="file" 
                            key={this.state.fileInputKey}
                            ref={this.fileInput} 
                            accept="image/*" 
                            multiple 
                            onChange={this.onFilesSelect}
                            hidden
                        />
                        <button className="button is-fullwidth choose-file-btn" onClick={()=>{this.handleChooseBtnClick()}}>
                            Choose Files
                            <span className="icon">
                                <FontAwesomeIcon icon="file-upload" />
                            </span>
                        </button>
                        {
                            !!this.state.files.length && 
                            <div className="files-container">
                                {
                                    Array.from(this.state.files).map((fileObj, fileIdx)=>{
                                        return (
                                            <div className="file-item">
                                                <div className="file-index">
                                                    {fileIdx + 1}
                                                </div>
                                                <div className="file-name">
                                                    {fileObj.name}
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        }
                        <div className="field">
                            {this.getInputJSX("text", "category", "Category", "field-input")}
                        </div>
                        <div className="field">
                            {this.getInputJSX("text", "sub_category", "Sub-Category", "field-input")}
                        </div>
                        <div className="field-row">
                            {this.getInputJSX("text", "title", "Title", "field-input-first")}
                            {this.getInputJSX("text", "description", "Description", "field-input")}
                        </div>
                        <div className="field-row">
                            {this.getInputJSX("number", "price", "Price", "field-input-first")}
                            {this.getInputJSX("number", "discount", "Discount", "field-input    ")}
                        </div>
                        <div className="field-row">
                            {this.getInputJSX("text", "color", "Color Name", "field-input-first")}
                            {this.getInputJSX("text", "color_code", "Hex Code", "field-input")}
                        </div>
                        <div className="field">
                            {this.getInputJSX("text", "size", "Size", "field-input")}
                        </div>
                        <div className="field">
                            {this.getInputJSX("text", "fabric", "Fabric", "field-input")}
                        </div>
                        <div className="field">
                            {this.getInputJSX("number", "stock", "Stock", "field-input")}
                        </div>
                        {
                            this.state.responseText &&
                            <div className={`response-text is-${this.state.responseType}`}>
                                <span className="response-tag">
                                    {this.state.responseText}
                                </span>
                            </div>
                        }
                        <button 
                            className={this.state.isLoading ?
                                "button is-fullwidth submit-btn is-loading": 
                                "button is-fullwidth submit-btn"
                            } 
                            onClick={this.handleSubmit}
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
