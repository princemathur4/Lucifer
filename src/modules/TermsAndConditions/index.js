import React, { Fragment, Component } from 'react';
import './style.scss';

export default class TermsAndConditions extends Component {
    render(){
        return(
            <div className="static-tnc-container">
                <div className="static-tnc-header">
                    Terms and Conditions
                </div>
                <div className="static-tnc-content">
                    <p>This section will provide you with all the information related to any intrusion, website tampering, or/and regarding any product listed on our website. Before purchasing any item from us, you must be agreeing with our terms. We reserve all the rights to us of withdrawing the said services at any given time and we will not be liable to anyone. The linked sites also work on their own and any wrongdoing on their part doesn’t make us responsible in any way. This website is also the intellectual property of the owner and all the licenses for the software and content used in designing and maintaining the website falls under the copyright act. However, you can take any image, print, or design for your personal use and must not be reproduced in any form for professional or business use. </p> 
                    <br/>
                </div>
            </div>
        )
    }
}