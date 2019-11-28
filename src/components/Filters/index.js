import React, { Fragment } from 'react';
import './style.scss';
import { Link } from "react-router-dom";
import { observer } from 'mobx-react';
import { titleCase } from "../../utils/utilFunctions";
import { Checkbox } from 'semantic-ui-react';

class Filters extends React.Component {
    state = {

    }

    handleCheckboxFilter = (e) => {
        console.log("e",e);
        let filterState = this.state[e.target.name];
        if (!filterState || !filterState.length){
            filterState = []
        }
        filterState.push(e.target.value);
        this.setState({
            [e.target.name]: filterState
        })
    }

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
                                                    <Checkbox 
                                                        name={optionObj.filter_name}
                                                        value={optionObj.key}
                                                        label={
                                                            <div className="label-container">
                                                            {
                                                                optionObj.hex 
                                                                ? 
                                                                <label className="color-label"><div className="color-box" style={{ background: optionObj.hex }}></div>{optionObj.title}</label>
                                                                :
                                                                <label>{optionObj.title}</label>
                                                            }
                                                            </div>
                                                        }
                                                        checked={this.state[optionObj.filter_name] && this.state[optionObj.filter_name].includes(optionObj.key)}
                                                        onChange={this.handleCheckboxFilter} 
                                                    />                                   

                                                    // <label class="checkbox">
                                                    //     <input type="checkbox" value={optionObj.key}/>
                                                    //     {optionObj.title}
                                                    // </label>
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