import React, { Fragment } from 'react';
import './style.scss';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import commonApi from "../../apis/common";
import { getSession } from "../../utils/AuthUtils";

class ProductItem extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            hover: false,
            activeSize: "",
            isWishListToggleLoading: false,
            isAddingToCartLoading: false
        }
    }
    
    componentDidMount() {
    }
    
    async handleWishlistToggle (e){
        e.stopPropagation();
        if(!this.props.auth.isAuthenticated){
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

    async handleCartToggle (e){
        e.stopPropagation();

        if (!this.props.auth.isAuthenticated) {
            this.props.handleLoginWarning();
            return;
        }
        if (!this.state.activeSize){
            this.setState({ sizeSelectWarning: true });
            return;
        }
        this.setState({ isAddingToCartLoading: true, sizeSelectWarning: false });
        let session = await getSession();
        let product_id = this.props.productData.variants[this.state.activeSize]._id;
        try {
            let response = await commonApi.post(`update_cart`,
                { product_id: product_id, count: 1 },
                { headers: { "Authorization": session.accessToken.jwtToken } }
            );
            console.log("wishlist response", response);
            if (response.data && response.data.success) {
                this.setState({ isAddingToCartLoading: false });
                this.props.fetchCartItems();
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
        if(this.state.activeSize === size){
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

        return(
            <div className="price-container">
                <p className="price-text">Rs. {price}</p>
                {
                    !!discount && 
                    <Fragment>
                        <p className="actual-price-text">Rs. {this.props.productData.price}</p>
                        <p className="discount-text">({discount}% OFF)</p>
                    </Fragment>
                }
            </div>
        )
    }

    getSizes = () => {
        let allSizes = this.props.productData.available_sizes;
        return (
            allSizes.map((size, idx)=>{
                return (
                    <button 
                        className={
                            this.state.activeSize === size ? 
                            "size-box active" : 
                            (this.props.productData.variants[size].stock === 0 ? "size-box disabled" : "size-box")
                        }
                        disabled={this.props.productData.variants[size].stock === 0} 
                        onClick={() => { this.handleSizeSelect(size) }}
                    >
                        {size}
                    </button>
                )
            })
        )
    }

    toggleHover = () => {
        this.setState({
            hover: !this.state.hover
        })
    }

    handleProductSelect = () => {
        let product_id = this.props.productData._id;
        this.props.history.push(`/product?id=${product_id}`);
    }

    render() {
        return (
            <Fragment>
                <div className="card product-item-card" onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover}>
                    <div className="card-image" onClick={this.handleProductSelect}>
                        <figure className="image is-4by5" >
                            <img 
                                src={this.props.productData.images[0]} 
                                alt="Placeholder image" 
                                className="product-image"
                            />
                        </figure>
                    {
                        this.state.hover &&
                        <div className="action-buttons">
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
                                    "button is-outlined is-fullwidth is-loading add-to-cart-btn":
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
                    }
                    </div>
                    <div className="card-content">
                        <div className="media">
                            <div className="media-content">
                                <p className="product-description" onClick={this.handleProductSelect}>{this.props.productData.title}</p>
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