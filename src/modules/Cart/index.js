import React, { Fragment } from 'react';
import commonApi from "../../apis/common";
import { getSession } from "../../utils/AuthUtils";
import './style.scss';
import Spinner from "../../components/Spinner";
import findindex from "lodash.findindex";
import Addresses from '../../components/Addresses';
import Address from '../../components/Address';
import CartItem from '../../components/CartItem';

class Cart extends React.Component {

    state = {
        mode: "review",
        actionBtntext: "Checkout",
        isCartLoading: true,
        cartProducts: [],
        addresses: [],
        actualCartTotal: 0,
        discountedTotal: 0,
        order_id: "",
        productLoader: { product_id: '' },
        removeBtnLoader: { product_id: '' },
        addressLoader: false
    }

    componentDidMount() {
        this.fetchCartItems();
    }

    async fetchCartItems(isUpdate) {
        if (!this.props.auth.isAuthenticated) {
            this.props.handleLoginWarning();
            return;
        }
        if (!isUpdate) {
            this.setState({ isCartLoading: true });
        }
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
            if (isUpdate) {
                this.setState({ removeBtnLoader: { product_id: "" }, productLoader: { product_id: "" } });
            }
        }
        catch (e) {
            console.log("error", e);
            this.setState({ isCartLoading: false });
            if (isUpdate) {
                this.setState({ removeBtnLoader: { product_id: "" }, productLoader: { product_id: "" } });
            }
        }
    }

    async fetchAddresses() {
        let session = await getSession();
        console.log("addresses token", session.accessToken.jwtToken);
        this.setState({ addressLoader: true });
        try {
            let response = await commonApi.get('get_addresses',
                {
                    params: {},
                    headers: { Authorization: session.accessToken.jwtToken }
                }
            );
            console.log("response", response);
            if (response.data && response.data.success) {
                this.setState({ addresses: response.data.data, addressLoader: false });
            } else {
                this.setState({ addresses: [], isLoading: false });
            }
        }
        catch (e) {
            console.log("error", e);
            this.setState({ addresses: [], addressLoader: false });
        }
    }

    async makeCheckoutApiCall() {
        let session = await getSession();
        let address_id = this.state.addressSelected;
        try {
            let response = await commonApi.post(`checkout`,
                { address_id },
                { headers: { "Authorization": session.accessToken.jwtToken } }
            );
            console.log("post checkout response", response);
            if (response.data && response.data.success) {
                this.order_id = response.data.data.orderId;
                // this.calculateTotal();
            }
        }
        catch (e) {
            console.log("error", e);
        }
    }

    async updateCart(product_id, count) {

        // this.setState({ isCartLoading: true });
        let session = await getSession();
        try {
            let response = await commonApi.post(`update_cart`,
                { product_id: product_id, count: count },
                { headers: { "Authorization": session.accessToken.jwtToken } }
            );
            console.log("cart update response", response);
            if (response.data && response.data.success) {
                // this.setState({ isCartLoading: false });
                this.fetchCartItems(true);
            } else {
                // this.setState({ isCartLoading: false });
            }
        }
        catch (e) {
            console.log("error", e);
            // this.setState({ isCartLoading: false });
        }
    }

    handleQuantityChange = (product_id, input) => {
        let objIdx = findindex(this.state.cartProducts, { product_id: product_id });
        let cartProducts = [...this.state.cartProducts]
        let obj = { ...this.state.cartProducts[objIdx] };
        obj.count += input;

        // TODO: show validation messages
        if (obj.count === 0) {
            return;
        } else if (obj.count > 10) {
            return;
        } else if (obj.count > obj.stock) {
            return;
        }
        cartProducts[objIdx] = obj;
        this.setState({
            // cartProducts: cartProducts, 
            productLoader: { product_id }
        });
        this.calculateTotal();
        this.updateCart(product_id, obj.count);
    }

    async handleRemoveProduct(product_id) {
        this.setState({ removeBtnLoader: { product_id } });
        this.updateCart(product_id, 0);
    }

    handleCheckout = () => {
        if(this.state.mode === "review"){
            this.setState({ mode: "address", actionBtntext: "Proceed to Payment" });
        }else{
            this.makeCheckoutApiCall();
            // this.setState({ mode: "address", actionBtntext: "Proceed to Payment" });
        }
        // this.fetchAddresses();
        // this.makeCheckoutApiCall();
    }

    handlePayNow = () => {

        var options = {
            "key": "rzp_test_we3gJ1CG1NucG3", // Enter the Key ID generated from the Dashboard
            "amount": "50000", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise or INR 500.
            "currency": "INR",
            "name": "Acme Corp",
            "description": "A Wild Sheep Chase is the third novel by Japanese author  Haruki Murakami",
            "image": "https://example.com/your_logo",
            "order_id": this.order_id,//This is a sample Order ID. Create an Order using Orders API. (https://razorpay.com/docs/payment-gateway/orders/integration/#step-1-create-an-order). Refer the Checkout form table given below
            "handler": function (response) {
                console.log("razorpay response: ", response);
            },
            "prefill": {
                "name": "Gaurav Kumar",
                "email": "gaurav.kumar@example.com",
                "contact": "9999999999"
            },
            "notes": {
                "address": "note value"
            },
            "theme": {
                "color": "#F37254"
            }
        };
        var rzp1 = new Razorpay(options);
        rzp1.open();
    }

    calculateTotal = () => {
        let actualCartTotal = 0;
        let totalDiscount = 0;
        let discountedTotal = 0;
        this.state.cartProducts.forEach((productObj, idx) => {
            actualCartTotal += (productObj.price * productObj.count);
            discountedTotal += ((productObj.price * productObj.count) - ((productObj.price * productObj.count) * (productObj.discount / 100)));
            totalDiscount += ((productObj.price * productObj.count) * (productObj.discount / 100));
        })
        this.setState({ actualCartTotal, totalDiscount, discountedTotal });
    }

    getBillingDetails = () => {
        return (
            <div className="field-container">
                <div className="field-title">BILLING DETAILS</div>
                <div className="field-content">
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
                </div>
            </div>
        )
    }

    handleRadioChange = (e, obj) =>{
        console.log(e, obj);
        this.setState({ addressSelected: obj.value })
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
                            <div className="breadcrumbs">
                                <div className={this.state.mode === "review" ? "item is-active" : "item"}>Review Cart</div>
                                <div className="item"> ▶</div>
                                <div className={this.state.mode === "address" ? "item is-active" : "item"}> Address</div>
                                <div className="item"> ▶</div>
                                <div className={this.state.mode === "payment" ? "item is-active" : "item"}> Payment</div>
                            </div>
                            <div className="cart-content">
                                {this.state.cartProducts.length ?
                                    <Fragment>
                                        <div className="left-container">
                                            {this.state.mode === "review" &&
                                                <Fragment>
                                                    <div className="header">
                                                        <div className="items">
                                                            {this.state.cartProducts.length} Items in Cart
                                                        </div>
                                                        <div className="total">
                                                            Total Payable: ₹ {this.state.discountedTotal}
                                                        </div>
                                                    </div>
                                                    <div className="products-summary-container">
                                                        {this.state.cartProducts.map((productObj, idx) => {
                                                            return (
                                                                <CartItem 
                                                                    productObj={productObj} 
                                                                    loader={this.state.productLoader}
                                                                    key={idx}
                                                                    handleQuantityChange={this.handleQuantityChange.bind(this)}  
                                                                    handleRemoveProduct={this.handleRemoveProduct.bind(this)}
                                                                    removeBtnLoader={this.state.removeBtnLoader}
                                                                />
                                                            )
                                                        })
                                                        }
                                                    </div>
                                                </Fragment>
                                            }
                                            {this.state.mode === "address" &&
                                            (
                                                this.state.addressLoader ?
                                                    <div className="loader-container">
                                                        <Spinner color="primary" size="medium" />
                                                    </div>
                                                    :
                                                    <Addresses 
                                                        {...this.props}
                                                        addBtnPosition="card"
                                                        radio={{
                                                            name: "address",
                                                            selected: this.state.addressSelected,
                                                            handleRadioChange: this.handleRadioChange,
                                                            title: "Select Address for delivery"
                                                        }}
                                                    />
                                            )
                                            }
                                        </div>
                                        <div className="right-container">
                                            <button className="button is-link is-fullwidth cart-btn"
                                                onClick={this.handleCheckout}
                                            >{this.state.actionBtntext}</button>
                                            {/* <button className="button is-link is-fullwidth cart-btn"
                                                onClick={this.handlePayNow}
                                            >Pay Now!</button> */}
                                            {this.getBillingDetails()}
                                        </div>
                                    </Fragment>
                                    :
                                    <div className="no-cart-items">
                                        No items present in cart
                                    </div>
                                }
                            </div>
                        </div>
                }
            </Fragment>
        )
    }
}
export default Cart;