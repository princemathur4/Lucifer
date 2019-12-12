import React, { Fragment, Component } from "react";
import Spinner from "../../components/Spinner";

export default class CartItem extends Component {
    constructor(props){
        super(props)
    }

    handleProductImageClick = ()=>{
        let product_id = this.props.productObj.product_id.split(`_${this.props.productObj.size}`)[0];
        this.props.history.push(`/product?id=${product_id}`);
    }

    render () {
        let data = this.props.productObj;
        let actualPrice = data.count > 1 ?
            `₹ ${data.price} x ${data.count}` :
            `₹ ${data.price}`;

        let calculatedPrice = data.count > 1 ?
            `₹ ${(data.price - (data.price * (data.discount / 100)))} x ${data.count}` :
            `₹ ${(data.price - (data.price * (data.discount / 100)))}`;

        let leftCount = data.stock <= 10 ? data.stock : 0;

        return (
            <div className="product-card">
                {this.props.loader.product_id === data.product_id ?
                    <div className="loader-container">
                        <Spinner color="primary" size="small" />
                    </div>
                    :
                    <Fragment>
                        <div className="product-thumbnail-container" onClick={this.handleProductImageClick}>
                            <img src="https://i.ibb.co/48hHjC8/Plum-01-900x.png" className="product-thumbnail-image" />
                        </div>
                        <div className="product-details">
                            <div className="first-row">
                                <div className="product-name" onClick={this.handleProductImageClick}>{data.description ? data.description : "Product Description"}</div>
                                <div className="price">{calculatedPrice}</div>
                            </div>
                            <div className="second-row">
                                {
                                    !!data.discount &&
                                    <Fragment>
                                        <div className="actual-price">
                                            {actualPrice}
                                        </div>
                                        <div className="discount">
                                            {data.discount}%
                                        </div>
                                    </Fragment>
                                }
                            </div>
                            <div className="third-row">
                                <div className="size">Size: <b>{data.size}</b></div>
                            </div>
                            <div className="fourth-row">
                                <div className="quantity"> Quantity:  </div>
                                <button className="button is-light is-info is-small"
                                    onClick={() => { this.props.handleQuantityChange(data.product_id, -1) }}
                                >－</button>
                                <div className="count">{data.count}</div>
                                <button className="button is-light is-info is-small"
                                    onClick={() => { this.props.handleQuantityChange(data.product_id, 1) }}
                                >＋</button>
                                {
                                    !!leftCount &&
                                    <div className="size-available-warning">
                                        <span class="tag is-danger is-light">{leftCount} Left</span>
                                    </div>
                                }
                            </div>
                            <div className="bottom-container">
                                <button className={this.props.removeBtnLoader.product_id === data.product_id ? "button remove-btn is-loading" : "button remove-btn"}
                                    onClick={() => { this.props.handleRemoveProduct(data.product_id) }}
                                >Remove</button>
                            </div>
                        </div>
                    </Fragment>
                }
            </div>
        )
    }
}