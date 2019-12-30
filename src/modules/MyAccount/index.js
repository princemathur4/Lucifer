import React, { Component, Fragment } from "react";
import { Link } from 'react-router-dom';
import Profile from '../../components/Profile';
import Addresses from '../../components/Addresses';
import "./style.scss";
import { myAccountTabs } from "../../constants";
import ChangePassword from "../../components/ChangePassword";
import Orders from "../../components/Orders";

class MyAccount extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeTab: this.props.name
        }
    }

    render() {
        return (
            <Fragment>
                <section className="hero is-black is-light">
                    <div className="hero-body">
                        <div className="container">
                            <div className="title">
                                My account
                            </div>
                            {this.props.auth.user &&
                                <div className="user-name">
                                    {this.props.auth.user.attributes.name}
                                </div>
                            }
                        </div>
                    </div>
                </section>
                <div className="my-account-container">
                    <div className="side-menu">
                        <aside className="menu">
                        {
                            Object.keys(myAccountTabs).map((key, idx )=>{
                                return (
                                    <Fragment key={idx}>
                                        <p className="menu-label">
                                            {key}
                                        </p>
                                        <ul className="menu-list">
                                        {   myAccountTabs[key].map((obj, idx)=>{
                                                return (
                                                    <li key={idx}><Link to={obj.url} className={this.props.name === obj.name ? "is-active": ""}>{obj.title}</Link></li>
                                                )
                                            })
                                        }
                                        </ul>
                                    </Fragment>
                                )
                            })
                        }
                        </aside>
                    </div>
                    <div className="content">
                        {this.state.activeTab === "profile" &&
                            <Profile {...this.props} />
                        }
                        {this.state.activeTab === "addresses" &&
                            <Addresses {...this.props} addBtnPosition="header"/>
                        }
                        {this.state.activeTab === "passwords" &&
                            <ChangePassword {...this.props}/>
                        }
                        {this.state.activeTab === "orders" &&
                            <Orders {...this.props}/>
                        }
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default MyAccount;