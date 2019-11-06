import React, { Fragment } from 'react';
import './style.scss';
import { Link } from "react-router-dom";

class NavBar extends React.Component {
    render() {
        return (
            <Fragment>
                <Link className="logo-container" to="/">
                    <img src="public/img/larboz_logo.png" className="logo-img" width="112" height="28" />
                </Link>
                <nav className="navbar" role="navigation" aria-label="main navigation">
                    <div className="navbar-brand">
                        <a role="button" className="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarLabroz">
                            <span aria-hidden="true"></span>
                            <span aria-hidden="true"></span>
                            <span aria-hidden="true"></span>
                        </a>
                    </div>

                    <div id="navbarLabroz" className="navbar-menu">
                        {
                            this.props.location.pathname !== "/home" &&
                            <Link className="navbar-item" to="/home">
                                Home
                            </Link>
                        }

                        <div className="navbar-item has-dropdown is-hoverable">
                            <Link className="navbar-link" to="/men">
                                Men
                            </Link>
                            <div className="navbar-dropdown">
                                <div className="dropdown-container">
                                    <div className="links-container odd-column">
                                        <Link className="title-link" to="/men">
                                            Topwear
                                        </Link>
                                        <Link className="sub-link" to="/men">
                                            Jackets
                                        </Link>
                                        <Link className="sub-link" to="/men">
                                            T-shirts
                                        </Link>
                                    </div>
                                    <div className="links-container even-column">
                                        <Link className="title-link" to="/women">
                                            Bottomwear
                                        </Link>
                                        <Link className="sub-link" to="/women">
                                            Jeans
                                        </Link>
                                        <Link className="sub-link" to="/women">
                                            Shorts
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="navbar-item has-dropdown is-hoverable">
                            <Link className="navbar-link" to="/women">
                                Women
                            </Link>
                            <div className="navbar-dropdown">
                                <div className="dropdown-container">
                                    <div className="navbar-item links-container odd-column">
                                        <Link className="title-link" to="/men">
                                            Topwear
                                        </Link>
                                        <Link className="sub-link" to="/men">
                                            Jackets
                                        </Link>
                                        <Link className="sub-link" to="/men">
                                            Tops
                                        </Link>
                                    </div>
                                    <div className="navbar-item links-container even-column">
                                        <Link className="title-link" to="/women">
                                            Bottomwear
                                        </Link>
                                        <Link className="sub-link" to="/women">
                                            Jeans
                                        </Link>
                                        <Link className="sub-link" to="/women">
                                            Jeggings
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Link to="products" className="navbar-item">
                            Products
                        </Link>

                        <div className="field search-container">
                            <p className="control has-icons-left has-icons-right">
                                <input className="input is-rounded" type="text" placeholder="Find a product" />
                                <span className="icon is-small is-right">
                                    <img src="public/icons/magnifying-glass.svg" className="search-icon" width="112" height="28" />
                                </span>
                            </p>
                        </div>

                        <div className="action-buttons">
                            <div className="dropdown is-right is-hoverable">
                                <Link to="/login" className="action-btn" title="Profile" aria-haspopup="true" aria-controls="dropdown-profile">
                                    <img src="public/icons/avatar.svg" className="action-icon" width="112" height="28" />
                                    <div className="dropdown-menu" id="dropdown-profile" role="menu">
                                        {this.props.auth.isAuthenticated ?
                                        <div className="dropdown-content">
                                            <div className="dropdown-item">
                                                <Link to="/myaccount">My Account</Link>
                                            </div>
                                            <hr className="dropdown-divider"/>
                                            <div className="dropdown-item">
                                                <Link to="/myaccount">Wishlist</Link>
                                            </div>
                                            <hr className="dropdown-divider"/>
                                            <div className="dropdown-item">
                                                <Link to="/myaccount">Orders</Link>
                                            </div>
                                        </div>
                                        :
                                        <div className="dropdown-content">
                                            <div className="dropdown-item">
                                                <div className="login-signup-container">
                                                    <button className="button is-info is-rounded is-small login-btn">Login</button>
                                                    <p>OR</p>
                                                    <button className="button is-info is-rounded is-small signup-btn">Signup</button>
                                                </div>
                                            </div>
                                            <hr className="dropdown-divider"/>
                                            <div className="dropdown-item">
                                                <p>You need to be logged in to view your profile and orders.</p>
                                            </div>
                                        </div>
                                        }
                                    </div>
                                </Link>
                            </div>
                            <div className="dropdown is-right is-hoverable">
                                <Link to="/signup" className="action-btn" title="Cart" aria-haspopup="true" aria-controls="dropdown-cart">
                                    <img src="public/icons/shopping-cart.svg" className="action-icon" width="112" height="28" />
                                    <div className="dropdown-menu" id="dropdown-profile" role="menu">
                                        <div className="dropdown-content">
                                            <div className="dropdown-item">
                                                <div className="login-signup-container">
                                                    <button className="button is-info is-rounded is-small login-btn">Login</button>
                                                    <p>OR</p>
                                                    <button className="button is-info is-rounded is-small signup-btn">Signup</button>
                                                </div>
                                            </div>
                                            <hr className="dropdown-divider" />
                                            <div className="dropdown-item">
                                                <p>You need to be logged in to view your profile and orders.</p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>
            </Fragment>
        )
    }
}

export default NavBar;