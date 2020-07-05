import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import "./App.scss";
import "./imports";
import Auth from '@aws-amplify/auth';
import './apis/interceptors';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import { store } from './AppStore';
import { routes } from "./constants/routes";
import ScrollToTop from "./components/ScrollToTop";


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuthenticated: false,
            isAuthenticating: true,
            user: null,
        }
    }

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
        if (store.redirectRoute === "") {
            store.setRedirectRoute(window.location.href.split(window.location.origin)[1]);
        }
        return true;
    }

    clearRedirectUrl = (customProps) => {
        if (!customProps.authComponent && store.redirectRoute) {
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
                <ScrollToTop>
                    <Switch>
                        {
                            routes.map(({ path, component: C, name, customProps, authRequired }) => (

                                <Route path={path} exact={true} key={name}
                                    render={
                                        (props) => {
                                            if (path === "/home") {
                                                return <Redirect to="/" />;
                                            } else {
                                                return (
                                                    <Fragment>
                                                        <NavBar {...props} name={customProps.name} store={store} auth={authProps} />
                                                        {
                                                            !authRequired ?
                                                                <C
                                                                    {...props}
                                                                    {...customProps}
                                                                    auth={authProps}
                                                                />
                                                                : (
                                                                    (authRequired && this.state.isAuthenticated)
                                                                        ?
                                                                        <C
                                                                            {...props}
                                                                            {...customProps}
                                                                            auth={authProps}
                                                                        />
                                                                        :
                                                                        <Redirect to="/login" />
                                                                )
                                                        }
                                                        <Footer {...props} auth={authProps} />
                                                    </Fragment>
                                                )
                                            }

                                        }
                                    }
                                >
                                </Route>
                            ))
                        }
                    </Switch>
                </ScrollToTop>
            </Router>
        )
    }
}

export default App;
