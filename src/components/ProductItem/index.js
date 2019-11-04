import React, { Fragment } from 'react';
import './style.scss';
import { Link } from "react-router-dom";

class ProductItem extends React.Component {
    componentDidMount() {
    }

    render() {
        return (
            <Fragment>
                <div className="card product-item-card">
                    <div className="card-image">
                        <figure className="image is-4by3">
                            <img src={this.props.data.image[0]} alt="Placeholder image" />
                        </figure>
                    </div>
                    <div className="card-content">
                        <div className="media">
                            <div className="media-content">
                                <p className="title is-4">{this.props.data.title}</p>
                                <p className="subtitle is-6 price-text">Rs. {this.props.data.price}</p>
                            </div>
                        </div>


                        <div className="content">
                            <button class="button is-outlined">
                                <span class="icon">
                                    <img src="public/icons/small-bookmark.svg" />
                                </span>
                                <span>Save in Wishlist</span>
                                </button>
                            <button class="button is-outlined">
                                <span class="icon">
                                    <img src="public/icons/add-to-cart.svg" />
                                </span>
                                <span>Add to Cart</span>
                            </button>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default ProductItem;