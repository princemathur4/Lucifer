import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import Home from './modules/Home';
import ProductsPage from './modules/ProductsPage';
import Cart from './modules/Cart';
import MyAccount from './modules/MyAccount';
import "./App.scss";
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import "./imports";
import { decorate, observable, action, computed } from 'mobx';
import AppStore from './AppStore';
import Auth from '@aws-amplify/auth';
import MainLoginPage from "./components/MainLoginPage";
import './apis/interceptors';

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
            authRequired: false,
            customProps: {
                name: "",
            }
        },
        {
            path: "/home",
            component: Home,
            name: "home",
            authRequired: false,
            customProps: {
                name: "home",
                store
            }
        },
        {
            path: "/men",
            component: Home,
            name: "men",
            authRequired: false,
            customProps: {
                name: "men",
                store
            }
        },
        {
            path: "/login",
            component: MainLoginPage,
            name: "login",
            authRequired: false,
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
            authRequired: false,
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
            authRequired: false,
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
            authRequired: false,
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
        {
            path: "/myaccount",
            component: MyAccount,
            name: "myAccount",
            authRequired: true,
            customProps: {
                name: "profile",
                store
            }
        },
        {
            path: "/profile",
            component: MyAccount,
            name: "profile",
            authRequired: true,
            customProps: {
                name: "profile",
                store
            }
        },
        {
            path: "/addresses",
            component: MyAccount,
            name: "addresses",
            authRequired: true,
            customProps: {
                name: "addresses",
                store
            }
        },
        {
            path: "/passwords",
            component: MyAccount,
            name: "passwords",
            authRequired: true,
            customProps: {
                name: "passwords",
                store
            }
        },
        {
            path: "/orders",
            component: MyAccount,
            name: "orders",
            authRequired: true,
            customProps: {
                name: "orders",
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

    async componentDidMount() {
        this.authenticateUser();
    }

    async authenticateUser() {
        try {
            const session = await Auth.currentSession();
            const user = await Auth.currentAuthenticatedUser();
            console.log("user", user);
            this.setState({
                user: user,
                isAuthenticated: true,
                isAuthenticating: false
            });
        } catch (error) {
            console.log("user", null);
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
            !this.state.isAuthenticating &&
            <Router >
                {
                    this.routes.map(({ path, component: C, name, customProps, authRequired }) => (
                        <Route path={path} exact={true} key={name}
                            render={
                                (props) => {
                                    if (path === "/") {
                                        return <Redirect to="/home" />;
                                    } else {
                                        return ( 
                                            <Fragment>
                                                <NavBar { ...props} auth={authProps} />
                                                {
                                                    ((authRequired && this.state.isAuthenticated) || !authRequired) 
                                                    ? 
                                                    <C
                                                        {...props}
                                                        {...customProps}
                                                        auth={authProps}
                                                    /> 
                                                    :
                                                    <Redirect to="/login" />
                                                }
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
