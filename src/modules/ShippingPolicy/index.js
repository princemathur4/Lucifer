import React, { Fragment, Component } from 'react';
import './style.scss';

export default class ShippingPolicy extends Component {
    render(){
        return(
            <div className="static-shp-container">
                <div className="static-shp-header">
                    Shipping Policy
                </div>
                <div className="static-shp-content">
                    <p>Labroz is collaborating with a range of delivery services that has a good reputation for delivering the product in the safest way possible. We believe that it is directly related to customer satisfaction and we need to make some key points clear to our customers : </p>
                    <br/>
                    <ul className="one-ul">
                        <li>The products are shipped from Monday to Saturday, except for the national holidays.</li>
                        <li>Once you placed an order, the product will be shipped within two days.  </li>
                        <li>If the product is less than Rs. 999 value, you will be charged with Rs. 50 delivery charges, if the order is prepaid and it will be Rs. 100 if you opted for COD.</li>
                        <li>There will be no shipping charges on the orders above Rs 999.</li>
                        <li>The product will reach you within 4 days of the shipping date. </li>
                    </ul>
                </div>
            </div>
        )
    }
}
