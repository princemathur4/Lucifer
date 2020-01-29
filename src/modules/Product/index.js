import React, { Fragment } from 'react';
import { Link } from "react-router-dom";
import { observer } from 'mobx-react';
import "./style.scss";
import { getParameterByName } from '../../utils/Browser';
import commonApi from "../../apis/common";
import { getSession } from "../../utils/AuthUtils";
import Spinner from "../../components/Spinner";
import { toJS } from 'mobx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { titleCase } from "../../utils/utilFunctions";
import { fetchCartItems } from '../../utils/ProductUtils';

class Product extends React.Component {
    constructor(props) {
        super(props);
        this._id = '';
        this.state = {
            productLoaderActive: true,
            activeSize: "",
            sizeSelectWarning: false,
            isAddingToCartLoading: false,
            pincode: "",
            pincodeValidationMsg: "",
            pincodeValidationStatus: "",
            pincodeCheckLoading: false,
            activeImageindex: 0,
            loginModalActive: false,
            mode: "view",
            responseText: "",
            responseType: "error",
            sizeOptions: [],
            stock: 0,
            payload: {},
            errors: {
                title: false,
                description: false,
                color: false,
                color_code: false,
                fit: false,
                fabric: false,
                title: false,
            }
        }
    }

    componentDidMount() {
        this.product_id = getParameterByName('id', window.location.href);
        this.makeGetProductApiCall(this.product_id);
    }

    handleLoginWarning = () => {
        this.setState({ loginModalActive: true });
    }

    handleCloseModal = () => {
        this.setState({ loginModalActive: false });
    }

    async makeGetProductApiCall() {
        this.setState({ productLoaderActive: true });
        try {
            let response = await commonApi.get(`products/${this.product_id}`,
                {
                    params: {},
                }
            );
            console.log("product response", response);
            if (response.data && response.data.success) {
                this.setState({ productData: response.data.data[0], productLoaderActive: false });
            } else {
                this.setState({ productData: {}, productLoaderActive: false });
            }
        }
        catch (e) {
            console.log("error", e);
            this.setState({ productData: {}, productLoaderActive: false });
        }
    }

    async handleCartToggle(e) {
        e.stopPropagation();

        if (!this.props.auth.isAuthenticated) {
            this.handleLoginWarning();
            return;
        }
        if (!this.state.activeSize) {
            this.setState({ sizeSelectWarning: true });
            return;
        }
        this.setState({ isAddingToCartLoading: true, sizeSelectWarning: false });
        let session = await getSession();
        let product_id = this.state.productData.variants[this.state.activeSize]._id;
        try {
            let response = await commonApi.post(`update_cart`,
                { product_id: product_id, count: 1 },
                { headers: { "Authorization": session.accessToken.jwtToken } }
            );
            console.log("cart product response", response);
            if (response.data && response.data.success) {
                this.setState({ isAddingToCartLoading: false });
                fetchCartItems();
            } else {
                this.setState({ isAddingToCartLoading: false });
            }
        }
        catch (e) {
            console.log("error", e);
            this.setState({ isAddingToCartLoading: false });
        }
    }

    async handleVerifyPincode(e) {
        e.stopPropagation();

        if (!this.props.auth.isAuthenticated) {
            this.handleLoginWarning();
            return;
        }
        if (!this.state.pincode || isNaN(this.state.pincode) || this.state.pincode.length !== 6) {
            this.setState({ pincodeValidationMsg: "Enter a valid Pincode", pincodeValidationStatus: 'error' });
            return;
        }
        this.setState({ pincodeCheckLoading: true, sizeSelectWarning: false });
        let session = await getSession();
        let product_id = this.props.productData.variants[this.state.activeSize]._id;
        try {
            let response = await commonApi.post(`update_cart`,
                { product_id: product_id, count: 1 },
                { headers: { "Authorization": session.accessToken.jwtToken } }
            );
            console.log("wishlist response", response);
            if (response.data && response.data.success) {
                this.setState({ pincodeValidationMsg: response.data.message, pincodeValidationStatus: 'success', pincodeCheckLoading: false });
            } else {
                this.setState({ pincodeValidationMsg: response.data.message, pincodeValidationStatus: 'error', pincodeCheckLoading: false });
            }
        }
        catch (e) {
            console.log("error", e);
            this.setState({ pincodeValidationMsg: 'Please try again', pincodeValidationStatus: 'error', pincodeCheckLoading: false });
        }
    }

