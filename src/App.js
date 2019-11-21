import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import Home from './modules/Home';
import ProductsPage from './modules/ProductsPage';
import Cart from './modules/Cart';
import "./App.scss";
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import "./imports";
import { decorate, observable, action, computed } from 'mobx';
import AppStore from './AppStore';
import Auth from '@aws-amplify/auth';
import MainLoginPage from "./components/MainLoginPage";
import config from './config';

decorate(
    AppStore, {
        filters: observable
    }
)
const store = new AppStore();

class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isAuthenticated: false,
            isAuthenticating: true,
            user: null,
        }
    }

    routes = [
        {
            path: "/",
            component: {},
            name: "",
            customProps: {
                name: "",
            }
        },
        {
            path: "/home",
            component: Home,
            name: "home",
            customProps: {
                name: "home",
                store
            }
        },
        {
            path: "/men",
            component: Home,
            name: "men",
            customProps: {
                name: "men",
                store
            }
        },
        {
            path: "/women",
            component: Home,
            name: "women",
            customProps: {
                name: "women",
                store
            }
        },
        {
            path: "/login",
            component: MainLoginPage,
            name: "login",
            customProps: {
                name: "login",
                title: "Login",
                store
            }
        },
        {
            path: "/signup",
            component: MainLoginPage,
            name: "signUp",
            customProps: {
                name: "signUp",
                title: "Sign Up",
                store
            }
        },
        {
            path: '/forgot_password',
            component: MainLoginPage,
            name: 'forgotPassword',
            customProps: {
                title: 'Request new password',
                name: 'forgotPassword',
                store
            }
        },
        {
            path: '/resend_mail',
            component: MainLoginPage,
            name: 'resendMail',
            customProps: {
                title: 'Resend Verification Code',
                name: 'resendMail',
                store
            }
        },
        {
            path: "/products",
            component: ProductsPage,
            name: "product",
            authRequired: false,
            customProps: {
                name: "product",
                store
            }
        },
        {
            path: "/cart",
            component: Cart,
            name: "cart",
            authRequired: true,
            customProps: {
                name: "cart",
                store
            }
        },
    ];

    setAuthStatus = authenticated => {
        this.setState({ isAuthenticated: authenticated });
    };

    setUser = user => {
        try {
            this.setState({ user: user });
            console.log("user", user);
        } catch (ex) {
            console.error(ex);
        }
    };

    loadFacebookSDK() {
        window.fbAsyncInit = function () {
            window.FB.init({
                appId: config.social.FB,
                autoLogAppEvents: true,
                xfbml: true,
                version: 'v3.1'
            });
        };

        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) { return; }
            js = d.createElement(s); js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }

    async componentDidMount() {
        this.loadFacebookSDK();
        this.authenticateUser();
    }

    async authenticateUser() {
        try {
            const session = await Auth.currentSession();
            const user = await Auth.currentAuthenticatedUser();

            this.setState({
                user: user,
                isAuthenticated: true,
                isAuthenticating: false
            });
        } catch (error) {
            this.setState({
                user: null,
                isAuthenticated: false,
                isAuthenticating: false
            });

            console.log(error);
        }
    }

    render() {
        const authProps = {
            isAuthenticated: this.state.isAuthenticated,
            user: this.state.user,
            setAuthStatus: this.setAuthStatus,
            setUser: this.setUser,
        };
        return (
            <Router >
                {
                    this.routes.map(({ path, component: C, name, customProps }) => (
                        <Route path={path} exact={true} key={name}
                            render={
                                (props) => {
                                    if (path === "/") {
                                        return <Redirect to="/home" />;
                                    } else {
                                        return (
                                            <Fragment>
                                                <NavBar { ...props} auth={authProps} />
                                                <C
                                                    {...props}
                                                    {...customProps}
                                                    auth={authProps}
                                                />
                                                <Footer {...props} auth={authProps}/>
                                            </Fragment>
                                        )
                                    }

                                }
                            }
                        >
                        </Route>
                    ))
                }
                
            </Router>
        )
    }
}

export default App;
