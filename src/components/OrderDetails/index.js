import React, { Component, Fragment } from "react";
import "./style.scss";
import { Link } from "react-router-dom";
import { roundOffNumber } from "../../utils/utilFunctions";

let moment = require('moment');

class OrderDetails extends Component {
    constructor(props) {
        super(props);
    }
    
    state = {
        actualCartTotal: "", 
        totalDiscount: "", 
        discountedTotal: ""
    }

    componentDidMount(){
        this.calculateTotal();
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

    handleProductImageClick = () => {
        let product_id = this.props.productObj.product_id.split(`_${this.props.productObj.size}`)[0];
        this.props.history.push(product_id);
    }

    getOrderProductsJSX = (productObj, idxx) => {
        return (
            <div className="order-detail-product-content" key={idxx}>
                <div className="order-detail-product-thumbnail-container" onClick={()=>{this.handleProductImageClick(productObj.product_id)}}>
                    <img src={ productObj.product_image && productObj.product_image.length ? productObj.product_image[0] : "https://i.ibb.co/48hHjC8/Plum-01-900x.png"} 
                        className="order-detail-product-thumbnail-image" 
                    />
                </div>
                <div className="order-detail-product-details">
                    <div className="first-row">
                        <Link className="order-detail-product-name" 
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
                                    (Saved ₹ {roundOffNumber(productObj.total_price) - roundOffNumber(productObj.effective_price)})
                                </div>
                            </Fragment>
                        }
                    </div>
                </div>
            </div>
        )
    }

    calculateTotal = () => {
        let actualCartTotal = 0;
        let totalDiscount = 0;
        let discountedTotal = 0;
        this.props.data.order_data.forEach((productObj, idx) => {
            actualCartTotal += roundOffNumber(productObj.price * productObj.count);
            discountedTotal += roundOffNumber((productObj.price * productObj.count) - ((productObj.price * productObj.count) * (productObj.discount / 100)));
            totalDiscount += roundOffNumber((productObj.price * productObj.count) * (productObj.discount / 100));
        })
        this.setState({ actualCartTotal, totalDiscount, discountedTotal });
    }

    getBillingDetails = () => {
        return (
            <Fragment>
                <div className="field-item">
                    <div className="field-item-key">Cart Total</div>
                    <div className="field-item-value">₹ {this.state.actualCartTotal}</div>
                </div>
                <div className="field-item">
                    <div className="field-item-key">Total Discount</div>
                    <div className="field-item-value discount"> - ₹ {this.state.totalDiscount}</div>
                </div>
                <div className="field-item">
                    <div className="field-item-key">Delivery Charges</div>
                    <div className="field-item-value delivery-charge">FREE</div>
                </div>
                <div className="line-border"></div>
                <div className="field-item">
                    <div className="field-item-key">Total</div>
                    <div className="field-item-value">₹ {this.state.discountedTotal}</div>
                </div>
            </Fragment>
        )
    }

    render() {
        return (
            <div className="order-details-container">
                <div className="order-id">{ `Order #${this.props.data._id}`}</div>
                <div className="date">
                    Ordered on {moment(this.props.data.created_at).format('DD-MMM-YYYY')} at {moment(this.props.data.created_at).format('hh:mm A')}
                </div>
                <div className="order-status">Order Status: <b>{this.props.data.order_status}</b></div>
                <div className="order-details-card">
                    <div className="child-container">
                        <div className="column-title">Shipping Address</div>
                        <div className="column-content">
                            <b>{this.props.data.address.name}</b>
                            <br/>
                            {this.props.data.address.address}
                            <br/>
                            {this.props.data.address.city}
                            <br/>
                            {this.props.data.address.state}
                            <br/>
                            {this.props.data.address.country}
                            <br/>
                            {this.props.data.address.pincode}
                            <br/>
                            {this.props.data.address.mobile}
                        </div>
                    </div>
                    <div className="child-container">
                        <div className="column-title">Payment</div>
                        <div className="column-content">
                            Status: <b>{this.props.data.payment_status}</b>
                            <br/>
                            Mode: <b>{this.props.data.payment_mode}</b>
                        </div>
                    </div>
                    <div className="child-container">
                        <div className="column-title">Price Details</div>
                        <div className="column-content">
                            {this.getBillingDetails()}
                        </div>
                    </div>

                </div>
                <div className="items-container">
                    <div className="header">
                        Items in this order: {this.props.data.order_data.length}
                    </div>
                    <div className="items-content">
                        <Fragment>
                            {
                                this.props.data.order_data.map((productObj, idxx)=>(
                                    this.getOrderProductsJSX(productObj, idxx)
                                ))
                            }
                        </Fragment>
                    </div>
                </div>
            </div>
        )
    }
}

export default OrderDetails;