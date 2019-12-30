import React, { Fragment, Component } from 'react';
import './style.scss';

export default class PrivacyPolicy extends Component {
    render(){
        return(
            <div className="static-pp-container">
                <div className="static-pp-header">
                    Our Privacy Policy
                </div>
                <div className="static-pp-content">
                    <p>Privacy is the highest concern these days and we put our customer’s information on top priority. The personal details like name, email address, phone number, and delivery address are required to provide you a better experience. We understand that this is a very crucial data and it’s protected under PII laws. Here are the scenarios where we will use this information with the pure intention of serving you better : </p>
                    <br/>
                    <ul className="one-ul">
                        <li>To provide the customers a personalized experience like providing them promotional emails based on their purchase.</li>
                        <li>To enhance customer service and resolve the requests much faster.</li>
                        <li>We also use cookies for the following tasks however you can also disable them if you want :
                            <ul className="two-ul">
                                <li>To help you in retaining the items added in the card if you haven’t signed up yet.</li>
                                <li>Manage the advertisements.</li>
                                <li>Your preferences or favorite items will be saved and you will find them on your future website visits. </li>
                            </ul>
                        </li>
                    </ul>

                </div>
            </div>
        )
    }
}