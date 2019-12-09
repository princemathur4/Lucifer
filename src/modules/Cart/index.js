import React, { Fragment } from 'react';
import commonApi from "../../apis/common";
import { getSession } from "../../utils/AuthUtils";
import './style.scss';
import Spinner from "../../components/Spinner";
import { productFilters } from '../../constants';

class Cart extends React.Component {

    state = {
        isCartLoading: true,
        cartProducts: [],
        cartTotal: 0
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
            } else {
                this.setState({ isCartLoading: false });
            }
        }
        catch (e) {
            console.log("error", e);
            this.setState({ isCartLoading: false });
        }
    }

    getTotal = () => {
        let total = 0;
        this.state.cartProducts.forEach((productObj, idx) => {
            total += productObj.effective_price
        })
        return total;
    }

    getPriceDetails = () => {

        return (
            <div className="field-content">
                <div className="field-item">
                    <div className="field-item-key">Cart Total</div>
                    <div className="field-item-key">₹ {}</div>
                </div>
            </div>
        )
    }

    render() {
        return (
            <Fragment>
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
                                    {this.state.cartProducts.length} Items
                                </div>
                                <div className="total">
                                    Total Payable: Rs. {this.getTotal()}
                                </div>
                            </div>
                            {
                                this.state.isCartLoading
                                    ?
                                    <div className="loader-container">
                                        <Spinner color="primary" size="medium" />
                                    </div>
                                    :
                                    (
                                        this.state.cartProducts.length ?
                                            <Fragment>
                                                <div className="products-summary-container">
                                                    {this.state.cartProducts.map((productObj, idx) => {
                                                        return (
                                                            <div className="product-card">
                                                                <div className="product-thumbnail-image">
                                                                    <img src="https://i.ibb.co/48hHjC8/Plum-01-900x.png" className="product-thumbnail-image" />
                                                                </div>
                                                                <div className="product-details">
                                                                    <div className="first-row">
                                                                        <div className="product-name">{productObj.description ? productObj.description : "Product Description"}</div>
                                                                        <div className="price">Rs. {productObj.effective_price}</div>
                                                                    </div>
                                                                    <div className="second-row">
                                                                        <div className="actual-price">Rs. {productObj.price}</div>
                                                                        <div className="discount">{productObj.discount} %</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                    }
                                                </div>
                                            </Fragment>
                                            :
                                            <div className="no-cart-items">
                                                No items present in cart
                                    </div>
                                    )
                            }
                        </div>
                        <div className="right-container">
                            <div className="field-container">
                                <div className="field-title">Price Details</div>
                                {/* {this.getPriceDetails()} */}
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}
export default Cart;