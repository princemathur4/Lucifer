import React, { Fragment } from 'react';
import './style.scss';
import { Link } from "react-router-dom";
import { observer } from 'mobx-react';
import { titleCase } from "../../utils/utilFunctions";
import { Checkbox } from 'semantic-ui-react';
import Spinner from "../../components/Spinner";
import remove from 'lodash.remove';

class Filters extends React.Component {
    state = {
        tagsList: [],
        errors: {
            price: false
        }
    }

    handleApplyFilters = () => {
        let filters = {};
        this.props.filtersBlueprint.forEach((obj)=>{
            if (this.state[obj.filter_name] && this.state[obj.filter_name].length){
                filters[obj.filter_name] = this.state[obj.filter_name]
            } else if ( obj.filter_name === "price" ){
                if (this.state["min_price"]){
                    filters['min_price'] = Number(this.state["min_price"]);
                }
                if (this.state["max_price"]){
                    filters['max_price'] = Number(this.state["max_price"]);
                }
            }
        });
        console.log("filters", filters);
        this.props.makeGetProductsApiCall(filters);
    }
    
    handleClearFilters = () => {
        // if(!this.state.tagsList.length){
        //     return;
        // }
        this.props.filtersBlueprint.forEach((obj) => {
            if(obj.filter_type === "multiSelect"){
                this.setState({ [obj.filter_name]: [] });
            } else {
                this.setState({ [obj.filter_name]: '' });
            }
        });
        this.setState({ max_price: "", min_price: "", tagsList: [] });
        this.props.makeGetProductsApiCall({});
    }

    handleCheckboxFilter = (e, obj) => {
        let filterState;
        let { tagsList } = this.state;
        if (!this.state[obj.name] || !this.state[obj.name].length) {
            filterState = []
        } else {
            filterState = [...this.state[obj.name]];
        }

        if (filterState.includes(obj.value)) {
            let index = filterState.indexOf(obj.value);
            if (index > -1)
                filterState.splice(index, 1);
            remove(tagsList, { filter_type: obj.name, value: obj.value, title: obj.title  })
        } else {
            filterState.push(obj.value);
            tagsList.push({
                filter_type: obj.name,
                value: obj.value,
                title: obj.title
            });
        }
        this.setState({
            [obj.name]: filterState,
            tagsList
        })
    }

    onTagRemove = (obj) => {
        let filterState = [...this.state[obj.filter_type]];
        let { tagsList } = this.state;
        if (filterState.includes(obj.value)) {
            let index = filterState.indexOf(obj.value);
            if (index > -1)
                filterState.splice(index, 1);
            remove(tagsList, { filter_type: obj.filter_type, value: obj.value, title: obj.title })
        }
        this.setState({
            [obj.filter_type]: filterState,
            tagsList
        })
    }

    onInputChange = (e) =>{
        console.log(e.target.name,e.target.value);
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    render() {
        return (
            <Fragment>
                {
                    this.props.filtersLoader
                        ?
                        <div className="loader-container">
                            <Spinner color="primary" size="medium" />
                        </div>
                        :
                        (
                            this.props.filtersBlueprint.length ?
                                <section className="filters-container">
                                    <div className="filters-header">
                                        <div className="filters-title">
                                            FILTERS
                                        </div>
                                        <div className="clear-filters" onClick={this.handleClearFilters}>
                                            Clear
                                        </div>
                                    </div>
                                    <button className="apply-button" onClick={this.handleApplyFilters}>Apply</button>
                                    <div className="filter-tags">
                                    {
                                        this.state.tagsList.map((obj, idx)=>{
                                            return (
                                                <span className="tag is-info is-light" key={idx}>
                                                    {obj.title}
                                                    <button className="delete is-small" onClick={()=>{this.onTagRemove(obj)}}></button>
                                                </span>
                                            )
                                        })
                                    }
                                    </div>
                                    <div className="filters-body">
                                        {
                                            this.props.filtersBlueprint.map((obj, idx) => {
                                                return (
                                                    <div className="filter-field" key={idx}>
                                                        <div className="filter-field-title">
                                                            {titleCase(obj.filter_name)}
                                                        </div>
                                                        <div className="filter-field-content">
                                                            {
                                                                obj.filter_type === "multiSelect" &&
                                                                obj.values.map((optionObj, chbx) => {
                                                                    return (
                                                                        <Checkbox
                                                                            key={chbx}
                                                                            name={obj.filter_name}
                                                                            title={optionObj.title}
                                                                            value={optionObj.key}
                                                                            checked={!!this.state[obj.filter_name] && this.state[obj.filter_name].includes(optionObj.key)}
                                                                            onChange={this.handleCheckboxFilter}
                                                                            label={
                                                                                <label className="color-label">
                                                                                    {
                                                                                        optionObj.color &&
                                                                                        <div className="color-box" style={{ background: optionObj.color }}></div>
                                                                                    }
                                                                                    {optionObj.title}
                                                                                </label>
                                                                            }
                                                                        />
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
                                                                            value={this.state[`min_${obj.filter_name}`]}
                                                                            name={`min_${obj.filter_name}`}
                                                                            onChange={this.onInputChange}
                                                                        />
                                                                    </div>
                                                                    <div className={!this.state.errors[obj.filter_name] ? "control" : "control is-danger"}
                                                                        style={{ marginLeft: "1rem" }}
                                                                        >
                                                                        <input
                                                                            className={!this.state.errors[obj.filter_name] ? "input" : "input is-danger"}
                                                                            type="number"
                                                                            placeholder="₹ Max"
                                                                            value={this.state[`max_${obj.filter_name}`]}
                                                                            maxLength={`${obj.max}`}
                                                                            name={`max_${obj.filter_name}`}
                                                                            onChange={this.onInputChange}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            }
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </section>
                                :
                                <div className="no-data">NO FILTERS</div>
                        )
                }
            </Fragment>
        )
    }
}

export default observer(Filters);