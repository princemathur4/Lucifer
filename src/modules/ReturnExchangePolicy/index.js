import React, { Fragment, Component } from 'react';
import './style.scss';

export default class ReturnExchangePolicy extends Component {
    render(){
        return(
            <div className="static-rep-container">
                <div className="static-rep-header">
                    Return/Exchange Policy
                </div>
                <div className="static-rep-content">
                <p>All the products on our site come with immediate exchange policy if there’s a manufacturing defect found. You can contact our representative to claim the warranty. There are some points you need to note regarding our return policy.  : </p>
                    <br/>
                    <ul className="one-ul">
                        <li>Customers will have to pay for the shipping to send back the product to us. </li>
                        <li>The defect must be reported to us within 2 days of the delivery. </li>
                        <li>In case you want a refund, the amount will be provided virtually where you will be able to get another item within 3 months. You can write to us for more details.</li>
                    </ul>
                </div>
            </div>
        )
    }
}