import React, { Fragment } from 'react';
import commonApi from "../../apis/common";
import { getSession } from "../../utils/AuthUtils";
import './style.scss';
import Spinner from "../../components/Spinner";
import findindex from "lodash.findindex";

class Cart extends React.Component {

    state = {
        isCartLoading: true,
        cartProducts: [],
        cartTotal: 0,
        total: 0
    }

    componentDidMount() {
        this.fetchCartItems()
    }

    async fetchCartItems() {
        if (!this.props.auth.isAuthenticated) {
            this.props.handleLoginWarning();
            return;
        }
        this.setState({ isCartLoading: true });
        let session = await getSession();
        try {
            let response = await commonApi.get(`cart`,
                {
                    params: {},
                    headers: { "Authorization": session.accessToken.jwtToken }
                },
            );
            console.log("get cart response", response);
            if (response.data && response.data.success) {
                this.setState({ cartProducts: response.data.data, isCartLoading: false });
                this.calculateTotal();
            } else {
                this.setState({ isCartLoading: false });
            }
        }
        catch (e) {
            console.log("error", e);
            this.setState({ isCartLoading: false });
        }
    }

    async updateCart(product_id, count){

        this.setState({ isCartLoading: true });
        let session = await getSession();
        try {
            let response = await commonApi.post(`update_cart`,
                { product_id: product_id, count: count },
                { headers: { "Authorization": session.accessToken.jwtToken } }
            );
            console.log("cart update response", response);
            if (response.data && response.data.success) {
                this.setState({ isCartLoading: false });
                this.fetchCartItems();
            } else {
                this.setState({ isCartLoading: false });
            }
        }
        catch (e) {
            console.log("error", e);
            this.setState({ isCartLoading: false });
        }
    }

    handleQuantityChange = (product_id, input) => {
        let objIdx = findindex(this.state.cartProducts, { product_id: product_id});
        let cartProducts = [...this.state.cartProducts]
        let obj = { ...this.state.cartProducts[objIdx]};
        obj.count += input;

        // TODO: show validation messages
        if(obj.count === 0) {
            return;
        } else if(obj.count > 10) {
            return;
        } else if(obj.count > obj.stock){
            return;
        }
        cartProducts[objIdx] = obj;
        this.setState({ cartProducts: cartProducts });
        this.calculateTotal();
        // this.updateCart(product_id, obj.count);
    }

    handleRemoveProduct = (product_id) => {
        this.updateCart(product_id, 0);   
    }

    handleCheckout = () => {
        this.updateCart(product_id, 0);   
    }

    calculateTotal = () => {
        let cartTotal = 0;
        let totalDiscount = 0;
        let total = 0;
        this.state.cartProducts.forEach((productObj, idx) => {
            cartTotal += (productObj.price * productObj.count);
            total += (productObj.effective_price * productObj.count);
            totalDiscount += ((productObj.price * productObj.count) - (productObj.effective_price * productObj.count));
        })
        this.setState({ cartTotal, totalDiscount, total });
    }

    getBillingDetails = () => {
        return (
            <div className="field-container">
                <div className="field-title">BILLING DETAILS</div>
                <div className="field-content">
                    <div className="field-item">
                        <div className="field-item-key">Cart Total</div>
                        <div className="field-item-value">₹ {this.state.cartTotal}</div>
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
                        <div className="field-item-value">₹ {this.state.total}</div>
                    </div>
                </div>
            </div>
        )
    }

    getProductCard = (productObj) => {
        let price = productObj.count > 1 ?
            `₹ ${productObj.effective_price} x ${productObj.count}`:
            `₹ ${productObj.effective_price}`;

        let actualPrice = productObj.count > 1 ?
            `₹ ${productObj.price} x ${productObj.count}`:
            `₹ ${productObj.price}`;
        let leftCount = productObj.stock <= 10 ? productObj.stock : 0;
        return(
            <div className="product-card">
                <div className="product-thumbnail-container">
                    <img src="https://i.ibb.co/48hHjC8/Plum-01-900x.png" className="product-thumbnail-image" />
                </div>
                <div className="product-details">
                    <div className="first-row">
                        <div className="product-name">{productObj.description ? productObj.description : "Product Description"}</div>
                        <div className="price">{price}</div>
                    </div>
                    <div className="second-row">
                        <div className="actual-price">
                            {actualPrice}
                        </div>
                    </div>
                    <div className="third-row">
                        <div className="size">Size: <b>{productObj.size}</b></div>
                    </div>
                    <div className="fourth-row">
                        <div className="quantity"> Quantity:  </div>
                        <button className="button is-light is-info is-small"
                            onClick={() => { this.handleQuantityChange(productObj.product_id, -1) }}
                        >－</button>
                        <div className="count">{productObj.count}</div>
                        <button className="button is-light is-info is-small"
                            onClick={() => { this.handleQuantityChange(productObj.product_id, 1) }}
                        >＋</button>
                        {
                            !!leftCount &&
                            <div className="size-available-warning">
                                <span class="tag is-danger is-light">{leftCount} Left</span>
                            </div>
                        }
                    </div>
                    <div className="bottom-container">
                        <button className="button remove-btn"
                            onClick={()=>{this.handleRemoveProduct(productObj.product_id)}}
                        >Remove</button>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        return (
            <Fragment>
                {
                    this.state.isCartLoading
                        ?
                        <div className="loader-container">
                            <Spinner color="primary" size="medium" />
                        </div>
                        :
                        <div className="cart-container">
                            <div class="breadcrumbs">
                                <div className="item is-active">Review Cart</div>
                                <div className="item"> ▶</div>
                                <div className="item"> Address</div>
                                <div className="item"> ▶</div>
                                <div className="item"> Payment</div>
                            </div>
                            <div className="cart-content">
                                <div className="left-container">
                                    <div className="header">
                                        <div className="items">
                                            {this.state.cartProducts.length} Items in Cart
                                </div>
                                        <div className="total">
                                            Total Payable: ₹ {this.state.total}
                                        </div>
                                    </div>
                                    {
                                        this.state.cartProducts.length ?
                                            <Fragment>
                                                <div className="products-summary-container">
                                                    {this.state.cartProducts.map((productObj, idx) => {
                                                        return(this.getProductCard(productObj, idx))
                                                    })
                                                    }
                                                </div>
                                            </Fragment>
                                            :
                                            <div className="no-cart-items">
                                                No items present in cart
                                            </div>
                                    }
                                </div>
                                <div className="right-container">
                                    <button className="button is-link is-fullwidth cart-btn"
                                        onClick={this.handleCheckout}
                                    >Checkout</button>
                                    {this.getBillingDetails()}
                                </div>
                            </div>
                        </div>
                }
            </Fragment>
        )
    }
}
export default Cart;