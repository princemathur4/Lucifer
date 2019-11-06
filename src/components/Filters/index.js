import React, { Fragment } from 'react';
import './style.scss';
import { Link } from "react-router-dom";
import { observer } from 'mobx-react';
import {  } from "../../templates/product";


class Filters extends React.Component {
    render() {
        return (
            <Fragment>
                <section className="filters-container">
                    <div className="filters-header">
                        <div className="filters-title">
                            FILTERS
                        </div>
                        <div className="clear-filters">
                            Clear
                        </div>
                    </div>
                </section>
            </Fragment>
        )
    }
}

export default observer(Filters);