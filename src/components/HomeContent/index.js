import React, { Component, Fragment } from 'react';
import './style.scss';
import { Link } from 'react-router-dom';

class HomeContent extends Component {
    
    render() {
        return (
            <Fragment>
                <div className="tile-container">
                    <div className="tile is-ancestor">
                        <div className="tile is-vertical is-6">
                            <div className="tile image-container">
                                <img src="https://i.ibb.co/WxCBJrS/menandfashion14.jpg" className="img-element"/>
                                <div className="left-overlay">
                                    <Link to="/products?category=bottomwear&sub_category=jeans" className="text">◀ Jeans </Link>
                                </div>
                            </div>
                        </div>
                        <div className="tile is-vertical is-6">
                            <div className="tile image-container">
                                <img src="https://i.ibb.co/WBSKW1Z/menandfashion12.jpg" className="img-element"/>
                                <div className="right-overlay">
                                    <Link to="/products?category=bottomwear&sub_category=chinos" className="text">Chinos ▶</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="tile is-ancestor">
                    <div className="tile is-vertical is-8">
                        <div className="tile image-container">
                            <img src="https://i.ibb.co/NShzLZm/men-4.png" className="img-element"/>
                            <div className="right-overlay">
                                <Link to="/latest" className="text">◀ Latest Collections</Link>
                            </div>
                        </div>
                    </div>
                    <div className="tile is-vertical is-4">
                        <div className="tile image-container">
                            <img src="https://i.ibb.co/48Tqx7T/men-3.png" className="img-element"/>
                            <div className="right-overlay">
                                <Link to="/specials" className="text">Specials ▶</Link>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
                <nav className="features-container">
                    <div className="feature">
                        <img src="https://i.ibb.co/9w7qbfD/free-shipping.png" />
                        <p className="heading">FREE WORLDWIDE SHIPPING</p>
                    </div>
                    <div className="feature">
                        <img src="https://i.ibb.co/x3KyqhK/money-back.png" />
                        <p className="heading">MONEY BACK GUARANTEE</p>
                    </div>
                    <div className="feature">
                        <img src="https://i.ibb.co/BfxxzZ3/customer-service.png"/>
                        <p className="heading">24/7 CUSTOMER SUPPORT</p>
                    </div>
                    <div className="feature">
                        <img src="https://i.ibb.co/178sGW4/secure-payments.png"/>
                        <p className="heading">SECURE ONLINE PAYMENTS</p>
                    </div>
                </nav>

            </Fragment>
        )
    }
}

export default HomeContent;