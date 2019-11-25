import React, { Fragment } from 'react';
import './style.scss';

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
                                888 Griffiths Way, Mainland ML12345
                                <br/>
                                T: +91-9971289321
                                <br/>
                                Monday-Saturday: 9.00 am - 9.00 pm
                            </div>
                        </div>
                        <div className="column">
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