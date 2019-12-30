import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import Home from './modules/Home';
import ProductsPage from './modules/ProductsPage';
import Product from './modules/Product';
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
import Specials from "./modules/Specials";
import './apis/interceptors';
import ComingSoonPage from './modules/ComingSoonPage';
import Latest from './modules/Latest';

decorate(
    AppStore, {
        filters: observable,
        filtersBlueprint: observable,
        productResults: observable,
        filtersLoader: observable,
        productListLoader: observable,
        orderby : observable,
        currentPage : observable,
        totalPages : observable,
        cartItems: observable,
        setCartItems: action,
        setFilters: action,
        setFilterBlueprint: action,
        setProductResults: action,
        setFiltersLoader: action,
        setProductListLoader: action
    }
)

export const store = new AppStore();

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
            component: MainLoginPage,
            name: "mainPage",
            authRequired: false,
            customProps: {
                name: "mainPage",
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
        // {
        //     path: "/men",
        //     component: Home,
        //     name: "men",
        //     authRequired: false,
        //     customProps: {
        //         name: "men",
        //         store
        //     }
        // },
        {
            path: "/login",
            component: MainLoginPage,
            name: "login",
            authRequired: false,
            customProps: {
                authComponent: true,
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
                authComponent: true,
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
                authComponent: true,
                title: 'Request new password',
                name: 'forgotPassword',
                store
            }
        },
        {
            path: '/resend_verification_code',
            component: MainLoginPage,
            name: 'resendVerificationCode',
            authRequired: false,
            customProps: {
                authComponent: true,
                title: 'Resend Verification Code',
                name: 'resendVerificationCode',
                store
            }
        },
        {
            path: "/products",
            component: ProductsPage,
            name: "products",
            authRequired: false,
            customProps: {
                name: "products",
                store
            }
        },
        {
            path: "/product",
            component: Product,
            name: "product",
            authRequired: false,
            customProps: {
                name: "product",
                store
            }
        },
        {
            path: "/specials",
            component: Specials,
            name: "specials",
            authRequired: false,
            customProps: {
                name: "specials",
                store
            }
        },
        {
            path: "/latest",
            component: Latest,
            name: "latest",
            authRequired: false,
            customProps: {
                name: "latest",
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
        {
            path: "/blog",
            component: ComingSoonPage,
            name: "blog",
            authRequired: true,
            customProps: {
                name: "blog",
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

    setRedirectUrl = () => {
        if(store.redirectRoute === ""){
            store.setRedirectRoute(window.location.href.split(window.location.origin)[1]);
        }
        return true;
    }

    clearRedirectUrl = (customProps) =>{ 
        if(!customProps.authComponent && store.redirectRoute){
           store.setRedirectRoute('');
        }
        return true;
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
                                                <NavBar { ...props} name={customProps.name} store={store} auth={authProps} />
                                                {
                                                    !authRequired ?
                                                    <C
                                                        {...props}
                                                        {...customProps}
                                                        auth={authProps}
                                                    />
                                                    :(
                                                        (authRequired && this.state.isAuthenticated)
                                                        ? 
                                                        this.clearRedirectUrl(customProps) &&
                                                        <C
                                                            {...props}
                                                            {...customProps}
                                                            auth={authProps}
                                                        /> 
                                                        :
                                                        this.setRedirectUrl() &&
                                                        <Redirect to="/login" />
                                                    )
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
