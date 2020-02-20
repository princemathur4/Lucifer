import React, { Component, Fragment } from 'react';
import commonApi from "../../apis/common";
import { getSession } from "../../utils/AuthUtils";
import "./style.scss";
import axios from "axios";
import { titleCase, roundOffNumber } from "../../utils/utilFunctions";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import groupby from "lodash.groupby";
import { Dropdown, Button, Modal } from 'semantic-ui-react';
import Spinner from '../../components/Spinner';
import { Link } from "react-router-dom";

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

export default class UpdateOrders extends Component {
    constructor(props) {
        super(props);
        this.orderStatusMapping = {
            "CONFIRMED": "OUT_FOR_DELIVERY",
            "OUT_FOR_DELIVERY": "DELIVERED",
        }
        this.state = {
            isLoading: false,
            isSubmitLoading: false,
            searchText: "",
            orderData: [], 
            groupedData: {},
            orderTypes: [],
            selectedOrderTypes: [],
            expandedOrderId: "",
            activeModalID: "",
            activeOrderStatus: "",
            payload: {
            },
            mainResponseText: "",
            responseText: "",
            responseType: "error",
        };
    }

    clearErrorState = () => {
        this.setState({
            responseText: "",
            errors: {
                file_invalid: null,
            }
        });
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
        this.makeFetchAllOrdersApiCall();
    }

    makeFetchAllOrdersApiCall = async () => {
        this.setState({ isLoading: true });
        let session = await getSession();
        if (!session) {
            return;
        }
        let response;
        try {
            response = await commonApi.get(
                '/get_admin_orders',
                {
                    params: {},
                    headers: { Authorization: session.accessToken.jwtToken }
                }
            );
            console.log("get orders admin response", response);
            if (response && response.status === 200 && response.data.success) {
                let orderData = response.data.data.orders;
                let groupedData = groupby(response.data.data.orders, "order_status");
                if(!orderData.length){
                    this.setState({
                        mainResponseText: "No orders available",
                        responseType: "error",    
                    })
                }
                this.setState({ 
                    orderData, 
                    groupedData, 
                    orderTypes: Object.keys(groupedData), 
                    selectedOrderTypes: Object.keys(groupedData)
                });
                console.log("orderData",orderData);
                console.log("groupedData",groupedData);
            } else {
                this.setState({
                    responseType: "error",
                    mainResponseText: response.data.message
                });
            }
            this.setState({ isLoading: false });
        } catch (err) {
            this.setState({ 
                isLoading: false, 
                responseType: "error",
                mainResponseText: "Something went wrong"
            });
        }
    }

    handleTextChange = async event => {
        event.preventDefault();
        this.state.comments = event.target.value;
    }

    handleSubmit = async event => {
        event.preventDefault();
        this.setState({ isSubmitLoading: true });
        this.clearErrorState();

        let session = await getSession();
        if (!session) {
            return;
        }
        let action, orderID, comments;
        orderID = this.state.activeModalID;
        action = this.orderStatusMapping[this.state.activeOrderStatus]
        comments = this.state.comments;
        try {
            let response = await commonApi.post(
                'change_order_status',
                {'order_id': orderID, 'action': action, 'notes': comments},
                {
                    headers: { 
                        "Content-Type": "text/plain", 
                        "Authorization": session.accessToken.jwtToken 
                    }
                }
            );
            console.log("submit response", response);
            if (response && response.status === 200 && response.data.success) {
                this.setState({
                    responseType: "success",
                    responseText: "Order updated successfully"
                });
                setTimeout(()=>{this.makeFetchAllOrdersApiCall();this.handleModalTrigger()}, 2000);
            } else {
                this.setState({
                    responseType: "error",
                    responseText: response.data.message
                });
            }
            this.setState({ 
                isSubmitLoading: false, 
            });
        } catch (err) {
            console.log("err",err)
            this.setState({ 
                isSubmitLoading: false, 
                responseType: "error",
                responseText: "Something went wrong."
            });
        }
    };

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

