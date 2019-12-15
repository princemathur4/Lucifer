import React, { Fragment } from 'react';
import Filters from '../../components/Filters';
import ProductsList from '../../components/ProductsList';
import { observer } from 'mobx-react';
import "./style.scss";
import { sortByOptions } from "../../templates/product";
import { getParameterByName } from '../../utils/Browser';
import { getSession } from "../../utils/AuthUtils";
import commonApi from "../../apis/common";
import Spinner from "../../components/Spinner";
import { productFilters, defaultFilterTemplate } from "../../constants";
import { toJS } from 'mobx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


class ProductsPage extends React.Component {
    constructor(props) {
        super(props);
        this.category = '';
        this.sub_category = '';
        this.state = {
            filtersBlueprint: [],
            filtersLoader: true,
            productResults: [],
            filteredCount: 0,
            totalCount: 0,
            productListLoader: true,
            sortBy: { 
                ...sortByOptions[0]
            },
            sort_dropdown_active: false
        }
        this.node = null;
    }

    componentDidMount() {
        this.category = getParameterByName('category', window.location.href);
        this.sub_category = getParameterByName('sub_category', window.location.href);
        this.makeFetchFiltersApiCall();
        this.makeGetProductsApiCall({});
        document.addEventListener('mousedown', this.handleClickOutside, false)
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside, false)
    }

    handleClickOutside = (e) => {
        if (this.node && this.node.contains(e.target)) {
            return;
        }
        this.setState({ sort_dropdown_active: false });
    };

    async makeFetchFiltersApiCall() {
        this.setState({ filtersLoader: true });
        let payload = {};
        if(this.category && this.sub_category){
            payload = {
                category: this.category,
                sub_category: this.sub_category
            }
        }

        try {
            let response = await commonApi.get(`get_filters`,
                {
                    params: {
                        ...payload     
                    },
                }
            );
            console.log("filter response", response);
            if (response.data && response.data.success) {
                this.setState({ filtersBlueprint: response.data.filters, filtersLoader: false });
            } else {
                this.setState({ filtersBlueprint: productFilters, filtersLoader: false });
            }
        }
        catch (e) {
            console.log("error", e);
            this.setState({ filtersBlueprint: productFilters, filtersLoader: false });
        }
    }

    async makeGetProductsApiCall(filters) {
        this.setState({ productListLoader: true });
        let payload = {...filters};
        if(this.category && this.sub_category){
            payload = {
                category: this.category,
                sub_category: this.sub_category
            }
        }
        try {
            let response = await commonApi.post(`products`,
                {...payload}
            );
            console.log("products response", response);
            if (response.data && response.data.success) {
                this.setState({ 
                    productResults: response.data.data.products, 
                    totalCount: response.data.data.total_count, 
                    filteredCount: response.data.data.filtered_count, 
                    productListLoader: false 
                });
            } else {
                this.setState({ productResults: [], productListLoader: false });
            }
        }
        catch (e) {
            console.log("error", e);
            this.setState({ productResults: [], productListLoader: false });
        }
    }

    handleSortDropdown = (obj) =>{
        this.setState({
            sortBy: { ...obj }
        })
    }
    
    toggleDropdown = () => {
        this.setState({
            sort_dropdown_active: !this.state.sort_dropdown_active
        })
    }

    render() {
        return (
            <Fragment>
                <div className="product-page">
                    <div className="left-container">
                        <Filters 
                            {...this.props}
                            filtersLoader={this.state.filtersLoader}
                            filtersBlueprint={this.state.filtersBlueprint} 
                            store={this.props.store}
                            makeGetProductsApiCall={this.makeGetProductsApiCall.bind(this)}
                        />
                    </div>
                    <div className="right-container">
                        {
                            this.state.productListLoader 
                            ?
                                <div className="loader-container">
                                    <Spinner color="primary" size="medium" />
                                </div>
                            :
                            <Fragment>
                                <div className="results-action-container">
                                    <span>Showing <b>{this.state.filteredCount}</b> Out of <b>{this.state.totalCount}</b> Results</span>
                                        <div className={this.state.sort_dropdown_active   ? "dropdown is-right is-active" : "dropdown is-right"} 
                                            onClick={this.toggleDropdown}
                                            ref={(node) => { this.node = node }}
                                        >
                                            <div className="dropdown-trigger">
                                                <button className="button" aria-haspopup="true" aria-controls="dropdown-menu-sort">
                                                    <div className="dropdown-header">
                                                        <span className="dropdown-title">Sort by :</span>
                                                        <span className="dropdown-value">{this.state.sortBy.title}</span>
                                                    </div>
                                                    <span className="icon is-small">
                                                        <FontAwesomeIcon icon="angle-down"/>
                                                    </span>
                                                </button>
                                            </div>
                                            <div className="dropdown-menu" id="dropdown-menu-sort" role="menu">
                                                <div className="dropdown-content">
                                                    {
                                                        sortByOptions.map((sortByOption, indx)=>{
                                                            return(
                                                                <div className="dropdown-item" onClick={() => { this.handleSortDropdown(sortByOption) }}>
                                                                    {sortByOption.title}
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                </div>
                                <div className="products-list-container">
                                    <ProductsList data={this.state.productResults} {...this.props}/>
                                </div>
                                    <nav className="pagination is-centered" role="navigation" aria-label="pagination">
                                        <a className="pagination-previous">Previous</a>
                                        <a className="pagination-next">Next page</a>
                                        <ul className="pagination-list">
                                            <li><a className="pagination-link is-current" aria-label="Goto page 1" aria-current="page">1</a></li>
                                            <li><a className="pagination-link" aria-label="Goto page 1" >2</a></li>
                                            <li><a className="pagination-link" aria-label="Goto page 1" >3</a></li>
                                            <li><span className="pagination-ellipsis">&hellip;</span></li>
                                            <li><a className="pagination-link" aria-label="Goto page 86">5</a></li>
                                        </ul>
                                    </nav>
                            </Fragment>
                        }
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default observer(ProductsPage);