import React, { Fragment } from 'react';
import './style.scss';
import { Link } from "react-router-dom";
import { observer } from 'mobx-react';
import { titleCase } from "../../utils/utilFunctions";

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
                    <div className="filters-body">
                        {this.props.filtersBlueprint ?
                            this.props.filtersBlueprint.map((obj, idx)=>{
                                return(
                                    <div className="filter-field">
                                        <div className="filter-field-title">
                                            {titleCase(obj.filter_name)}
                                        </div>
                                        <div className="filter-field-content">
                                        {
                                            obj.filter_type === "multiSelect" &&
                                            obj.values.map((optionObj, idx)=>{
                                                return (
                                                    <label class="checkbox">
                                                        <input type="checkbox" value={optionObj.key}/>
                                                        {optionObj.title}
                                                    </label>
                                                )
                                            })
                                        }
                                        </div>
                                    </div>
                                )
                            })
                            :
                            <span>No Data</span>
                        }
                    </div>
                    
                </section>
            </Fragment>
        )
    }
}

export default observer(Filters);