    handleSubmit = async () => {
        if (!this.state.payload.size && !this.state.activeSize) {
            this.setState({
                responseText: "Please select a size or enter manually in input",
                responseType: "error"
            })
        }
        let size = this.state.payload.size ? this.state.payload.size : this.state.activeSize;
        if (!this.state.payload.stock && (!Object.keys(this.state.payload).length) && 
            this.state.productData.available_sizes.includes(size)
        ){
            this.setState({
                responseText: "Update a field before submitting",
                responseType: "error"
            })
        }
        let payload = { size: size, product_code: this.state.productData._id, ...this.state.payload };
        if (this.state.payload.stock) {
            payload = { ...payload, stock: Number(this.state.payload.stock) }
        }
        let session = await getSession();
        if (!session) {
            return;
        }
        let response;
        try {
            response = await commonApi.post(
                'update_product_stock', payload, { headers: { "Authorization": session.accessToken.jwtToken } }
            );
            console.log("response", response);
            if (response && response.status === 200 && response.data.success) {
                this.setState({
                    productResults: response.data.data.products,
                    productListLoader: false
                });
            } else {
                this.setState({
                    productResults: [],
                    productListLoader: false,
                    responseType: "error",
                    responseText: response.data.message
                });
            }
        } catch (err) {
            this.setState({

            });
        }
    }

    getPriceJSX = () => {
        let discount = this.state.productData.discount;
        let price = discount ?
                this.state.productData.price - Math.round(this.state.productData.price * discount / 100) :
                    this.state.productData.price;

        return (
            <Fragment>
                <p className="price-text">Rs. {price}</p>
                {
                    !!discount &&
                    <Fragment>
                        <p className="actual-price-text">Rs. {this.state.productData.price}</p>
                        <p className="discount-text">({discount}% OFF)</p>
                    </Fragment>
                }
            </Fragment>
        )
    }

    handleSizeSelect = (size) => {
        if (this.state.activeSize === size) {
            this.setState({ activeSize: '' });
        } else {
            this.setState({ activeSize: size });
        }
    }

    getSizesJSX = () => {
        let allSizes = this.state.productData.available_sizes;
        return (
            <Fragment>
                {
                    allSizes.map((size, idx) => {
                        return (
                            <div className="size-box-content">
                                <button
                                    className={
                                        this.state.activeSize === size ?
                                            "size-box active" :
                                            (this.state.productData.variants[size].stock === 0 ? "size-box disabled" : "size-box")
                                    }
                                    disabled={this.state.productData.variants[size].stock === 0}
                                    onClick={() => { this.handleSizeSelect(size) }}
                                >
                                    {size}
                                </button>
                                {
                                    !!this.state.productData.variants[size].stock && this.state.productData.variants[size].stock <= 10 &&
                                    <div className="size-availablity-label warning">
                                        {this.state.productData.variants[size].stock + " Left"}
                                    </div>
                                }
                            </div>
                        )
                    })
                }
            </Fragment>
        )
    }

    getInputJSX = (name, type) => {
        return (
            <div className={this.state.errors[name] ? "control is-danger" : "control"}
            >
                <input
                    placeholder={"Enter " + titleCase(name)}
                    className={this.state.errors[name] ? "input editable-input is-danger" : "input editable-input"}
                    type={type}
                    name={name}
                    value={this.state.payload.hasOwnProperty(name) ? this.state.payload[name] : this.state.productData[name]}
                    onChange={this.onPayloadChange}
                />
            </div>
        )
    }

