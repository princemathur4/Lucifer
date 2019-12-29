import React, { Fragment } from 'react';
import commonApi from "../../apis/common";
import { getSession } from "../../utils/AuthUtils";
import './style.scss';
import Spinner from "../../components/Spinner";
import findindex from "lodash.findindex";
import Addresses from '../../components/Addresses';
import CartItem from '../../components/CartItem';
import { Radio } from 'semantic-ui-react';
import VerifyMobile from '../../components/VerifyMobile';
import { orderResponse } from "../../constants";

export default class Cart extends React.Component {
    constructor(props){
        super(props)
    }
    state = {
        mode: "review",
        reviewed: false,
        addressSelected: {},
        cartProducts: [],
        actualCartTotal: 0,
        discountedTotal: 0,
        order_id: "",
        isCartLoading: true,
        productLoader: { product_id: '' },
        removeBtnLoader: { product_id: '' },
        addressLoader: false,
        proceedLoader: false,
        paymentMode: "",
        mobile: "",
        otpVerified: false,
        orderResponse: {
            // ...orderResponse.data
        },
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

    async updateCart(product_id, count) {
        let session = await getSession();
        try {
            let response = await commonApi.post(`update_cart`,
                { product_id: product_id, count: count },
                { headers: { "Authorization": session.accessToken.jwtToken } }
            );
            console.log("cart update response", response);
            if (response.data && response.data.success) {
                this.fetchCartItems(true);
            }
        }
        catch (e) {
            console.log("error", e);
        }
    }

    async makeCheckoutApiCall() {
        let session = await getSession();
        let address_id = this.state.addressSelected;
        let payment_mode = this.state.paymentMode;
        try {
            let response = await commonApi.post(`checkout`,
                { address_id , payment_mode },
                { headers: { "Authorization": session.accessToken.jwtToken } }
            );
            console.log("checkout response", response);
            if (response.data && response.data.success) {
                this.order_id = response.data.data.orderId;
                if(payment_mode === "COD"){
                    this.verifyPayment({ order_id: this.order_id });
                }else{
                    this.setState({ proceedLoader: false });
                    this.payNow();
                }
            } else {
                this.setState({ proceedLoader: false });
                // TODO: show popup message in this case 
            }
        }
        catch (e) {
            console.log("error", e);
            this.setState({ proceedLoader: false });
            // TODO: show popup message in this case
        }
    }

    async verifyPayment(payload) {
        let session = await getSession();
        try {
            let response = await commonApi.post(`verify_payment`,
                { ...payload },
                { headers: { "Authorization": session.accessToken.jwtToken } }
            );
            console.log("verify payment response", response);
            if (response.data && response.data.success) {
                this.setState({ proceedLoader: false, orderResponse: response.data.data });
            } else {
                this.setState({ proceedLoader: false });
            }
        }
        catch (e) {
            console.log("error", e);
            this.setState({ proceedLoader: false });
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
        let mode = this.state.mode;
        if (mode === "review") {
            this.setState({ mode: "address", reviewed: true });
        }
        else if (mode === "address") {
            this.setState({ mode: 'payment' });
        }
        else if (mode === "payment") {
            this.setState({ proceedLoader: true });
            if (this.state.paymentMode === "RAZORPAY") {
                this.makeCheckoutApiCall();
            } else {
                this.makeCheckoutApiCall();
            }
        }
        // else if(mode === "COD"){
            
        // }
    }

    payNow = () => {
        let self = this;
        var options = {
            "key": process.env.RAZORPAY_API_KEY, // TODO: (get from config) Enter the Key ID generated from the Dashboard
            "amount": this.state.discountedTotal,
            "currency": "INR",
            "name": "Labroz Denim",
            "description": "",
            "image": "https://i.ibb.co/WyZrjkf/larboz-logo.png",
            "order_id": self.order_id, //This is a sample Order ID. Create an Order using Orders API. (https://razorpay.com/docs/payment-gateway/orders/integration/#step-1-create-an-order). Refer the Checkout form table given below
            "handler": function (response) {
                console.log("razorpay response: ", response);
                let payload = { 
                    razorpay_order_id: response.razorpay_order_id, 
                    razorpay_payment_id: response.razorpay_payment_id, 
                    razorpay_signature: response.razorpay_signature 
                }
                self.verifyPayment(payload);
            },
            "prefill": {
                "name": this.state.addressSelected.name,
                "contact": this.state.addressSelected.mobile
            },
            "theme": {
                "color": "#007b8b"
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

    onPaymentModeSelect = (e, obj) => {
        this.setState({ [obj.name]: obj.value });
    }

    handleAddressChange = (obj) => {
        console.log(obj);
        this.setState({ addressSelected: obj });
    }

    handleVerificationResult = (otpVerified, mobile) =>{
        this.setState({ otpVerified, mobile  });
    }

    render() {
        return (
            <Fragment>
                <div className="cart-container">
                    {
                        this.state.isCartLoading
                            ?
                            <div className="loader-container">
                                <Spinner color="primary" size="medium" />
                            </div>
                            :
                            (
                                !this.state.cartProducts.length ?
                                <div className="cart-content">
                                    <div className="no-cart-items">
                                        <img src="https://i.ibb.co/pjfqTYW/cart-512.png" className="no-items-img"/>
                                        No items present in cart
                                    </div>
                                </div>
                                :
                            (!Object.keys(this.state.orderResponse).length ?
                            <Fragment>
                                <div className="breadcrumbs">
                                    <div className={this.state.mode === "review" ? 
                                        (this.state.reviewed ? "item is-active link": "item is-active" ) : 
                                            (this.state.reviewed ? "item link" : "item" )
                                        }
                                        onClick={()=>{ this.state.reviewed && this.setState({ mode: "review" })}}
                                        >Review Cart</div>
                                    <div className="arrow-item"> ▶</div>
                                    <div className={this.state.mode === "address" ? 
                                        ( !!Object.keys(this.state.addressSelected).length ? "item is-active link": "item is-active" ) :
                                            (!!Object.keys(this.state.addressSelected).length ? "item link": "item")
                                        }
                                        onClick={()=>{ !!Object.keys(this.state.addressSelected).length && this.setState({ mode: "address" })}}
                                    > Address</div>
                                    <div className="arrow-item"> ▶</div>
                                    <div className={this.state.mode === "payment" ? "item is-active" : "item"}> Payment</div>
                                </div>
                                <div className="cart-content">
                                    {this.state.cartProducts.length &&
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
                                                                        {...this.props}
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
                                                    <Addresses
                                                        {...this.props}
                                                        addBtnPosition="card"
                                                        radio={{
                                                            name: "address",
                                                            selected: this.state.addressSelected._id,
                                                            handleRadioChange: this.handleAddressChange,
                                                            title: "Select Address for delivery"
                                                        }}
                                                    />
                                                }
                                                {this.state.mode === "payment" &&
                                                    <div className="payment-mode-container">
                                                        <div className="payment-mode-title">How would you like to pay?</div>
                                                        <div className="payment-mode-content">
                                                            <Radio
                                                                name="paymentMode"
                                                                value="RAZORPAY"
                                                                checked={this.state.paymentMode === "RAZORPAY"}
                                                                onChange={this.onPaymentModeSelect}
                                                                label={
                                                                    <label className="payment-mode-label">Secure Online Payment</label>
                                                                }
                                                            />
                                                            <Radio
                                                                name="paymentMode"
                                                                value="COD"
                                                                checked={this.state.paymentMode === "COD"}
                                                                onChange={this.onPaymentModeSelect}
                                                                label={
                                                                    <label className="payment-mode-label">Cash On Delivery</label>
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                }
                                                {this.state.mode === "COD" &&
                                                    <VerifyMobile 
                                                        {...this.props}
                                                        onVerificationResult={this.handleVerificationResult}
                                                    />
                                                }
                                            </div>
                                            <div className="right-container">
                                                {
                                                    this.state.mode === "review" &&
                                                    <button className="button is-link is-fullwidth cart-btn"
                                                        onClick={this.handleCheckout}
                                                    >Checkout</button>
                                                }
                                                {
                                                    this.state.mode === "address" &&
                                                    <button className="button is-link is-fullwidth cart-btn"
                                                        disabled={!this.state.addressSelected._id}
                                                        onClick={this.handleCheckout}
                                                    >Proceed to Payment</button>
                                                }
                                                {
                                                    this.state.mode === "payment" &&
                                                    <button className={this.state.proceedLoader ? "button is-link is-fullwidth cart-btn is-loading" : "button is-link is-fullwidth cart-btn"}
                                                        disabled={!this.state.paymentMode}
                                                        onClick={this.handleCheckout}
                                                    >Proceed</button>
                                                }
                                                {
                                                    this.state.mode === "COD" &&
                                                    <button className={this.state.codLoader ? "button is-link is-fullwidth cart-btn is-loading" : "button is-link is-fullwidth cart-btn"}
                                                        disabled={!this.state.otpVerified}
                                                        onClick={this.handleCheckout}
                                                    >Place Order</button>
                                                }
                                                {this.getBillingDetails()}
                                            </div>
                                        </Fragment>
                                    }
                                </div>
                            </Fragment>
                            :
                            <div className="order-response-container">
                                <img src="https://i.ibb.co/0GR5fXj/payment-successful.png" />
                                <div className="title">Thank you. We got your order.</div>
                                <div className="order-number-text">Your Order ID is: <b>{this.order_id}</b></div>
                                <div className="order-subtext">We're processing your order and will also be sending you an email confirmation shortly.</div>
                                <button className="button view-order-btn is-info is-light"
                                    // onClick={this.props.history.push(`/orders?id=${this.order_id}`)}
                                    >View Order Details
                                </button>
                            </div>
                            )
                            )
                    }
                </div>
            </Fragment>
        )
    }
}