import React, {Fragment} from 'react';
import './style.scss';
import { Link } from 'react-router-dom';


class Home extends React.Component{
    render(){
        return (
            <Fragment>
                <div className="images-container">
                        <div className="row-container">
                            <div className="tile image-container">
                                <img src="https://i.ibb.co/7bGTh6q/bf862c44-3584-43de-a62a-82781152c733.jpg" className="img-element"/>
                                <div className="left-overlay">
                                    <Link to="/products/jeans" className="text">◀ Jeans </Link>
                                </div>
                            </div>
                            <div className="tile image-container">
                                <img src="https://i.ibb.co/mTHtzQd/39d84077-ab6b-49e6-9715-b442919a3f4a.jpg" className="img-element"/>
                                <div className="right-overlay">
                                    <Link to="/products/chinos" className="text">Chinos ▶</Link>
                                </div>
                            </div>
                        </div>
                        <div className="row-container">
                            <div className="tile image-container">
                                <img src="https://i.ibb.co/fYtcb2w/eb07740e-1366-4d12-a246-15ed66721a4b.jpg" className="img-element"/>
                                <div className="right-overlay">
                                    <Link to="/latest" className="text">◀ Specials</Link>
                                </div>
                            </div>
                            <div className="tile image-container">
                                <img src="https://i.ibb.co/K2B4JyB/89d97d35-05b6-4730-a5a3-518e9b1698f5.jpg" className="img-element"/>
                                <div className="right-overlay">
                                    <Link to="/specials" className="text">Latest Collections ▶</Link>
                                </div>
                            </div>
                    </div>
                </div>
                <nav className="features-container">
                    <div className="feature">
                        <img src="https://i.ibb.co/9w7qbfD/free-shipping.png" />
                        <p className="heading">FREE WORLDWIDE SHIPPING</p>
                    </div>
                    <div className="feature">
                        <img src="https://i.ibb.co/x3KyqhK/money-back.png" />
                        <p className="heading">MONEY BACK GUARANTEE</p>
                    </div>
                    <div className="feature">
                        <img src="https://i.ibb.co/BfxxzZ3/customer-service.png"/>
                        <p className="heading">24/7 CUSTOMER SUPPORT</p>
                    </div>
                    <div className="feature">
                        <img src="https://i.ibb.co/178sGW4/secure-payments.png"/>
                        <p className="heading">SECURE ONLINE PAYMENTS</p>
                    </div>
                </nav>
            </Fragment>
        )
    }
}
export default Home;