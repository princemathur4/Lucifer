import React, { Fragment } from 'react';
import './style.scss';

class Footer extends React.Component{
    render() {
        return (
            <Fragment>
                <div className="site-footer">
                    <div class="columns is-centered">
                        <div class="column">
                            <div className="footer-title">
                                VISIT OUR STORE
                            </div>
                            <div className="footer-address">
                                888 Griffiths Way, Mainland ML12345
                                <br/>
                                T: +91-9971289321
                                <br/>
                                Monday-Saturday: 9.00 am - 9.00 pm
                            </div>
                        </div>
                        <div class="column">
                            <div className="footer-title">
                                INFORMATION
                            </div>
                            <div className="footer-item">
                                Contact Us
                            </div>
                            <div className="footer-item">
                                FAQ's
                            </div>
                            <div className="footer-item">
                                Help
                            </div>
                            <div className="footer-item">
                                
                            </div>
                        </div>
                        <div class="column">
                            <div className="footer-title">
                                GET IN TOUCH
                            </div>
                            <div className="footer-item-container">
                                <a className="social-btn" title="Facebook">
                                    <img src="public/svg/facebook.svg" className="social-icon" width="112" height="28" />
                                </a>
                                <a className="social-btn" title="Instagram">
                                    <img src="public/svg/instagram.svg" className="social-icon" width="112" height="28" />
                                </a>
                                <a className="social-btn" title="Twitter">
                                    <img src="public/svg/twitter.svg" className="social-icon" width="112" height="28" />
                                </a>
                            </div>
                        </div>
                        <div class="column">
                            <div className="footer-title">
                                POLICIES
                            </div>
                            <div className="footer-item">
                                Shipping Policy
                            </div>
                            <div className="footer-item">
                                Exchange Policy
                            </div>
                            <div className="footer-item">
                                Terms of Service
                            </div>
                            <div className="footer-item">
                                Privacy Policy
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}


export default Footer;