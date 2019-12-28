import React, { Fragment } from 'react';
import './style.scss';
import { observer } from 'mobx-react';
import { titleCase } from "../../utils/utilFunctions";
import { Checkbox, Radio } from 'semantic-ui-react';
import remove from 'lodash.remove';
import InputRange from 'react-input-range';

class Filters extends React.Component {
    constructor(props){
        super(props);
        this.filtersChanged = false;
    }

    state = {
        tagsList: [],
        price: {
            min: 0,
            max: 0
        },
        errors: {
            price: false
        }
    }

    componentDidMount(){
        // settings max and min values of price in state
        // and in class variables
        this.props.filtersBlueprint.forEach((obj)=>{
            if(obj.filter_type === "range"){
                if(obj.filter_name === "price"){
                    this.setState({
                        price: {
                            max: obj.max,
                            min: obj.min
                        }
                    })
                    this.max_price_limit = obj.max;
                    this.min_price_limit = obj.min;
                }
            }
        })
    }

    handleApplyFilters = () => {
        let filters = {};
        this.props.filtersBlueprint.forEach((obj) => {
            if (this.state[obj.filter_name] && this.state[obj.filter_name].length) {
                filters[obj.filter_name] = this.state[obj.filter_name]
            } else if (obj.filter_name === "price") {
                if (this.state.price.min || this.state.price.min === 0) {
                    filters['min_price'] = Number(this.state.price.min);
                }
                if (this.state.price.max || this.state.price.max === 0) {
                    filters['max_price'] = Number(this.state.price.max);
                }
            }
        })
        console.log("filters", filters);
        if(this.filtersChanged){
            this.filtersChanged = false;
            this.props.handleFiltersChange(filters);
        }
    }

    handleClearFilters = () => {
        // if(!this.state.tagsList.length){
        //     return;
        // }
        let filtersExist = false;
        if(this.state.price.max !== this.max_price_limit || this.state.price.min !== this.min_price_limit){
            filtersExist = true;
        }
        let price = { ...this.state.price };
        price.max = this.max_price_limit;
        price.min = this.min_price_limit;

        this.props.filtersBlueprint.forEach((obj) => {
            if((['string', 'number'].includes(typeof(this.state[obj.filter_name])) && this.state[obj.filter_name]) || 
            (typeof(this.state[obj.filter_name]) === "object" && Object.keys(this.state[obj.filter_name]).length >= 1 )
            ){
                filtersExist = true;
            }
            if (obj.filter_type === "multiSelect") {
                this.setState({ [obj.filter_name]: [] });
            } else {
                this.setState({ [obj.filter_name]: '' });
            }
        });
        this.setState({ price, tagsList: [] });
        if(filtersExist) {
            this.props.handleFiltersChange({});
        }
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
            remove(tagsList, { filter_type: obj.name, value: obj.value, title: obj.title })
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
        this.filtersChanged = true;
    }

    handleRadioFilter = (e, obj) => {
        let { tagsList } = this.state;

        remove(tagsList, { filter_type: obj.name })
        tagsList.push({
            filter_type: obj.name,
            value: obj.value,
            title: obj.title
        });
        this.setState({
            [obj.name]: obj.value,
            tagsList
        })
        this.filtersChanged = true;
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
        this.filtersChanged = true;
    }

    handlePriceRange = (price) => {
        this.setState({ price });
    }
    
    handleChangeComplete = (price) => {
        if(price.max > this.max_price_limit){
            price.max = this.max_price_limit;
        }
        if(price.min < this.min_price_limit){
            price.min = this.min_price_limit;
        }
        this.setState({ price });
        if(price.min !== this.min_price_limit || price.max !== this.max_price_limit){
            this.filtersChanged = true;
        }
    }

    handleRangeFormat = (price) => {
        return `₹ ${price}`;
    }

    render() {
        return (
            <Fragment>
                {
                    !!this.props.filtersBlueprint.length &&
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
                                this.state.tagsList.map((obj, idx) => {
                                    return (
                                        <span className="tag is-info is-light" key={idx}>
                                            {obj.title}
                                            <button className="delete is-small" onClick={() => { this.onTagRemove(obj) }}></button>
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
                                                {titleCase(obj.filter_name).replace(/_/g, ' ')}
                                            </div>
                                            <div className="filter-field-content">
                                                {
                                                    obj.filter_type === "singleSelect" &&
                                                    obj.values.map((optionObj, chbx) => {
                                                        return (
                                                            <Radio
                                                                key={chbx}
                                                                name={obj.filter_name}
                                                                title={optionObj.title}
                                                                value={optionObj.key}
                                                                checked={!!this.state[obj.filter_name] && this.state[obj.filter_name] === optionObj.key}
                                                                onChange={this.handleRadioFilter}
                                                                label={
                                                                    <label className="color-label">
                                                                        {
                                                                            optionObj.key && obj.filter_name.toLowerCase().includes('color') &&
                                                                            <div className="color-box" style={{ background: optionObj.key }}></div>
                                                                        }
                                                                        {optionObj.title}
                                                                    </label>
                                                                }
                                                            />
                                                        )
                                                    })
                                                }
                                                {
                                                    obj.filter_type === "multiSelect" &&
                                                    obj.values.map((optionObj, chbx) => {
                                                        if (obj.filter_name === "discount" && optionObj.key === 0) {
                                                            return;
                                                        }
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
                                                                            optionObj.key && obj.filter_name.toLowerCase().includes('color') &&
                                                                            <div className="color-box" style={{ background: optionObj.key }}></div>
                                                                        }
                                                                        {optionObj.title}
                                                                    </label>
                                                                }
                                                            />
                                                        )
                                                    })
                                                }
                                                {
                                                    obj.filter_type === "range" && obj.filter_name === "price" &&
                                                    <div className="range-input-container">
                                                        <InputRange
                                                            // draggableTrack
                                                            disabled={this.max_price_limit === this.min_price_limit}
                                                            allowSameValues={true}
                                                            maxValue={obj.max}
                                                            minValue={obj.min}
                                                            value={this.state.price}
                                                            formatLabel={this.handleRangeFormat}
                                                            onChange={this.handlePriceRange} 
                                                            onChangeComplete={this.handleChangeComplete} 
                                                        />
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </section>
                }
            </Fragment>
        )
    }
}

export default observer(Filters);