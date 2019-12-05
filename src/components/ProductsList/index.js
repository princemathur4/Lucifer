import React, { Fragment } from 'react';
import './style.scss';
import { Link } from "react-router-dom";
import { observer } from 'mobx-react';
import ProductItem from "../ProductItem";

class ProductList extends React.Component {
    state= {
        loginModalActive: false
    }

    componentDidMount() {
    }

    handleLoginWarning = () =>{
        this.setState({ loginModalActive: true });
    }

    handleCloseModal = () => {
        this.setState({ loginModalActive: false });
    }

    render() {
        return (
            <Fragment>
                <div className={this.state.loginModalActive ? "modal is-active": "modal"}>
                    <div className="modal-background"></div>
                    <div className="modal-content">
                        <div className="login-modal-content">
                            <div className="login-modal-header">
                                <div className="login-modal-title">You need to be logged in to Add products to Cart/Wishlist</div>
                                <button onClick={this.handleCloseModal} className="delete" aria-label="close"></button>
                            </div>
                            <div className="login-modal-body">
                                <div className="buttons-container">
                                    <button className="button is-dark"><Link to="/login">Login</Link></button>
                                    <div className="or-text">OR</div>
                                    <button className="button is-dark"><Link to="/signup">Signup</Link></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    this.props.data.map((obj, idx)=>{
                        return (
                            <ProductItem 
                                auth={this.props.auth}
                                key={idx} 
                                productData={obj}
                                handleLoginWarning={this.handleLoginWarning}
                            />
                        )
                    })
                }
            </Fragment>
        )
    }
}

export default observer(ProductList);