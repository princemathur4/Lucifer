import React, { Fragment } from 'react';
import './style.scss';
import { Link } from "react-router-dom";
import { observer } from 'mobx-react';
import { titleCase } from "../../utils/utilFunctions";
import { Checkbox } from 'semantic-ui-react';

class Filters extends React.Component {
    state = {
        errors: {
            price: false
        }
    }

    handleCheckboxFilter = (e, obj) => {
        console.log("handleCheckboxFilter",e);
        console.log("val", obj);
        let filterState;
        if (!this.state[obj.title] || !this.state[obj.title].length) {
            filterState = []
        } else {
            filterState = [...this.state[obj.title]];
        }
        
        if (filterState.includes(obj.value)) {
            let index = filterState.indexOf(obj.value);
            if (index > -1)
                filterState.splice(index, 1);
        } else {
            filterState.push(obj.value);
        }
        this.setState({
            [obj.title]: filterState
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
                    <button className="apply-button">Apply</button>
                    <div className="filters-body">
                        {this.props.store.filtersBlueprint ?
                            this.props.store.filtersBlueprint.map((obj, idx)=>{
                                return(
                                    <div className="filter-field" key={idx}>
                                        <div className="filter-field-title">
                                            {titleCase(obj.filter_name)}
                                        </div>
                                        <div className="filter-field-content">
                                        {
                                            obj.filter_type === "multiSelect" &&
                                            obj.values.map((optionObj, chbx)=>{
                                                console.log(!!this.state[obj.filter_name] && this.state[obj.filter_name].includes(optionObj.key))
                                                return (
                                                    <Checkbox 
                                                        // key={chbx}
                                                        // title={obj.filter_name}
                                                        // value={optionObj.key}
                                                        // checked={!!this.state[obj.filter_name] && this.state[obj.filter_name].includes(optionObj.key)}
                                                        checked={true}
                                                        onChange={this.handleCheckboxFilter} 
                                                        label={
                                                            <div className="label-container">
                                                            {
                                                                optionObj.hex 
                                                                ? 
                                                                <label className="color-label">
                                                                    <div className="color-box" style={{ background: optionObj.hex }}></div>
                                                                    {optionObj.title}
                                                                </label>
                                                                :
                                                                <label>{optionObj.title}</label>
                                                            }
                                                            </div>
                                                        }
                                                    />                                   

                                                    // <label className="checkbox">
                                                    //     <input type="checkbox" value={optionObj.key}/>
                                                    //     {optionObj.title}
                                                    // </label>
                                                )
                                            })
                                        }
                                        {
                                            obj.filter_type === "range" &&
                                            <div className="range-input-container">
                                                <div className={!this.state.errors[obj.filter_name] ? "control" : "control is-danger"}>
                                                    <input
                                                        className={!this.state.errors[obj.filter_name] ? "input" : "input is-danger"}
                                                        type="number"
                                                        placeholder="₹ Min"
                                                        minLength={`${obj.min}`}
                                                        // name={obj.filter_name}
                                                        // onChange={this.onInputChange}
                                                        />
                                                </div>
                                                <div className={!this.state.errors[obj.filter_name] ? "control" : "control is-danger"} 
                                                    style={{ marginLeft: "1rem" }}
                                                >
                                                    <input
                                                        className={!this.state.errors[obj.filter_name] ? "input" : "input is-danger"}
                                                        type="number"
                                                        placeholder="₹ Max"
                                                        maxLength={`${obj.max}`}
                                                        // name={obj.filter_name}
                                                        // onChange={this.onInputChange}
                                                        />
                                                </div>
                                            </div>
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