    getOrderProductsJSX = (productObj, idxx) => {
        return (
            <div className="order-product-content" key={idxx}>
                <div className="order-product-thumbnail-container" onClick={()=>{this.handleProductImageClick(productObj.product_id)}}>
                    <img src={ productObj.product_image && productObj.product_image.length ? productObj.product_image[0] : "https://i.ibb.co/48hHjC8/Plum-01-900x.png"} 
                        className="order-product-thumbnail-image" />
                </div>
                <div className="order-product-details">
                    <div className="first-row">
                        <Link className="order-product-name" 
                            to={`/product?id=${productObj.product_id.split(`_${productObj.size}`)[0]}`}
                        >
                            {productObj.title ? productObj.title : "Product Title"}
                        </Link>
                    </div>
                    <div className="third-row">
                        <div className="size">Size: <b>{productObj.size}</b></div>
                        <div className="quantity"> Qty: <b>{productObj.count}</b></div>
                    </div>
                    <div className="fourth-row">
                        <div className="price">₹ {roundOffNumber(productObj.effective_price)}</div>
                        {
                            !!productObj.discount &&
                            <Fragment>
                                <div className="actual-price">
                                    ₹ {roundOffNumber(productObj.total_price)}
                                </div>
                                <div className="discount">
                                    (Saved ₹ {roundOffNumber(productObj.total_price - productObj.effective_price)})
                                </div>
                            </Fragment>
                        }
                    </div>
                </div>
            </div>
        )
    }

    getStatusClass = (status) =>{
        if(['failed', 'cancelled', 'returned'].some((keyword)=>{ return status.toLowerCase().includes(keyword) })){
            return 'error';
        } else if (['delivered', 'delivery successful'].some((keyword)=>{ return status.toLowerCase().includes(keyword) })){
            return 'success';
        } else {
            return 'info';
        }
    }

    handleChangeExpandedOrderId = (orderID) => {
        let newOrderID;
        if (this.state.expandedOrderId === orderID){
            newOrderID = "";
        }else{
            newOrderID = orderID
        }
        this.setState({
            expandedOrderId: newOrderID
        })
    }   

    handleModalTrigger = (data) => {
        if(data){
            this.setState({
                activeModalID: data._id,
                activeOrderStatus: data.order_status
            })
        } else {
            this.setState({
                activeModalID: "",
                activeOrderStatus: ""
            })
        }
    }

    getOrderItem = (data) => {
        return (
            <div className="order-card">
                <div className={`order-card-header ${this.getStatusClass(data.order_status)}`}>
                    <div className="row">
                        <div className="order-id"><b>Order No: {data._id}</b></div>
                        Ordered on: {moment(data.created_at).format('DD-MMM-YYYY')} at {moment(data.created_at).format('hh:mm A')}
                    </div>
                    <div className="row center">
                        <div className="amount-paid">Amount Paid: <b>₹ {data.total_price}</b></div>
                        <div className="order-status">
                            <p><span>Order Status:</span>{' '}<span><b className={`${this.getStatusClass(data.order_status)}`}>{data.order_status}</b></span></p>
                            {
                                Object.keys(this.orderStatusMapping).includes(data.order_status) &&
                                <Button primary className="change-status-btn" size='mini'
                                    onClick={()=>{this.handleModalTrigger(data)}}
                                >Change Status</Button>
                            }
                        </div>
                    </div>
                    <div className="row">
                    </div>
                </div>
                <div className="order-card-content">
                    <div className="accordian" onClick={()=>{this.handleChangeExpandedOrderId(data._id)}}>
                        <FontAwesomeIcon className="accodian-icon" icon={this.state.expandedOrderId === data._id ? "angle-down" : "angle-right"}/>
                        <div className="view-products">View Ordered Products</div>
                    </div>
                    {
                        this.state.expandedOrderId === data._id &&
                        <Fragment>
                            {
                                data.order_data.map((productObj, idxx)=>(
                                    this.getOrderProductsJSX(productObj, idxx)
                                ))
                            }
                        </Fragment>
                    }
                </div>
            </div>
        )
    }

    onInputChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    handleOrderTypeSelect = (orderType) => {
        let selectedOrderTypes = [...this.state.selectedOrderTypes];
        if (selectedOrderTypes.includes(orderType)){
            selectedOrderTypes.splice(selectedOrderTypes.indexOf(orderType), 1);
        }else{
            selectedOrderTypes.push(orderType);
        }
        this.setState({
            selectedOrderTypes: selectedOrderTypes
        })
    }

    render() {
        return (
            <div className="update-orders-container">
                <div className="update-orders-card">
                    <div className="update-orders-header">
                        Update Orders
                    </div>
                    <div className="update-orders-body">
                    {
                        this.state.isLoading ? 
                            <div className="loader-container">
                                <Spinner color="primary" size="medium" />
                            </div>
                            :
                            <Fragment>
                                    <div className="action-buttons">
                                    {
                                        this.state.orderTypes.map((orderType, idx)=>{
                                            let selected = false;
                                            if (this.state.selectedOrderTypes.includes(orderType)){
                                                selected = true;
                                            }
                                            return(
                                                <button
                                                    className={selected ? "action-btn button is-rounded is-link": "action-btn button is-rounded is-light"}
                                                    onClick={()=>{this.handleOrderTypeSelect(orderType)}}
                                                >
                                                    {orderType}
                                                </button>
                                            )
                                        })
                                    }
                                </div>
                                <div className="search-input-container">
                                    <input
                                        placeholder="Search Order id"
                                        className={"input is-fullwidth"}
                                        type="text"
                                        name="searchText"
                                        value={this.state.searchText}
                                        onChange={this.onInputChange}
                                    />
                                </div>
                                {
                                    this.state.mainResponseText &&
                                    <div className={`response-text is-${this.state.responseType}`}>
                                        <span className="response-tag">
                                            {this.state.mainResponseText}
                                        </span>
                                    </div>
                                }
                                <div className="orders-list">
                                    {
                                        this.state.orderData.map((orderObj, idx)=>{
                                            if (this.state.selectedOrderTypes.includes(orderObj.order_status) &&
                                                ((this.state.searchText && orderObj._id.includes(this.state.searchText)) 
                                                    ||!this.state.searchText)
                                            ){
                                                return(
                                                    this.getOrderItem(orderObj)
                                                )
                                            }
                                        })
                                    }
                                </div>
                                <div className={this.state.activeModalID ? "modal is-active" : "modal"}>
                                    <div className="modal-background"></div>
                                    <div className="modal-content">
                                        <div className="login-modal-content">
                                            <div className="login-modal-header">
                                                <div className="login-modal-title">
                                                    <p>
                                                        Change Order Status <br/>
                                                        <span>from <b>{this.state.activeOrderStatus}</b></span>{" "}
                                                        <span>to <b>{this.orderStatusMapping[this.state.activeOrderStatus]}</b></span>
                                                        <br/>for Order ID: <b>{this.state.activeModalID}</b>?
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="login-modal-body">
                                            <div class="field">
                                                <div class="control">
                                                    <textarea 
                                                        class="textarea is-primary" 
                                                        placeholder="Type your comments here."
                                                        onChange={this.handleTextChange}
                                                        ></textarea>
                                                </div>
                                            </div>
                                                <div className="buttons-container">
                                                    <button className={this.state.isSubmitLoading ? "button is-success is-loading" :"button is-success"}
                                                        onClick={this.handleSubmit}
                                                        >Yes</button>
                                                    <button className="button is-danger" onClick={()=>{this.handleModalTrigger()}}>No</button>
                                                </div>
                                            </div>
                                            <div className="login-modal-footer">
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
                                </div>
                            </Fragment>
                    }
                    {/* {this.getInputJSX("number", "stock", "Stock", "field-input")} */}
                </div>
                </div>
            </div>
        );
    }
}
