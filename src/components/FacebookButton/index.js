import React, { Component, Fragment } from 'react';
import { Auth } from "aws-amplify";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class FacebookButton extends Component {

    waitForInit = () => {
        return new Promise((res, rej) => {
            const hasFbLoaded = () => {
                if (window.FB) {
                    res();
                } else {
                    setTimeout(hasFbLoaded, 300);
                }
            };
            hasFbLoaded();
        });
    }

    async componentDidMount() {
        await this.waitForInit();
        this.setState({ isLoading: false });
    }

    statusChangeCallback = response => {
        if (response.status === "connected") {
            this.handleResponse(response.authResponse);
        } else {
            this.handleError(response);
        }
    };

    checkLoginState = () => {
        window.FB.getLoginStatus(this.statusChangeCallback);
    };

    handleClick = () => {
        window.FB.login(this.checkLoginState, { scope: "public_profile,email" });
    };

    handleError(error) {
        alert(error);
    }

    async handleResponse(data) {
        const { email, accessToken: token, expiresIn } = data;
        const expires_at = expiresIn * 1000 + new Date().getTime();
        const user = { email };

        this.setState({ isLoading: true });

        try {
            const response = await Auth.federatedSignIn(
                "facebook",
                { token, expires_at },
                user
            );
            console.log("Facebook federated login reposne: ", response)
            this.props.auth.setAuthStatus(true);
        } catch (e) {
            this.handleError(e);
        }
    }

    render() {
        return (
            <button className="button" onClick={this.handleClick}>
                <span className="icon" style={{ height: "1rem" }}>
                    <FontAwesomeIcon icon={['fab', 'facebook-square']} style={{ color: "#3e3eb5" }} />
                </span>
                <span>Facebook</span>
            </button>

        )
    }
}

export default FacebookButton;