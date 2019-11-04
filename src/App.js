import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import Home from './modules/Home';
import ProductsPage from './modules/ProductsPage';
import Cart from './modules/Cart';
import "./App.scss";
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import { decorate, observable, action, computed } from 'mobx';
import AppStore from './AppStore';

decorate(
    AppStore, {
        filters: observable
    }
)
const store = new AppStore();

class App extends React.Component {
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
            path: "/signin",
            component: Home,
            name: "signin",
            customProps: {
                name: "signin",
                store
            }
        },
        {
            path: "/signup",
            component: Home,
            name: "signup",
            customProps: {
                name: "signup",
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
    ]

    render() {
        return (
            <Router >
                <NavBar />
                {
                    this.routes.map(({ path, component: C, name, customProps }) => (
                        <Route path={path} exact={true} key={name}
                            render={
                                (props) => {
                                    if (path === "/") {
                                        return <Redirect to="/home" />;
                                    } else {
                                        return (
                                            <C
                                                {...props}
                                                {...customProps}
                                            />
                                        )
                                    }

                                }
                            }
                        >
                        </Route>
                    ))
                }
                <Footer />
            </Router>
        )
    }
}

export default App;
