import React, { Component, Fragment } from "react";
import "./style.scss";
import { getSession } from "../../utils/AuthUtils";
import commonApi from "../../apis/common";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Spinner from "../Spinner";
import OrdersCard from "../OrdersCard";
import OrderDetails from "../OrderDetails";
import find from 'lodash.find';

class Orders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ordersData: [],
            mode: this.props.mode ? this.props.mode: "allOrders",
            orderId: this.props.orderId ? this.props.orderId : "",
            backButton: this.props.backButton ? this.props.backButton : true,
            responseMsg: "",
            responseType: "",
            isLoading: true,
        }
    }

    componentDidMount() {
        this.makeFetchApiCall();
        if(this.state.orderId){
            this.handleViewDetails(this.state.orderId);
        }
    }

    async makeFetchApiCall() {
        let session = await getSession();
        console.log("orders token", session.accessToken.jwtToken);
        try {
            let response = await commonApi.get('get_orders',
                {
                    params: {},
                    headers: { Authorization: session.accessToken.jwtToken }
                }
            );
            console.log("response", response);
            if (response.data && response.data.success) {
                this.setState({ ordersData: response.data.data, isLoading: false });
            } else {
                this.setState({ ordersData: {}, isLoading: false });
            }
        }
        catch (e) {
            console.log("error", e);
            this.setState({ ordersData: {}, isLoading: false });
        }
    }

    handleViewDetails = (orderId) => {
        let ordersObj = find(this.state.ordersData, { _id: orderId });
        this.setState({ mode: "viewDetails", orderId: orderId, viewOrderData: ordersObj });
    }

    render() {
        return (
            <Fragment>
                <div className="orders-container">
                    {
                        <Fragment>
                            <div className="orders-header">
                                <div className="header-text is-size-5">
                                    {(this.state.mode === "viewDetails" && this.state.orderId) ?
                                        <div className="back-button" onClick={()=>{this.setState({mode: "allOrders"})}}>
                                            <FontAwesomeIcon icon="angle-left"/>
                                            <div className="back-text">
                                                Go back to view orders
                                            </div>
                                        </div> 
                                        : "Your Orders"} 
                                </div>
                            </div>
                            <div className="orders-body">
                                {
                                    !this.state.isLoading && this.state.ordersData.length ? 
                                        (this.state.mode === "allOrders" ?
                                            this.state.ordersData.map((obj, idx) => {
                                                return (
                                                    <OrdersCard
                                                        {...this.props}
                                                        data={obj}
                                                        handleViewDetails={this.handleViewDetails}
                                                        />
                                                        )
                                                    })
                                        :
                                        this.state.mode === "viewDetails" && this.state.orderId && 
                                            <Fragment>
                                             
                                            <OrderDetails
                                                data={this.state.viewOrderData}
                                                {...this.props}
                                            />
                                            </Fragment>
                                        )
                                        :
                                        (!this.state.isLoading ?
                                        <div className="no-data">
                                            <div className="has-text-grey is-size-5">
                                                No Orders placed yet
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
                </div>
            </Fragment>
        )
    }
}

export default Orders;