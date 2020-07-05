import React, { Fragment } from 'react';
import './style.scss';
import { Link } from 'react-router-dom';

class Footer extends React.Component{
    render() {
        return (
            <Fragment>
                <div className="site-footer">
                    <div className="columns is-centered">
                        <div className="column">
                            <div className="footer-title">
                                VISIT OUR STORE
                            </div>
                            <div className="footer-address">
                                6300, Upper Ground Floor, Block number 6, Gali Number 3, Dev Nagar, Karol Bagh
                                <br/>
                                T: +91-9650387093
                                <br/>
                                Tuesday-Sunday: 9.00 am - 9.00 pm
                            </div>
                        </div>
                        <div className="column">
                            <div className="footer-title">
                                INFORMATION
                            </div>
                            <div className="footer-item">
                                <Link to="/about_us">About Us</Link>
                            </div>
                            <div className="footer-item">
                                <Link to="">Contact Us</Link>
                            </div>
                            <div className="footer-item">
                                <Link to="">FAQ's</Link>
                            </div>
                            <div className="footer-item">
                                <Link to="">Help</Link>
                            </div>
                        </div>
                        <div className="column">
                            <div className="footer-title">
                                GET IN TOUCH
                            </div>
                            <div className="footer-item-container">
                                <a className="social-btn" title="Facebook">
                                    <img src="https://i.ibb.co/4F7krFm/facebook.png" className="social-icon" width="112" height="28" />
                                </a>
                                <a className="social-btn" title="Instagram">
                                    <img src="https://i.ibb.co/N2TsSJJ/instagram.png" className="social-icon" width="112" height="28" />
                                </a>
                                <a className="social-btn" title="Twitter">
                                    <img src="https://i.ibb.co/1QMnP37/twitter.png" className="social-icon" width="112" height="28" />
                                </a>
                            </div>
                        </div>
                        <div className="column">
                            <div className="footer-title">
                                POLICIES
                            </div>
                            <div className="footer-item">
                                <Link to="/shipping_policy">Shipping Policy</Link>
                            </div>
                            <div className="footer-item">
                                <Link to="/return_exchange_policy">Return/Exchange Policy</Link>
                            </div>
                            <div className="footer-item">
                                <Link to="/terms_and_conditions">Terms of Service</Link>
                            </div>
                            <div className="footer-item">
                                <Link to="/privacy_policy">Privacy Policy</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}


export default Footer;