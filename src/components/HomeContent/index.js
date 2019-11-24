import React, { Component, Fragment } from 'react';
import './style.scss';

class HomeContent extends Component {
    render() {
        return (
            <Fragment>
                <div className="tile-container">
                    <div className="tile is-ancestor">
                        <div className="tile is-vertical is-6">
                            <div className="tile image-container">
                                <img src="public/img/women_pink.png" className="img-element"/>
                                <div className="left-overlay">
                                    <a className="text">◀ Women </a>
                                </div>
                            </div>
                        </div>
                        <div className="tile is-vertical is-6">
                            <div className="tile image-container">
                                <img src="public/img/men_4.png" className="img-element"/>
                                <div className="right-overlay">
                                    <a className="text">Men ▶</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="tile is-ancestor">
                    <div className="tile is-vertical is-8">
                        <div className="tile image-container">
                            <img src="public/img/COVER.png" className="img-element"/>
                            <div className="right-overlay">
                                <a className="text">◀ Shoes and Accessories</a>
                            </div>
                        </div>
                    </div>
                    <div className="tile is-vertical is-4">
                        <div className="tile image-container">
                            <img src="public/img/men_3.png" className="img-element"/>
                            <div className="right-overlay">
                                <a className="text">Winter Collections ▶</a>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
                <nav className="features-container">
                    <div className="feature">
                        <img src="public/icons/free_shipping.png" />
                        <p className="heading">FREE WORLDWIDE SHIPPING</p>
                    </div>
                    <div className="feature">
                        <img src="public/icons/money_back.png" />
                        <p className="heading">MONEY BACK GUARANTEE</p>
                    </div>
                    <div className="feature">
                        <img src="public/icons/customer_service.png"/>
                        <p className="heading">24/7 CUSTOMER SUPPORT</p>
                    </div>
                    <div className="feature">
                        <img src="public/icons/secure_payments.png"/>
                        <p className="heading">SECURE ONLINE PAYMENTS</p>
                    </div>
                </nav>

            </Fragment>
        )
    }
}

export default HomeContent;