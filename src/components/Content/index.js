import React, { Fragment } from 'react';
import './style.scss';

class Content extends React.Component {
    render() {
        return (
            <Fragment>
                <div className="tile-container">
                    <div className="tile is-ancestor">
                        <div className="tile is-vertical is-6">
                            <div className="tile image-container">
                                <img src="public/img/women_pink.png" className="img-element"/>
                                <div className="left-overlay">
                                    <a className="text">◀ Women </a>
                                </div>
                            </div>
                        </div>
                        <div className="tile is-vertical is-6">
                            <div className="tile image-container">
                                <img src="public/img/men_4.png" className="img-element"/>
                                <div className="right-overlay">
                                    <a className="text">Men ▶</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="tile is-ancestor">
                    <div className="tile is-vertical is-8">
                        <div className="tile image-container">
                            <img src="public/img/COVER.png" className="img-element"/>
                            <div className="right-overlay">
                                <a className="text">◀ Shoes and Accessories</a>
                            </div>
                        </div>
                    </div>
                    <div className="tile is-vertical is-4">
                        <div className="tile image-container">
                            <img src="public/img/men_3.png" className="img-element"/>
                            <div className="right-overlay">
                                <a className="text">Winter Collections ▶</a>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>

            </Fragment>
        )
    }
}

export default Content;