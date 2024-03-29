import React, { Fragment } from 'react';
import './style.scss';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import commonApi from "../../apis/common";
import { getSession } from "../../utils/AuthUtils";
import { fetchCartItems } from '../../utils/ProductUtils';
import { roundOffNumber } from '../../utils/utilFunctions';

class ProductItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hover: false,
            activeSize: "",
            isWishListToggleLoading: false,
            isAddingToCartLoading: false,
            activeImageindex: 0,
        }
        this.intervalId = "";
    }

    componentDidMount() {
    }

    async handleWishlistToggle(e) {
        e.stopPropagation();
        if (!this.props.auth.isAuthenticated) {
            this.props.handleLoginWarning();
            return;
        }
        this.setState({ isWishListToggleLoading: true });
        let session = await getSession();
        try {
            let response = await commonApi.post(`add_to_wishlist`,
                { product_id: this.props.productData._id },
                { headers: { "Authorization": session.accessToken.jwtToken } }
            );
            console.log("wishlist response", response);
            if (response.data && response.data.success) {
                this.setState({ isWishListToggleLoading: false, isWishlisted: true });
            } else {
                this.setState({ isWishListToggleLoading: false, isWishlisted: false });
            }
        }
        catch (e) {
            console.log("error", e);
            this.setState({ isWishListToggleLoading: false, isWishlisted: false });
        }
    }

    async handleCartToggle(e) {
        console.log(e);
        e.preventDefault();
        e.stopPropagation();

        if (!this.props.auth.isAuthenticated) {
            this.props.handleLoginWarning();
            return;
        }
        let {activeSize} = this.state;
        
        if (!activeSize) {
            let sizes = this.props.productData.available_sizes;
            console.log("stock", this.props.productData.variants[sizes[0]])
            if (sizes.length === 1 && !!this.props.productData.variants[sizes[0]].stock){
                this.setState({ activeSize: sizes[0] });
                activeSize = sizes[0];
            } else {
                this.setState({ sizeSelectWarning: true });
                return;
            }
        }
        this.setState({ isAddingToCartLoading: true, sizeSelectWarning: false });
        let session = await getSession();
        let product_id = this.props.productData.variants[activeSize]._id;
        try {
            let response = await commonApi.post(`update_cart`,
                { product_id: product_id, count: 1 },
                { headers: { "Authorization": session.accessToken.jwtToken } }
            );
            console.log("wishlist response", response);
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

    handleSizeSelect = (size) => {
        if (this.state.activeSize === size) {
            this.setState({ activeSize: '' });
        } else {
            this.setState({ activeSize: size });
        }
    }

    getPriceHtml = () => {
        let discount = this.props.productData.discount;
        let price = discount ?
            this.props.productData.price - Math.round(this.props.productData.price * discount / 100) :
            this.props.productData.price;

        return (
            <div className="price-container">
                <p className="price-text">Rs. {price}</p>
                {
                    !!discount &&
                    <Fragment>
                        <p className="actual-price-text">Rs. {roundOffNumber(this.props.productData.price)}</p>
                        <p className="discount-text">({discount}% OFF)</p>
                    </Fragment>
                }
            </div>
        )
    }

    getSizes = () => {
        let allSizes = this.props.productData.available_sizes;
        allSizes = allSizes.sort();
        return (
            allSizes.map((size, idx) => {
                return (
                    <button
                        className={
                            this.state.activeSize === size ?
                                "size-box active" :
                                (this.props.productData.variants[size].stock === 0 ? "size-box disabled" : "size-box")
                        }
                        disabled={this.props.productData.variants[size].stock === 0}
                        title={this.props.productData.variants[size].stock === 0 ? "Size not available": size}
                        onClick={() => { this.handleSizeSelect(size) }}
                    >
                        {size}
                    </button>
                )
            })
        )
    }

    changeActiveImage = (input) => {
        let newIndex = (this.state.activeImageindex + input);
        if (newIndex === -1) {
            newIndex = this.props.productData.images.length - 1;
        }
        else if (newIndex === this.props.productData.images.length) {
            newIndex = 0;
        }
        this.setState({ activeImageindex: newIndex });
    }

    setActiveImage = (input) => {
        this.setState({ activeImageindex: input });
    }

    toggleHover = (applyVal) => {
        this.setState({
            hover: applyVal
        })
        if (applyVal) {
            if(this.props.productData.images.length > 1){
                this.intervalId = setInterval(() => { this.changeActiveImage(1) }, 1200);
            }
        } else {
            if(this.props.productData.images.length > 1){
                clearInterval(this.intervalId)
            }
        }
    }

    handleProductSelect = () => {
        this.props.history.push(`/product?id=${this.props.productData._id}`);
    }

    getActionbuttons = (type) => {
        return (
            <div className={type +"-action-buttons"}>
                {/* <button 
                    className={this.state.isWishListToggleLoading ? 
                        "button is-outlined is-loading wishlist-btn" : 
                        "button is-outlined wishlist-btn"
                    } 
                    onClick={this.handleWishlistToggle.bind(this)}
                    >
                    <span className="icon">
                    <FontAwesomeIcon icon="bookmark" className="wishlist-icon" />
                    </span>
                    <span>{this.props.productData.is_wishlisted || this.state.isWishlisted ? "Wishlisted": "Save in Wishlist"}</span>
                </button> */}
                <button
                    className={this.state.isAddingToCartLoading ?
                        "button is-outlined is-fullwidth is-loading add-to-cart-btn" :
                        "button is-outlined is-fullwidth add-to-cart-btn"
                    }
                    onClick={this.handleCartToggle.bind(this)}
                >
                    <span className="icon">
                        <FontAwesomeIcon icon="cart-plus" />
                    </span>
                    <span>Add to Cart</span>
                </button>
            </div>
        )
    }

    render() {
        return (
            <Fragment>
                <div className="card product-item-card" onMouseEnter={()=>{this.toggleHover(true)}} onMouseLeave={()=>{this.toggleHover(false)}}>
                    <Link 
                        to={`/product?id=${this.props.productData._id}`} 
                        target="_blank" 
                        className="card-image"
                    >
                        <figure className="image is-4by5" >
                            {
                                this.props.productData.images.map((imgSrc, Idx) => {
                                    return (
                                        <img className={this.state.activeImageindex === Idx ? "mySlides active" : "mySlides"}
                                            src={imgSrc}
                                        />
                                    )
                                })
                            }
                        </figure>
                        {
                            this.state.hover &&
                                <div className="hover-container">
                                {
                                    this.props.productData.images.length > 1 &&
                                    <div className="dots-container" style={{ width: "100%" }}>
                                    {this.props.productData.images.map((imgSrc, idxx) => {
                                            return (
                                                <span
                                                className={
                                                        this.state.activeImageindex === idxx ?
                                                            "dots active" :
                                                            "dots"
                                                        }
                                                        onClick={(e) => {
                                                        e.stopPropagation();
                                                        e.preventDefault();
                                                        this.setActiveImage(idxx)
                                                    }}>
                                                    </span>
                                            )
                                        })
                                        }
                                        </div>
                                }
                                {this.getActionbuttons('hover')}
                            </div>
                        }
                    </Link>
                    <div className="card-content">
                        <div className="media">
                            <div className="media-content">
                                {this.getActionbuttons('mobile')}
                                <p className="product-title" onClick={this.handleProductSelect}>{this.props.productData.title}</p>
                                {this.getPriceHtml()}
                                {
                                    this.state.sizeSelectWarning &&
                                    <div className="select-size-error">
                                        Select Size
                                    </div>
                                }
                                <div className="sizes-container">
                                    <div className="size-title">Sizes:</div>
                                    {this.getSizes()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default ProductItem;