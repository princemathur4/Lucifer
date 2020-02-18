import React, { Component, Fragment } from "react";
import "./style.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { titleCase } from "../../utils/utilFunctions";
import { Radio } from 'semantic-ui-react';
import { Link } from "react-router-dom";

class OrdersCard extends Component {
    constructor(props) {
        super(props);

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
                    <div className="second-row">
                        {productObj.description ? productObj.description : "Product Description"}
                    </div>

                    <div className="third-row">
                        <div className="size">Size: <b>{productObj.size}</b></div>
                        <div className="quantity"> Qty: <b>{productObj.count}</b></div>
                    </div>
                    <div className="fourth-row">
                        <div className="price">₹ {productObj.effective_price}</div>
                        {
                            !!productObj.discount &&
                            <Fragment>
                                <div className="actual-price">
                                    ₹ {productObj.total_price}
                                </div>
                                <div className="discount">
                                    (Saved ₹ {productObj.total_price - productObj.effective_price})
                                </div>
                            </Fragment>
                        }
                    </div>
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className="order-card">
                <div className={`order-card-header ${this.getStatusClass(this.props.data.order_status)}`}>
                    <div className="row">
                        <div className="order-id"><b>Order #{this.props.data._id}</b></div>
                        <div className="order-status">
                            Order Status: <b className={`${this.getStatusClass(this.props.data.order_status)}`}>{this.props.data.order_status}</b>
                        </div>
                        <div className="amount-paid">Amount Paid: <b>₹ {this.props.data.total_price}</b></div>
                    </div>
                    <div className="row">
                        <div className="view-details" onClick={()=>{this.props.handleViewDetails(this.props.data._id)}}>View Order details</div>
                    </div>

                </div>
                <div className="order-card-content">

                    <Fragment>
                        {
                            this.props.data.order_data.map((productObj, idxx)=>(
                                this.getOrderProductsJSX(productObj, idxx)
                            ))
                        }
                    </Fragment>
                </div>
            </div>
        )
    }
}

export default OrdersCard;