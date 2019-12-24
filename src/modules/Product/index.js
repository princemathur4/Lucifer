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
            loginModalActive: false
        }
    }

    componentDidMount() {
        this.product_id = getParameterByName('id', window.location.href);
        this.makeGetProductApiCall(this.product_id);
    }

    handleLoginWarning = () =>{
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
        if (!this.state.pincode || isNaN(this.state.pincode) || this.state.pincode.length !== 6 ) {
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

    getPriceHtml = () => {
        let discount = this.state.productData.discount;
        let price = discount ?
            this.state.productData.price - Math.round(this.state.productData.price * discount / 100) :
            this.state.productData.price;

        return (
            <div className="price-container">
                <p className="price-text">Rs. {price}</p>
                {
                    !!discount &&
                    <Fragment>
                        <p className="actual-price-text">Rs. {this.state.productData.price}</p>
                        <p className="discount-text">({discount}% OFF)</p>
                    </Fragment>
                }
            </div>
        )
    }

    handleSizeSelect = (size) => {
        if (this.state.activeSize === size) {
            this.setState({ activeSize: '' });
        } else {
            this.setState({ activeSize: size });
        }
    }

    getSizes = () => {
        let allSizes = this.state.productData.available_sizes;
        return (
            <div className="field-container">
                <div className="field-title">
                    Size
                </div>
                <div className="sizes-content">
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
                </div>
            </div>
        )
    }

    onInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    changeActiveImage = (input) =>{
        let newIndex = (this.state.activeImageindex + input);
        if (newIndex === -1){
            newIndex = this.state.productData.images.length - 1;
        }
        else if (newIndex === this.state.productData.images.length ){
            newIndex = 0;
        }
        this.setState({ activeImageindex: newIndex });
    }

    setActiveImage = (input) =>{
        this.setState({ activeImageindex: input });
    }

    render(){
        return(
            <div className="product-container">
                <div className={this.state.loginModalActive ? "modal is-active": "modal"}>
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
                                    <li><Link to="/men">Men</Link></li>
                                    <li><Link to={window.location.href.split(window.location.origin)[1]}>{titleCase(this.state.productData.category)}</Link></li>
                                    <li className="is-active"><Link to={window.location.href.split(window.location.origin)[1]} aria-current="page">{titleCase(this.state.productData.sub_category)}</Link></li>
                                </ul>
                            </nav>
                            <div className="images-container">
                                <button 
                                    className="arrow-btn" 
                                    disabled={this.state.productData.images && this.state.productData.images.length > 1}
                                    onClick={() => { this.changeActiveImage(-1) }}>
                                        &#10094;
                                </button>
                                <div className="w3-content w3-display-container" style={{maxWidth:"100%"}}>
                                {
                                    this.state.productData.images.map((imgSrc, Idx)=>{
                                        return (
                                            <img className={ this.state.activeImageindex === Idx ? "mySlides active" : "mySlides"} 
                                                src={imgSrc}
                                            />
                                        )
                                    })
                                }
                                {
                                    this.state.productData.images.length > 1 &&
                                    <Fragment>
                                        <div className="w3-center w3-container w3-section w3-large w3-text-white w3-display-bottommiddle" style={{ width:"100%"}}>
                                            {
                                                this.state.productData.images.map((imgSrc, idxx)=>{
                                                    return (
                                                        <span 
                                                            className={ 
                                                                this.state.activeImageindex === idxx ? 
                                                                    "w3-badge demo w3-transparent w3-hover-white w3-white":
                                                                    "w3-badge demo w3-transparent w3-hover-white"
                                                            }
                                                            onClick={()=>{this.setActiveImage(idxx)}}>
                                                        </span>
                                                    )
                                                })
                                            }
                                        </div>
                                    </Fragment>
                                }
                                </div>
                                <button 
                                    className="arrow-btn" 
                                    disabled={this.state.productData.images && this.state.productData.images.length > 1}
                                    onClick={() => { this.changeActiveImage(1) }}>
                                        &#10095;
                                </button>
                            </div>
                        </div>
                            <div className="right-container">
                                <div className="product-title">
                                    {this.state.productData.title ? this.state.productData.title : `Mens blue ${titleCase(this.state.productData.category)}`}
                                </div>
                                <div className="description">
                                    {this.state.productData.description}
                                </div>
                                {this.getPriceHtml()}
                                {this.getSizes()}
                                {this.state.productData.color
                                &&
                                <div className="field-container">
                                    <div className="field-title">
                                        Color
                                    </div>
                                    <div className="colors-content">
                                        <div className="color-box"style={{ backgroundColor: this.state.productData.color }}></div>
                                        {titleCase(this.state.productData.color)}
                                    </div>
                                </div>
                                }
                                {this.state.productData.fit && 
                                <div className="field-container">
                                    <div className="field-title">
                                        Fit
                                    </div>
                                    <div className="field-content">
                                        {titleCase(this.state.productData.fit)}
                                    </div>
                                </div>
                                }
                                {this.state.productData.fabric &&
                                <div className="field-container">
                                    <div className="field-title">
                                        Material & Fabric
                                    </div>
                                    <div className="field-content">
                                        <div className="color-box"style={{ backgroundColor: this.state.productData.color }}></div>
                                        {titleCase(this.state.productData.fabric)}
                                    </div>
                                </div>
                                }
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
                                {
                                    this.state.sizeSelectWarning &&
                                    <div className="select-size-error">
                                        Select Size
                                    </div>
                                }
                                <button 
                                        className={this.state.isAddingToCartLoading ? "button is-fullwidth is-loading add-to-cart-btn" : "button is-fullwidth add-to-cart-btn"}
                                    onClick={this.handleCartToggle.bind(this)}
                                >
                                        <span className="icon">
                                            <FontAwesomeIcon icon="cart-plus" />
                                        </span>
                                    Add to Cart
                                </button>
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