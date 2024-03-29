import React, { Component, Fragment } from 'react';
import commonApi from "../../apis/common";
import { getSession } from "../../utils/AuthUtils";
import "./style.scss";
import { observer } from 'mobx-react';
import axios from "axios";
import { titleCase } from "../../utils/utilFunctions";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { categoryOptions, subCategoryOptions } from "../../constants";
import { Dropdown, Grid, Search, Segment, Header, Input, Checkbox } from 'semantic-ui-react';
import Spinner from "../../components/Spinner";
import findindex from "lodash.findindex";

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

class AddProduct extends Component {
    constructor(props) {
        super(props);
        this.fileInput = React.createRef();
        this.color_hex_code_regex = /^#[0-9a-f]{6}$/i;
        this.discount_regex = /[0-9]{1,3}[%]$/;
        this.state = {
            isLoading: false,
            fileInputKey: moment.now(),
            files: [],
            filterFetched: false,
            filtersLoader: false,
            productInfoCount: 0,
            productInfoList: [],
            options: {
                discount: [],
                color: [],
                color_code: [],
                size: [],
                fabric: [],
                stock: [],
                fit: []
            },
            payload: {
                price: "",
                discount: "",
                title: "",
                description: {},
                color: "",
                color_code: "",
                size: "",
                fabric: "",
                stock: "",
                fit: "",
                is_special: false
            },
            responseText: "",
            responseType: "error",
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
                price: "",
                discount: "",
                title: "",
                description: "",
                color: "",
                color_code: "",
                size: "",
                fabric: "",
                stock: "",
                fit: "",
                is_special: false
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

    async makeFetchFiltersApiCall() {
        this.setState({ filtersLoader: true });
        if (!this.props.store.addProductCategory || !this.props.store.addProductSubCategory) {
            return;
        }

        let payload = {};
        payload = {
            category: this.props.store.addProductCategory,
            sub_category: this.props.store.addProductSubCategory
        }

        try {
            let response = await commonApi.get(`get_filters`,
                {
                    params: {
                        ...payload
                    },
                }
            );
            console.log("get_filters response", response);
            if (response.data && response.data.success) {
                if (response.data.filters) {
                    let options = this.getDropdownOptions(response.data.filters);
                    this.setState({ options: { ...this.state.options, ...options } });
                }
                this.setState({ filterFetched: true, filtersLoader: false });
            } else {
                this.setState({ filtersLoader: false });
            }
        } catch (e) {
            console.log("error", e);
            this.setState({ filtersLoader: false });
        }
    }

    handleSubmit = async event => {
        event.preventDefault();
        this.setState({ isLoading: true });
        this.clearErrorState();

        let form_data = new FormData();
        if (!this.state.files || !this.state.files.length) {
            this.setState({
                responseText: "Image not selected for product",
                responseType: "error",
                isLoading: false
            })
            return;
        }
        Array.from(this.state.files).forEach((file, idx) => {
            form_data.append(idx, this.state.files[idx])
        });

        let payloadState = {
            ...this.state.payload,
            category: this.props.store.addProductCategory,
            sub_category: this.props.store.addProductSubCategory,
        };

        let description = {};
        this.state.productInfoList.forEach((obj, idx)=>{
            description[obj.key] = obj.value
        })
        // [infoObj.count][e.target.name]
        payloadState.description = description;
        payloadState.price = Number(payloadState.price);
        payloadState.discount = payloadState.discount ? Number(String(payloadState.discount).replace('%', '')) : 0;
        payloadState.size = isNaN(payloadState.size) ? payloadState.size : Number(payloadState.size);
        payloadState.stock = Number(payloadState.stock);
        payloadState.fit = payloadState.fit.replace(' ', '_').toLowerCase();
        payloadState.fabric = payloadState.fabric.replace(' ', '_').toLowerCase();
        console.log("payloadState: ", payloadState)
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
            if (response && response.status === 200 && response.data.success) {
                this.clearFieldStates();
                this.setState({
                    responseType: "success",
                })
            } else {
                this.setState({
                    responseType: "error",
                });
            }
            this.setState({
                isLoading: false,
                responseText: response.data.message
            });
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
        if (!adminuser) {
            this.props.history.push('/');
        }
    }

    getDropdownOptions = (filterOptions) => {
        let options = {}
        filterOptions.forEach((filterObj, idx) => {
            if (filterObj.filter_name != 'price' && filterObj.filter_name !== 'color_code') {
                options[filterObj.filter_name] = this.getFormattedOption(filterObj.values);
            } else if (filterObj.filter_name === 'color_code') {
                options[filterObj.filter_name] = filterObj.values.map((color_obj) => { return { key: color_obj.key, value: color_obj.key, text: color_obj.key } })
                options['color'] = filterObj.values.map((color_obj) => { return { key: color_obj.title, value: color_obj.title, text: color_obj.title } })
            }
        })
        return options;
    }

    getFormattedOption = (values) => {
        let optionsList = values.map((valueObj, idx) => {
            return { key: valueObj.key, value: valueObj.key, text: valueObj.title }
        })
        return optionsList;
    }

    getSearchableInput = (name) => {
        return (
            <Dropdown
                name={name}
                options={this.state.options[name]}
                placeholder={`Enter ${titleCase(name)}`}
                search
                selection
                fluid
                allowAdditions
                additionLabel={`Add ${name}: `}
                value={this.state.payload[name]}
                onAddItem={this.handleAddition}
                onChange={this.onDropdownInputChange}
            />
        )
    }

    getInputJSX = (type, name, title, classname) => {
        return (
            <div className={classname}
            >
                <Input
                    placeholder={"Enter " + titleCase(title)}
                    type={type}
                    name={name}
                    value={this.state.payload[name]}
                    onChange={this.onInputChange}
                />
            </div>
        )
    }

    onDropdownInputChange = (e, f) => {
        console.log("handle filter dropdown change", e, f)
        let payload = { ...this.state.payload };
        payload[f.name] = f.value;
        this.setState({
            payload
        });
    };

    onInputChange = (e) => {
        let payload = { ...this.state.payload };
        payload[e.target.name] = e.target.value;
        this.setState({
            payload
        });
    };

    handleChooseBtnClick = () => {
        this.fileInput.current.click();
    }

    onFilesSelect = (e) => {
        let files = e.target.files;
        console.log("file chosen", files);
        this.setState({
            files
        });
    }

    handleMainDropdownChange = (e, f) => {
        console.log(e, f);
        this.props.store[f.name] = f.value;
        if (this.props.store.addProductCategory && this.props.store.addProductSubCategory) {
            this.makeFetchFiltersApiCall();
        }
    }

    handleAddition = (e, f) => {
        let errorField = '';
        if (f.name === "color_code" && !f.value.match(this.color_hex_code_regex)) {
            errorField = 'color_code';
        } else if (f.name === "discount" && !f.value.match(this.discount_regex)) {
            errorField = 'discount';
        } else if (f.name === "size" && 
            (this.props.store.addProductCategory === "bottomwear" && isNaN(f.value))  
            // this.props.store.addProductCategory === "topwear" && !isNaN(f.value))
        ) {
            errorField = 'size';
        }
        if (errorField) {
            this.setState({
                responseText: `Invalid value for ${titleCase(errorField)}`,
                responseType: "error"
            })
            return;
        }
        let options = { ...this.state.options };
        let optionList = options[f.name];
        optionList.push({ key: f.value, value: f.value, text: titleCase(f.value) });
        options[f.name] = optionList;
        this.setState({ responseText: "", options });
    }

    handleCheckboxChange = (e, obj) => {
        let payload = this.state.payload;
        payload[obj.name] = obj.checked;
        this.setState({ payload });
    }

    handleAddProductInfo = () => {
        let { productInfoList, productInfoCount } = this.state;
        productInfoCount = productInfoCount + 1
        productInfoList.push({
            count: productInfoCount,
            key: "",
            value: ""
        })
        this.setState({
            productInfoList, productInfoCount
        })
    }

    handleRemoveProductInfo = (infoObj) => {
        let { productInfoList } = this.state;
        let objIdx = findindex(productInfoList, { count: infoObj.count });
        productInfoList.splice(objIdx, 1);
        this.setState({
            productInfoList
        })
    }

    onProductInfoChange = (e, infoObj) => {
        let { productInfoList } = this.state;
        let objIdx = findindex(productInfoList, { count: infoObj.count });
        productInfoList[objIdx][e.target.name] = e.target.value;
        this.setState({
            productInfoList
        });
    }

    getProductInfoInputs = (infoObj, idx) => {
        return (
            <div className="product-info-field">
                <Input
                    className="key-input"
                    placeholder="Enter Info Title"
                    type="text"
                    name="key"
                    onChange={(e)=>{this.onProductInfoChange(e, infoObj)}}
                />
                <Input
                    className="value-input"
                    placeholder="Enter Info Value"
                    type="text"
                    name="value"
                    onChange={(e)=>{this.onProductInfoChange(e, infoObj)}}
                />
                <button className="delete is-medium is-danger is-light"
                    onClick={()=>{this.handleRemoveProductInfo(infoObj)}}
                ></button>
            </div>
        )
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
                        <div className="field">
                            <Dropdown
                                placeholder='Select product category'
                                fluid
                                search
                                selection
                                options={categoryOptions}
                                onChange={this.handleMainDropdownChange}
                                name="addProductCategory"
                            />
                        </div>
                        {
                            this.props.store.addProductCategory &&
                            <div className="field">
                                <Dropdown
                                    placeholder='Select product sub-category'
                                    fluid
                                    search
                                    selection
                                    options={subCategoryOptions[this.props.store.addProductCategory]}
                                    onChange={this.handleMainDropdownChange}
                                    name="addProductSubCategory"
                                />
                            </div>
                        }
                        <div className="add-product-main-body">
                            {this.state.filtersLoader ?
                                <Spinner color="primary" size="medium" />
                                :
                                (this.state.filterFetched &&
                                    <Fragment>
                                        <input
                                            type="file"
                                            key={this.state.fileInputKey}
                                            ref={this.fileInput}
                                            accept="image/*"
                                            multiple
                                            onChange={this.onFilesSelect}
                                            hidden
                                        />
                                        <button className="button is-fullwidth choose-file-btn" onClick={() => { this.handleChooseBtnClick() }}>
                                            Choose Files
                                            <span className="icon">
                                                <FontAwesomeIcon icon="file-upload" />
                                            </span>
                                        </button>
                                        {
                                            !!this.state.files.length &&
                                            <div className="files-container">
                                                {
                                                    Array.from(this.state.files).map((fileObj, fileIdx) => {
                                                        return (
                                                            <div className="file-item">
                                                                <div className="file-index">
                                                                    {fileIdx + 1}
                                                                </div>
                                                                <div className="file-name-text">
                                                                    {fileObj.name}
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        }
                                        <div className="field-row">
                                            {this.getInputJSX("text", "title", "Title", "field-input")}
                                        </div>
                                        <div className="field">
                                            {this.getInputJSX("number", "stock", "Stock", "field-input")}
                                        </div>
                                        <div className="field-row">
                                            {this.getInputJSX("number", "price", "Price", "field-input")}
                                        </div>
                                        <div className="field-row">
                                            {this.getSearchableInput("discount")}
                                        </div>
                                        <div className="field-row">
                                            {this.getSearchableInput("color")}
                                            {this.getSearchableInput("color_code")}
                                        </div>
                                        <div className="field">
                                            {this.getSearchableInput("size")}
                                        </div>
                                        <div className="field-row">
                                            {this.getSearchableInput("fit")}
                                            {this.getSearchableInput("fabric")}
                                        </div>
                                        <div className="product-info-container">
                                            <div className="field-row">
                                                <button className="button is-light is-success is-fullwidth"
                                                    onClick={this.handleAddProductInfo}
                                                >Add Additional Product Info
                                                <FontAwesomeIcon icon="plus-square" className="add-icon ico" />
                                                </button>
                                            </div>
                                            {
                                                this.state.productInfoList.map((infoObj, index) => {
                                                    return this.getProductInfoInputs(infoObj, index)
                                                })
                                            }
                                        </div>
                                        <div className="field-row">
                                            <Checkbox
                                                key='is_special'
                                                name='is_special'
                                                title="Is special?"
                                                // value={this.state.payload.is_special}
                                                checked={this.state.payload.is_special}
                                                onChange={this.handleCheckboxChange}
                                                label="Is special?"
                                            />
                                        </div>
                                        <button
                                            className={this.state.isLoading ?
                                                "button is-fullwidth submit-btn is-loading" :
                                                "button is-fullwidth submit-btn"
                                            }
                                            onClick={this.handleSubmit}
                                        >
                                            Submit
                                    </button>
                                    </Fragment>
                                )
                            }
                        </div>
                        {
                            this.state.responseText &&
                            <div className={`response-text is-${this.state.responseType}`}>
                                <span className="response-tag">
                                    {this.state.responseText}
                                </span>
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default observer(AddProduct);