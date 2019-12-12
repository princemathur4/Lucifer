import React, { Fragment } from 'react';
import './style.scss';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Hub } from 'aws-amplify';
import Auth from "@aws-amplify/auth";

class NavBar extends React.Component {
    constructor(props){
        super(props);
        
        Hub.listen("auth", ({ payload: { event, data } }) => {
            switch (event) {
                case "signOut":
                    window.history.pushState(
                        "",
                        "",
                        "/" + window.location.href.substring(window.location.href.lastIndexOf('/') + 1).split("?")[0]
                    ); // clear all params from url
                    this.props.auth.setAuthStatus(false);
                    this.props.auth.setUser(null);
                    this.props.history.push("/");
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

    render() {
        return (
            <Fragment>
                <nav className="navbar" role="navigation" aria-label="main navigation">
                    <Link className="logo-container" to="/">
                        <img src="https://i.ibb.co/WyZrjkf/larboz-logo.png" className="logo-img" width="118" height="28" />
                    </Link>
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
                                    <div className="links-container even-column">
                                        <div className="title-link">
                                            Bottomwear
                                        </div>
                                        <Link className="sub-link" to="/products?category=bottomwear&sub_category=jeans">
                                            Jeans
                                        </Link>
                                        <Link className="sub-link" to="/products?category=bottomwear&sub_category=chinos">
                                            Chinos
                                        </Link>
                                        <Link className="sub-link" to="/products?category=bottomwear&sub_category=shorts">
                                            Shorts
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Link to="/specials" className="navbar-item">
                            Specials
                        </Link>
                        <Link to="/specials" className="navbar-item">
                            Blog
                        </Link>

                        <div className="field search-container">
                            <p className="control has-icons-left has-icons-right">
                                <input className="input is-rounded" type="text" placeholder="Find a product" />
                                <span className="icon is-small is-right">
                                    <img src="https://i.ibb.co/sV93MZG/magnifying-glass.png" className="search-icon" width="112" height="28" />
                                </span>
                            </p>
                        </div>

                        <div className="action-buttons">
                            <div className="dropdown is-right is-hoverable">
                                <div className="action-btn" aria-haspopup="true" aria-controls="dropdown-profile">
                                    <img src="https://i.ibb.co/89rzTMv/avatar.png" onClick={()=>{this.props.history.push('/profile')}} className="action-icon" width="112" height="28" />
                                    <div className="dropdown-menu" id="dropdown-profile" role="menu">
                                        {this.props.auth.isAuthenticated ?
                                        <div className="dropdown-content">
                                            <div className="dropdown-item">
                                                <Link to="/myaccount">My Account</Link>
                                            </div>
                                            <hr className="dropdown-divider"/>
                                            <div className="dropdown-item">
                                                <Link to="/profile">Personal Info</Link>
                                            </div>
                                            <div className="dropdown-item">
                                                <Link to="/addresses">Addresses</Link>
                                            </div>
                                            <div className="dropdown-item">
                                                <Link to="/wishlist">Wishlist</Link>
                                            </div>
                                            <div className="dropdown-item">
                                                <Link to="/orders">Orders & Returns</Link>
                                            </div>
                                            <hr className="dropdown-divider"/>
                                            <div className="dropdown-item">
                                                    <button className="button is-small has-text-grey-darker	 is-light is-fullwidth" onClick={this.handleLogout}>
                                                    <span className="icon is-small">
                                                        <FontAwesomeIcon icon="sign-out-alt"/>
                                                    </span>
                                                    <span>Logout</span>
                                                </button>
                                            </div>
                                        </div>
                                        :
                                        <div className="dropdown-content">
                                            <div className="dropdown-item">
                                                <div className="login-signup-container">
                                                    <button 
                                                        className="button is-info is-rounded is-small login-btn"
                                                        onClick={()=>{this.props.history.push('/login')}}
                                                    >
                                                        Login
                                                    </button>
                                                    <p>OR</p>
                                                    <button 
                                                        className="button is-info is-rounded is-small signup-btn"
                                                        onClick={()=>{this.props.history.push('/signup')}}
                                                    >
                                                        Signup
                                                    </button>
                                                </div>
                                            </div>
                                            <hr className="dropdown-divider"/>
                                            <div className="dropdown-item">
                                                <p>You need to be logged in to view your profile and orders.</p>
                                            </div>
                                        </div>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="dropdown is-right is-hoverable">
                                <Link to="/cart" className="action-btn" title="Cart" aria-haspopup="true" aria-controls="dropdown-cart">
                                    <img src="https://i.ibb.co/S3x3K0Q/shopping-cart.png" className="action-icon" width="112" height="28" />
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