    onPayloadChange = event => {
        let payload = { ...this.state.payload };
        payload[event.target.name] = event.target.value;
        this.setState({
            payload
        });
    };

    onInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    changeActiveImage = (input) => {
        let newIndex = (this.state.activeImageindex + input);
        if (newIndex === -1) {
            newIndex = this.state.productData.images.length - 1;
        }
        else if (newIndex === this.state.productData.images.length) {
            newIndex = 0;
        }
        this.setState({ activeImageindex: newIndex });
    }

    setActiveImage = (input) => {
        this.setState({ activeImageindex: input });
    }

    changeMode = (mode) => {
        this.setState({
            mode
        })
    }

    render() {
        let adminuser = this.props.auth.user &&
            this.props.auth.user.signInUserSession.accessToken.hasOwnProperty("payload") &&
            this.props.auth.user.signInUserSession.accessToken.payload.hasOwnProperty("cognito:groups") &&
            this.props.auth.user.signInUserSession.accessToken.payload["cognito:groups"].length &&
            this.props.auth.user.signInUserSession.accessToken.payload["cognito:groups"].includes("labroz_admin");
        return (
            <div className="product-container">
                <div className={this.state.loginModalActive ? "modal is-active" : "modal"}>
                    <div className="modal-background"></div>
                    <div className="modal-content">
                        <div className="login-modal-content">
                            <div className="login-modal-header">
                                <div className="login-modal-title">You need to be logged in to Add products to Cart
                                {/* /Wishlist */}
                                </div>
                                <button onClick={this.handleCloseModal} className="delete" aria-label="close"></button>
                            </div>
                            <div className="login-modal-body">
                                <div className="buttons-container">
                                    <button className="button is-link"><Link to="/login">Login</Link></button>
                                    <div className="or-text">OR</div>
                                    <button className="button is-link"><Link to="/signup">Signup</Link></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    this.state.productLoaderActive
                        ?
                        <div className="loader-container">
                            <Spinner color="primary" size="medium" />
                        </div>
                        :
                        (Object.keys(this.state.productData).length ?
                            <Fragment>
                                <div className="left-container">
                                    <nav className="breadcrumb" aria-label="breadcrumbs">
                                        <ul>
                                            <li><Link to="/home">Home</Link></li>
                                            <li><Link to="/products">Products</Link></li>
                                            <li><Link to={window.location.href.split(window.location.origin)[1]}>{titleCase(this.state.productData.category)}</Link></li>
                                            <li className="is-active"><Link to={window.location.href.split(window.location.origin)[1]} aria-current="page">{titleCase(this.state.productData.sub_category)}</Link></li>
                                        </ul>
                                    </nav>
                                    <div className="images-container">
                                        {this.state.productData.images && this.state.productData.images.length > 1 &&
                                            <button
                                                className="arrow-btn"
                                                onClick={() => { this.changeActiveImage(-1) }}>
                                                &#10094;
                                    </button>
                                        }
                                        <div className="w3-content w3-display-container" style={{ maxWidth: "100%" }}>
                                            {
                                                this.state.productData.images.map((imgSrc, Idx) => {
                                                    return (
                                                        <img className={this.state.activeImageindex === Idx ? "mySlides active" : "mySlides"}
                                                            src={imgSrc}
                                                        />
                                                    )
                                                })
                                            }
                                            {
                                                this.state.productData.images.length > 1 &&
                                                <Fragment>
                                                    <div className="w3-center w3-container w3-section w3-large w3-text-white w3-display-bottommiddle" style={{ width: "100%" }}>
                                                        {
                                                            this.state.productData.images.map((imgSrc, idxx) => {
                                                                return (
                                                                    <span
                                                                        className={
                                                                            this.state.activeImageindex === idxx ?
                                                                                "w3-badge demo w3-transparent w3-hover-white w3-white" :
                                                                                "w3-badge demo w3-transparent w3-hover-white"
                                                                        }
                                                                        onClick={() => { this.setActiveImage(idxx) }}>
                                                                    </span>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </Fragment>
                                            }
                                        </div>
                                        {this.state.productData.images && this.state.productData.images.length > 1 &&
                                            <button
                                                className="arrow-btn"
                                                onClick={() => { this.changeActiveImage(1) }}>
                                                &#10095;
                                            </button>
                                        }
                                    </div>
                                </div>
                                <div className="right-container">
                                    {
                                        adminuser && this.state.mode === "view" &&
                                        <button
                                            className="button is-dark edit-btn"
                                            onClick={()=>{this.changeMode('edit')}}
                                        >
                                            <span className="icon">
                                                <FontAwesomeIcon icon="pencil-alt" />
                                            </span>
                                            Edit
                                        </button>
                                    }
                                    {
                                        adminuser && this.state.mode === "edit" &&
                                            <div className="field-container">
                                                <div className="field-title">
                                                    Add item stocks
                                                </div>
                                                {this.getInputJSX('stock', 'number')}
                                            </div>
                                    }
                                    {
                                        adminuser && this.state.mode === "edit" ?
                                            <div className="field-container">
                                                <div className="field-title">
                                                    Title
                                                </div>
                                                {this.getInputJSX('title', 'text')}
                                            </div>
                                            :
                                            <div className="product-title">
                                                {this.state.productData.title ? this.state.productData.title :
                                                    `Mens blue ${titleCase(this.state.productData.category)}`
                                                }
                                            </div>
                                    }
                                    {
                                        adminuser && this.state.mode === "edit" ?
                                            <div className="field-container">
                                                <div className="field-title">
                                                    Description
                                                </div>
                                                {this.getInputJSX('description', 'text')}
                                            </div>
                                            :
                                            <div className="description">
                                                {this.state.productData.description}
                                            </div>
                                    }
                                    {
                                        adminuser && this.state.mode === "edit" ?
                                            <div className="field-container">
                                                <div className="field-title">
                                                    Price and Discount
                                                </div>
                                                <div className="two-inputs">
                                                    {this.getInputJSX('price', 'number')}
                                                    {this.getInputJSX('discount', 'number')}
                                                </div>
                                            </div>
                                            :
                                            <div className="price-container">
                                                {this.getPriceJSX()}
                                            </div>
                                    }
                                    <div className="field-container">
                                        <div className="field-title">
                                            Size
                                        </div>
                                        <div className="sizes-content">
                                        {this.getSizesJSX()}
                                        {adminuser && this.state.mode === "edit" &&
                                            this.getInputJSX('size', 'text')
                                        }
                                        </div>
                                    </div>
                                    {(this.state.productData.color || adminuser && this.state.mode === "edit")&&
                                        <div className="field-container">
                                            <div className="field-title">
                                                Color and hex Code
                                            </div>
                                            {
                                                adminuser && this.state.mode === "edit" ?
                                                <div className="two-inputs">
                                                    {this.getInputJSX('color', 'text')}
                                                    {this.getInputJSX('color_code', 'text')}
                                                </div>
                                                :
                                                <div className="colors-content">
                                                    <Fragment>
                                                        <div className="color-box" style={{ backgroundColor: this.state.productData.color }}></div>
                                                        {titleCase(this.state.productData.color)}
                                                    </Fragment>
                                                </div>
                                            }
                                        </div>
                                    }
                                    {(this.state.productData.fit  || adminuser && this.state.mode === "edit") &&
                                        <div className="field-container">
                                            <div className="field-title">
                                                Fit
                                            </div>
                                            <div className="field-content">
                                                {
                                                    adminuser && this.state.mode === "edit" ?
                                                        this.getInputJSX('fit', 'text')
                                                        :
                                                        titleCase(this.state.productData.fit)
                                                }
                                            </div>
                                        </div>
                                    }
                                    {(this.state.productData.fabric || adminuser && this.state.mode === "edit") &&
                                        <div className="field-container">
                                            <div className="field-title">
                                                Material & Fabric
                                            </div>
                                            <div className="field-content">
                                                {
                                                    adminuser && this.state.mode === "edit" ?
                                                        this.getInputJSX('fabric', 'text')
                                                        :
                                                        // <div className="color-box"style={{ backgroundColor: this.state.productData.color }}></div>
                                                        titleCase(this.state.productData.fabric)
                                                }
                                            </div>
                                        </div>
                                    }
                                    {this.state.mode !== "edit" &&
                                        <div className="field-container">
                                            <div className="field-title">
                                                Delivery Availibility
                                            </div>
                                            <div className="field-content">
                                                <div className="check-pincode-input-container">
                                                    <div className={this.state.pincodeValidationStatus === "error" ? "control is-danger" :
                                                        (this.state.pincodeValidationStatus === "success" ? "control is-success" : "control")}
                                                    >
                                                        <input
                                                            placeholder="Enter your Pincode"
                                                            className={this.state.pincodeValidationStatus === "error" ? "input is-danger" :
                                                                (this.state.pincodeValidationStatus === "success" ? "input is-success" : "input")
                                                            }
                                                            type="text"
                                                            name='pincode'
                                                            maxLength="6"
                                                            onChange={this.onInputChange}
                                                        />
                                                    </div>
                                                    <button
                                                        className="button is-fullwidth check-btn"
                                                        onClick={this.handleVerifyPincode.bind(this)}
                                                    >
                                                        Check
                                                    </button>
                                                </div>
                                                {
                                                    this.state.pincodeValidationMsg &&
                                                    <p
                                                        className={this.state.pincodeValidationStatus === "error" ? "help is-danger" :
                                                            (this.state.pincodeValidationStatus === "success" ? "help is-success" : "help is-info")
                                                        }
                                                    >
                                                        {this.state.pincodeValidationMsg}
                                                    </p>
                                                }
                                            </div>
                                        </div>
                                    }   
                                    {
                                        this.state.sizeSelectWarning &&
                                        <div className="select-size-error">
                                            Select Size
                                        </div>
                                    }
                                    {
                                        this.state.mode !== "edit" ?
                                        <button
                                            className={this.state.isAddingToCartLoading ? 
                                                "button is-fullwidth is-loading add-to-cart-btn" : 
                                                "button is-fullwidth add-to-cart-btn"}
                                            onClick={this.handleCartToggle.bind(this)}
                                        >
                                            <span className="icon">
                                                <FontAwesomeIcon icon="cart-plus" />
                                            </span>
                                            Add to Cart
                                        </button>
                                        :
                                        adminuser &&(
                                            <Fragment>
                                                {this.state.responseText &&
                                                    <div className={`response-text is-${this.state.responseType}`}>
                                                        <span className="response-tag">
                                                            {this.state.responseText}
                                                        </span>
                                                    </div>
                                                }
                                                <div className="action-buttons">
                                                    <button
                                                        className={this.state.isAddingToCartLoading ? 
                                                            "button is-fullwidth is-loading update-btn" : 
                                                            "button is-fullwidth update-btn"}
                                                        onClick={this.handleSubmit.bind(this)}
                                                    >
                                                        Submit and Update
                                                    </button>
                                                    <button
                                                        className={this.state.isAddingToCartLoading ? 
                                                            "button is-fullwidth is-loading cancel-btn" : 
                                                            "button is-fullwidth cancel-btn"}
                                                        onClick={()=>{this.changeMode('view')}}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </Fragment> 
                                        )
                                    }
                                </div>
                            </Fragment>
                            :
                            <div className="no-data">
                                No Data Available for this Product
                            </div>
                        )
                }
            </div>
        )
    }
}

export default Product;