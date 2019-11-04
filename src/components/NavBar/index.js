import React, { Fragment } from 'react';
import './style.scss';
import { Link } from "react-router-dom";

class NavBar extends React.Component{
    render() {
        return (
            <Fragment>
            <a className="logo-container" href="/">
                <img src="public/img/larboz_logo.png" className="logo-img" width="112" height="28"/>
            </a>
            <nav className="navbar" role="navigation" aria-label="main navigation">
            <div className="navbar-brand">
                <a role="button" className="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarLabroz">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>

            <div id="navbarLabroz" className="navbar-menu">
                <a className="navbar-item">
                    Home
                </a>

                <div className="navbar-item has-dropdown is-hoverable">
                    <a className="navbar-link">
                        Men
                    </a>
                    <div className="navbar-dropdown">
                        <a className="navbar-item">
                            Jeans and Trousers
                        </a>
                        <a className="navbar-item">
                            Shirts And T-shirts
                        </a>
                        <a className="navbar-item">
                            WinterWear
                        </a>
                        <a className="navbar-item">
                            Sports and Active Wear
                        </a>
                    </div>
                </div>
                <div className="navbar-item has-dropdown is-hoverable">
                    <a className="navbar-link">
                        Women
                    </a>
                    <div className="navbar-dropdown">
                        <a className="navbar-item">
                            Jeans and Jeggings 
                        </a>
                        <a className="navbar-item">
                            Tops and T-shirts
                        </a>
                        <a className="navbar-item">
                            Sports and Active Wear
                        </a>
                        <a className="navbar-item">
                            Shoes
                        </a>
                    </div>
                </div>
                <Link to="products" className="navbar-item">
                    Products
                </Link>

                <div className="field search-container">
                    <p className="control has-icons-left has-icons-right">
                        <input className="input is-rounded" type="text" placeholder="Find a product"/>
                        <span className="icon is-small is-right">
                            <img src="public/icons/magnifying-glass.svg" className="search-icon" width="112" height="28"/>
                        </span>
                    </p>
                </div>
                
                <div className="action-buttons dropdown is-hoverable">
                    <a className="action-btn" title="Profile" aria-haspopup="true" aria-controls="dropdown-menu1">
                        <img src="public/icons/avatar.svg" className="action-icon" width="112" height="28"/>
                    </a>
                    <a className="action-btn" title="Cart">
                        <img src="public/icons/shopping-cart.svg" className="action-icon" width="112" height="28"/>
                    </a>
                </div>
            </div>
        </nav>
        </Fragment>
        )
    }
}

export default NavBar;