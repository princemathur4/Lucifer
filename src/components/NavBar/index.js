import React, { Fragment } from 'react';
import './style.scss';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Hub } from 'aws-amplify';
import Auth from "@aws-amplify/auth";
import { fetchCartItems } from '../../utils/ProductUtils';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import { roundOffNumber } from '../../utils/utilFunctions';

class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            discountedTotal: 0,
            isSideNavOpen: false
        }

        Hub.listen("auth", ({ payload: { event, data } }) => {
            switch (event) {
                case "signOut":
                    // window.history.pushState(
                    //     "",
                    //     "", 
                    //     "/" + window.location.href.substring(window.location.href.lastIndexOf('/') + 1).split("?")[0]
                    // ); // clear all params from url
                    this.props.auth.setAuthStatus(false);
                    this.props.auth.setUser(null);
                    console.log("hub signout", window.location.href.split(window.location.origin)[1]);
                    this.props.history.push(window.location.href.split(window.location.origin)[1]);
                    break;

                default:
                    break;
            }
        });
    }

    handleLogout = () => {
        event.preventDefault();

        try {
            Auth.signOut();
        } catch (error) {
            console.log(error.message);
        }
    }
    
    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside, false)
        fetchCartItems();
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside, false)
    }

    getCartPopup = () => {
        if (!this.props.store.cartItems.length) {
            return (
                <div className="no-items">No Items in Cart</div>
            )
        }
        return (
            <Fragment>
                <div className="cart-popup-header">
                    <div className="cart-popup-title">Total: </div>
                    <div className="cart-popup-value">₹ {roundOffNumber(this.props.store.discountedTotal)}</div>
                </div>
                <div className="cart-popup-content">
                    {toJS(this.props.store.cartItems).map((productObj, idx) => {
                        return (
                            <div className="cart-popup-product-item">
                                <div className="cart-popup-left-container">
                                    <img src={productObj.product_image && productObj.product_image.length ? productObj.product_image[0] : "https://i.ibb.co/48hHjC8/Plum-01-900x.png"}
                                        className="cart-popup-product-thumbnail-image"
                                    />
                                </div>
                                <div className="cart-popup-right-container">
                                    <div className="first-row">
                                        <Link to={`/product?id=${productObj.product_id.split(`_${productObj.size}`)[0]}`}
                                            className="product-title"
                                        >
                                            {productObj.title ? productObj.title : "Product Title"}
                                        </Link>
                                    </div>
                                    <div className="second-row">
                                        <div className="price">
                                            ₹{roundOffNumber(productObj.effective_price)}
                                        </div>
                                        <div className="product-quantity">
                                            Qty: {productObj.count}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        )
                    })
                    }
                </div>

                <div className="cart-popup-footer">
                    <button className="button is-fullwidth popup-checkout"
                        onClick={() => { this.props.history.push('/cart') }}
                    >Checkout</button>
                </div>
            </Fragment>
        )
    }

    handleClickOutside = (e) => {
        e.stopPropagation();
        if (this.node.contains(e.target) || e.target.closest('.navbar-burger')) {
            return;
        }
        this.setState({ isSideNavOpen: false });
    };

    toggleSideNav = () => {
        this.setState({ isSideNavOpen: !this.state.isSideNavOpen });
    }

    render() {
        let adminuser = this.props.auth.user &&
            this.props.auth.user.signInUserSession.accessToken.hasOwnProperty("payload") &&
            this.props.auth.user.signInUserSession.accessToken.payload.hasOwnProperty("cognito:groups") &&
            this.props.auth.user.signInUserSession.accessToken.payload["cognito:groups"].length &&
            this.props.auth.user.signInUserSession.accessToken.payload["cognito:groups"].includes("labroz_admin");
        return (
            <Fragment>
                {
                    this.state.isSideNavOpen &&
                    <div className="faded-content"></div>
                }
                <nav className="navbar" role="navigation" aria-label="main navigation">
                    <div className="logo-container">
                        <Link to="/">
                            <img src="https://i.ibb.co/WyZrjkf/larboz-logo.png" className="logo-img" width="118" height="28" />
                        </Link>
                    </div>
                    <div className="navbar-brand">
                        <button 
                            className={this.state.isSideNavOpen ? "button is-active is-light navbar-burger burger" : "button is-light navbar-burger burger"}
                            aria-label="menu"
                            aria-expanded="false"
                            role="button"
                            data-target="navbarLabroz"
                            onClick={this.toggleSideNav}
                        >
                            <span aria-hidden="true"></span>
                            <span aria-hidden="true"></span>
                            <span aria-hidden="true"></span>
                        </button>
                    </div>
                    <div className={this.state.isSideNavOpen ? "sidenav is-active": "sidenav"} ref={(node) => { this.node = node }}>
                        <Link className="side-nav-logo-container" to="/">
                            <img src="https://i.ibb.co/WyZrjkf/larboz-logo.png" className="logo-img" width="118" height="28" />
                        </Link>
                        <Link className={this.props.location.pathname === "/home" ? "sidenav-item is-active": "sidenav-item"} 
                            to="/home"
                        >
                            Home
                            <FontAwesomeIcon className="accodian-icon" icon="angle-right"/>
                        </Link>

                        <Link className={this.props.location.pathname + this.props.location.search === "/products?category=bottomwear&sub_category=jeans" ? 
                            "sidenav-item is-active": "sidenav-item"} 
                            to="/products?category=bottomwear&sub_category=jeans"
                            onClick={this.toggleSideNav}
                        >
                            Jeans
                            <FontAwesomeIcon className="accodian-icon" icon="angle-right"/>
                        </Link>
                        <Link 
                            to="/products?category=bottomwear&sub_category=chinos"
                            className={this.props.location.pathname + this.props.location.search  === "/products?category=bottomwear&sub_category=chinos" ? 
                                "sidenav-item is-active": "sidenav-item"}
                            onClick={this.toggleSideNav}
                        >
                            Chinos
                            <FontAwesomeIcon className="accodian-icon" icon="angle-right"/>
                        </Link>
                        <Link 
                            to="/products?category=bottomwear&sub_category=shorts"
                            className={this.props.location.pathname + this.props.location.search  === "/products?category=bottomwear&sub_category=shorts" ? 
                               "sidenav-item is-active": "sidenav-item"}
                            onClick={this.toggleSideNav}
                        >
                            Shorts
                            <FontAwesomeIcon className="accodian-icon" icon="angle-right"/>
                        </Link>
                        <Link 
                            to="/specials" 
                            className={this.props.location.pathname === "/specials" ? "sidenav-item is-active": "sidenav-item"} 
                        >
                            Specials
                            <FontAwesomeIcon className="accodian-icon" icon="angle-right"/>
                        </Link>
                        <Link 
                            to="/blog" 
                            className={this.props.location.pathname === "/blog" ? "sidenav-item is-active": "sidenav-item"} 
                        >
                            Blog
                            <FontAwesomeIcon className="accodian-icon" icon="angle-right"/>
                        </Link>
                        {
                            adminuser &&
                            <Fragment>
                                <Link 
                                    to="/add_products" 
                                    className={this.props.location.pathname === "/add_products" ? "sidenav-item is-active": "sidenav-item"} 
                                >
                                    Add Products
                                    <FontAwesomeIcon className="accodian-icon" icon="angle-right"/>
                                </Link>
                                <Link to="/update_orders" 
                                    className={this.props.location.pathname === "/update_orders" ? "sidenav-item is-active": "sidenav-item"}
                                >
                                    Update Orders
                                    <FontAwesomeIcon className="accodian-icon" icon="angle-right"/>
                                </Link>
                            </Fragment>
                        }
                        {
                            this.props.auth.isAuthenticated ?
                            <Fragment>

                                <Link to="/myaccount"
                                    className={this.props.location.pathname === "/myaccount" ? "sidenav-item is-active": "sidenav-item"}
                                >
                                    My Account
                                    <FontAwesomeIcon className="accodian-icon" icon="angle-right"/>
                                </Link>
                                <Link to="/cart"
                                    className={this.props.location.pathname === "/cart" ? "sidenav-item is-active": "sidenav-item"}
                                >
                                    Cart
                                </Link>
                                <a className="sidenav-item" onClick={this.handleLogout}>
                                    Logout
                                    <FontAwesomeIcon className="accodian-icon" icon="angle-right"/>
                                </a>
                            </Fragment>
                            :
                            <Fragment>
                                <Link to="/signup"
                                    className={this.props.location.pathname === "/signup" ? "sidenav-item is-active": "sidenav-item"}
                                >
                                    Signup
                                </Link>
                                <Link to="/login"
                                    className={this.props.location.pathname === "/login" ? "sidenav-item is-active": "sidenav-item"}
                                >Login</Link>
                            </Fragment>
                        }
                    </div>
                    <div id="navbarLabroz" className="navbar-menu">
                        <div className="main-nav-container">
                            {
                                this.props.location.pathname !== "/home" &&
                                <Link className="navbar-item" to="/home">
                                    Home
                                </Link>
                            }

                            <Link className="navbar-item" to="/products?category=bottomwear&sub_category=jeans">
                                Jeans
                            </Link>
                                <Link className="navbar-item" to="/products?category=bottomwear&sub_category=chinos">
                                    Chinos
                            </Link>
                                <Link className="navbar-item" to="/products?category=bottomwear&sub_category=shorts">
                                    Shorts
                            </Link>
                                <Link to="/specials" className="navbar-item">
                                    Specials
                            </Link>
                                <Link to="/blog" className="navbar-item">
                                    Blog
                            </Link>
                            {
                                adminuser &&
                                <Fragment>
                                    <Link to="/add_products" className="navbar-item">
                                        Add Products
                                </Link>
                                    <Link to="/update_orders" className="navbar-item">
                                        Update Orders
                                </Link>
                                </Fragment>
                            }
                        </div>
                        {/* <div className="field search-container">
                            <p className="control has-icons-left has-icons-right">
                                <input className="input is-rounded" type="text" placeholder="Find a product" />
                                <span className="icon is-small is-right">
                                    <img src="https://i.ibb.co/sV93MZG/magnifying-glass.png" className="search-icon" width="112" height="28" />
                                </span>
                            </p>
                        </div> */}
                        <div className="action-buttons">
                            <div className="dropdown is-right is-hoverable">
                                <div className="action-btn" aria-haspopup="true" aria-controls="dropdown-profile">
                                    <img src="https://i.ibb.co/89rzTMv/avatar.png" onClick={() => { this.props.history.push('/profile') }} className="action-icon" width="112" height="28" />
                                </div>
                                <div className="dropdown-menu" id="dropdown-profile" role="menu">
                                    {this.props.auth.isAuthenticated ?
                                        <div className="dropdown-content">
                                            <div className="action-link-container">
                                                <Link to="/myaccount">My Account</Link>
                                            </div>
                                            <div className="action-link-container">
                                                <Link to="/profile">Personal Info</Link>
                                            </div>
                                            <div className="action-link-container">
                                                <Link to="/passwords">Passwords</Link>
                                            </div>
                                            <div className="action-link-container">
                                                <Link to="/addresses">Addresses</Link>
                                            </div>
                                            {/* <div className="">
                                            <Link to="/wishlist">Wishlist</Link>
                                        </div> */}
                                            <div className="action-link-container">
                                                <Link to="/orders">Orders & Returns</Link>
                                            </div>
                                            <hr className="dropdown-divider" />
                                            <div className="" onClick={this.handleLogout}>
                                                <div className="logout-btn selectable">
                                                    Logout
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        <div className="dropdown-content">
                                            <div className="dropdown-item">
                                                <div className="login-signup-container">
                                                    <button
                                                        className="login-btn"
                                                        onClick={() => { this.props.history.push('/login') }}
                                                    >
                                                        Login
                                                    </button>
                                                    <p>OR</p>
                                                    <button
                                                        className="login-btn"
                                                        onClick={() => { this.props.history.push('/signup') }}
                                                    >
                                                        Signup
                                                    </button>
                                                </div>
                                            </div>
                                            <hr className="dropdown-divider" />
                                            <div className="dropdown-item">
                                                <p>You need to be logged in to view your profile and orders.</p>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="dropdown is-right is-hoverable">
                                <Link to="/cart" className="action-btn cart" aria-haspopup="true" aria-controls="dropdown-cart">
                                    <img src="https://i.ibb.co/S3x3K0Q/shopping-cart.png" className="action-icon" width="112" height="28" />
                                    {
                                        !!this.props.store.totalItems && this.props.name !== 'cart' &&
                                        <div className="count">
                                            {this.props.store.totalItems}
                                        </div>
                                    }
                                </Link>
                                {
                                    this.props.name !== 'cart' &&
                                    <div className="dropdown-menu" id="dropdown-profile" role="menu">
                                        <div className="dropdown-content cart-popup">
                                            {
                                                this.getCartPopup()
                                            }
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </nav>
            </Fragment>
        )
    }
}

export default observer(NavBar);