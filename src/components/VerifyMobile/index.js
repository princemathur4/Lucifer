import React, { Component, Fragment } from "react";
import './style.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import commonApi from "../../apis/common";
import { getSession } from "../../utils/AuthUtils";

class VerifyMobile extends Component {
    constructor(props){
        super(props)
        this.state = {
            mobile: "",
            mobileInvalid: false,
            otpSent: false,
            otp: '',
            otpInvalid: false,
            sendOtpLoader: false,
            verifyOtpLoader: false,
            responseMsg: "",
            responseType: "",
            otpVerified: false
        }
    }

    async onSubmitMobile() {
        if (!this.state.mobile || isNaN(this.state.mobile) || String(this.state.mobile).length !== 10) {
            this.setState({ mobileInvalid: true });
        } else {
            this.setState({ mobileInvalid: false, sendOtpLoader: true });
        }

        let session = await getSession();
        try {
            let response = await commonApi.post(`send_user_otp`,
                { phone: this.state.mobile },
                { headers: { "Authorization": session.accessToken.jwtToken } }
            );
            console.log("send otp response", response);
            if (response.data && response.data.success) {
                this.setState({ otpSent: true, responseMsg: "OTP has been sent to your mobile", responseType: "success", sendOtpLoader: false })
            } else {
                this.setState({ otpSent: false, responseMsg: response.data.message, responseType: "error", sendOtpLoader: false });
            }
        }
        catch (e) {
            console.log("error", e);
            this.setState({ otpSent: false, responseMsg: "Something Went Wrong, Please try again later", responseType: "error", sendOtpLoader: true });
        }
    }

    async onSubmitOtp() {
        if (!this.state.otp || isNaN(this.state.otp) ){
            this.setState({ otpInvalid: true });
        } else {
            this.setState({ otpInvalid: false, verifyOtpLoader: true });
        }

        let session = await getSession();
        try {
            let response = await commonApi.post(`verify_mobile_otp`,
                { otp: this.state.otp },
                { headers: { "Authorization": session.accessToken.jwtToken } }
            );
            console.log("cart update response", response);
            if (response.data && response.data.success) {
                this.setState({ 
                    otpVerified: true, 
                    responseMsg: 'OTP Matched! Your number is verified successfully.', 
                    responseType: "success", 
                    verifyOtpLoader: false
                });
                this.props.onVerificationResult(true, this.state.mobile);
            } else {
                this.setState({ otpVerified: false, responseMsg: response.data.message, responseType: "error", verifyOtpLoader: false });
            }
        }
        catch (e) {
            console.log("error", e);
            this.setState({ otpVerified: false, responseMsg: 'Something went wrong.', responseType: "error", verifyOtpLoader: false });
        }
    }

    onInputChange = event => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    };

    onCloseResponse = ()=>{
        this.setState({ responseMsg: "" });
    }

    render() {
        return (
            <div className="verify-container">
                <div className="verify-title">Verify your Phone Number</div>
                <div className="verify-subtitle">We verify your phone number to deliver a better experience at your house</div>
                <div className="verify-content">
                    <div className="field">
                        <div className="field-title">Phone Number</div>
                        <div className={
                            !this.state.mobileInvalid ?
                                "control has-icons-left" :
                                "control has-icons-left has-icons-right is-danger"
                        }
                        >
                            <input
                                className={!this.state.mobileInvalid ? "input" : "input is-danger"}
                                type="number"
                                maxLength="10"
                                placeholder="Enter your phone number"
                                name="mobile"
                                disabled={this.state.otpSent}
                                onChange={this.onInputChange}
                            />
                            <span className="icon is-small is-left">
                                <FontAwesomeIcon className="mobile" icon="mobile-alt" />
                            </span>
                            {
                                this.state.mobileInvalid &&
                                <Fragment>
                                    <span className="icon is-small is-right">
                                        <FontAwesomeIcon icon="exclamation-triangle" />
                                    </span>
                                    <p className="help is-danger">
                                        Please enter a valid phone number
                                    </p>
                                </Fragment>
                            }
                        </div>
                    </div>
                    {this.state.otpSent &&
                        <div className="field">
                            <div className="field-title">One Time Password (OTP)</div>
                            <div className={
                                !this.state.otpInvalid ?
                                    "control has-icons-left" :
                                    "control has-icons-left has-icons-right is-danger"
                               }
                            >
                                <input
                                    className={!this.state.otpInvalid ? "input" : "input is-danger"}
                                    type="number"
                                    maxLength="10"
                                    placeholder="Enter the OTP sent to your mobile"
                                    name="otp"
                                    onChange={this.onInputChange}
                                />
                                <span className="icon is-small is-left">
                                    <FontAwesomeIcon className="otp" icon="key" />
                                </span>
                                {
                                    this.state.otpInvalid &&
                                    <Fragment>
                                        <span className="icon is-small is-right">
                                            <FontAwesomeIcon icon="exclamation-triangle" />
                                        </span>
                                        <p className="help is-danger">
                                            Invalid OTP
                                                                                </p>
                                    </Fragment>
                                }
                            </div>
                        </div>
                    }
                    {
                        !this.state.otpSent &&
                        <button className={this.state.sendOtpLoader ? "button send-otp-btn is-loading" : "button send-otp-btn"}
                            onClick={this.onSubmitMobile.bind(this)}
                        >Send OTP</button>
                    }
                    {
                        this.state.otpSent && !this.otpVerified &&
                        <button className={this.state.verifyOtpLoader ? "button send-otp-btn is-loading" : "button send-otp-btn"}
                            onClick={this.onSubmitOtp.bind(this)}
                        >Submit</button>
                    }
                    {
                        this.state.responseMsg &&
                        <div className={"response-text is-" + this.state.responseType}>
                            <span className="response-tag">
                                {this.state.responseMsg}
                            </span>
                            <button className="delete is-small" onClick={this.onCloseResponse} ></button>
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default VerifyMobile