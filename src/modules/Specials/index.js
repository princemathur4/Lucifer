import React, { Fragment } from 'react';
import { observer } from 'mobx-react';
import "./style.scss";
import { getSession } from "../../utils/AuthUtils";
import commonApi from "../../apis/common";
import Spinner from "../../components/Spinner";
import { toJS } from 'mobx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SpecialProductItem from '../../components/SpecialProductItem';
import { Link } from "react-router-dom";
import { fetchCartItems } from '../../utils/ProductUtils';

class Specials extends React.Component {
    constructor(props) {
        super(props);
        this.category = '';
        this.sub_category = '';
        this.state = {
            products: [],
            productListLoader: true,
            loginModalActive: false
        }
    }

    componentDidMount() {
        fetchCartItems();
        this.makeGetProductsApiCall();
    }

    async makeGetProductsApiCall() {
        this.setState({ productListLoader: true });
        try {
            let response = await commonApi.post(`products`,
                { 
                    category: 'bottomwear',
                    sub_category: "jeans"
                }
            );
            console.log("products response", response);
            if (response.data && response.data.success) {
                this.setState({ 
                    products: response.data.data.products, 
                    productListLoader: false 
                });
            } else {
                this.setState({ products : [], productListLoader: false });
            }
        }
        catch (e) {
            console.log("error", e);
            this.setState({ products: [], productListLoader: false });
        }
    }

    handleLoginWarning = () =>{
        this.setState({ loginModalActive: true });
    }

    handleCloseModal = () => {
        this.setState({ loginModalActive: false });
    }

    render() {
        return (
            <Fragment>
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
                <div className="specials-container">
                    <div className="image-container">
                        <img src="https://i.ibb.co/8gxGDMw/download.png"/>
                        <div className="title">Created with Love ❤️</div>
                    </div>
                    <div className="specials-products-container">
                    
                    {
                        this.state.productListLoader ?
                            <div className="loader-container">
                                <Spinner color="primary" size="medium" />
                            </div>
                        :
                        this.state.products.map((productObj,idx )=>{
                            return <SpecialProductItem 
                                        productData={productObj}
                                        {...this.props}
                                        handleLoginWarning={this.handleLoginWarning}
                                    />
                        })
                    }
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default observer(Specials);