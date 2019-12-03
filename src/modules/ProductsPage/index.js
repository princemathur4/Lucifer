import React, { Fragment } from 'react';
import Filters from '../../components/Filters';
import ProductsList from '../../components/ProductsList';
import { observer } from 'mobx-react';
import "./style.scss";
import { products } from "../../templates/product";
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
        this.state = {
            filtersBlueprint: [],
            isLoading: false,
            sort_by: 'Relevance',
            sort_dropdown_active: false
        }
    }

    componentDidMount() {
        let category = getParameterByName('category', window.location.href);
        let sub_category = getParameterByName('sub_category', window.location.href);
        this.makeFetchFiltersApiCall(category, sub_category);
        this.makeGetProductsApiCall(category, sub_category);
        document.addEventListener('mousedown', this.handleClickOutside, false)
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside, false)
    }

    handleClickOutside = (e) => {
        if (this.node.contains(e.target)) {
            return;
        }
        this.setState({ sort_dropdown_active: false });
    };

    async makeFetchFiltersApiCall(category, sub_category) {
        console.log("productFilters", productFilters)
        this.props.store.setProductListLoader(true);
        this.props.store.setFiltersLoader(true);
        // let session = await getSession();
        // console.log("profile token", session.accessToken.jwtToken);
        try {
            let response = await commonApi.get(`get_filters`,
                {
                    params: {
                        category,
                        sub_category
                    },
                    // headers: { Authorization: session.accessToken.jwtToken }
                }
            );
            console.log("response", response);
            if (response.data && response.data.success) {
                // this.setState({ filtersBlueprint: response.data.filters, isLoading: false });
                // this.setState({ filtersBlueprint: productFilters, isLoading: false });
                this.props.store.setFilterBlueprint(response.data.filters);
            } else {
                this.props.store.setFilterBlueprint(productFilters);
                // this.setState({ filtersBlueprint: productFilters,isLoading: false });
            }
            this.props.store.setFiltersLoader(false);
        }
        catch (e) {
            console.log("error", e);
            this.props.store.setFilterBlueprint(productFilters);
            this.props.store.setFiltersLoader(false);
            // this.setState({ filtersBlueprint: productFilters , isLoading: false });
        }
    }

    async makeGetProductsApiCall(category, sub_category) {
        console.log("productFilters", productFilters)
        this.props.store.setProductListLoader(true);
        try {
            let response = await commonApi.post(`products`,
                {
                    category, 
                    sub_category 
                }
            );
            console.log("response", response);
            if (response.data && response.data.success) {
                this.props.store.setProductResults(response.data.data);
            } else {
                this.props.store.setProductResults([]);
            }
            this.props.store.setProductListLoader(false);
        }
        catch (e) {
            console.log("error", e);
            this.props.store.setProductResults([]);
            this.props.store.setProductListLoader(false);
        }
    }


    handleSortDropdown = (value) =>{
        this.setState({
            sort_by: value
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
                        {
                            toJS(this.props.store.filtersBlueprint).length
                                ?
                                <Filters 
                                // filtersBlueprint={this.state.filtersBlueprint} 
                                store={this.props.store}/>
                                :
                                <div className="loader-container">
                                    <Spinner color="primary" size="medium" />
                                </div>
                        }
                    </div>
                    <div className="right-container">
                        {
                            toJS(this.props.store.filtersBlueprint).length
                            ?
                            <Fragment>
                                <div className="results-action-container">
                                    <span>Showing <b>{products.data.length}</b> Out of <b>25</b> Results</span>
                                        <div className={this.state.sort_dropdown_active ? "dropdown is-right is-active" : "dropdown is-right"} 
                                            onClick={this.toggleDropdown}
                                            ref={(node) => { this.node = node }}
                                        >
                                            <div className="dropdown-trigger">
                                                <button className="button" aria-haspopup="true" aria-controls="dropdown-menu-sort">
                                                    <div className="dropdown-header">
                                                        <span className="dropdown-title">Sort by :</span>
                                                        <span className="dropdown-value">{this.state.sort_by}</span>
                                                    </div>
                                                    <span className="icon is-small">
                                                        <FontAwesomeIcon icon="angle-down"/>
                                                    </span>
                                                </button>
                                            </div>
                                            <div className="dropdown-menu" id="dropdown-menu-sort" role="menu">
                                                <div className="dropdown-content">
                                                    <div className="dropdown-item" onClick={() => { this.handleSortDropdown('popularity') }}>
                                                        Popularity
                                                    </div>
                                                    <div className="dropdown-item" onClick={() =>{ this.handleSortDropdown('price') }}>
                                                        Price: High to Low
                                                    </div>
                                                    <div className="dropdown-item" onClick={() =>{ this.handleSortDropdown('price') }}>
                                                        Price: Low to High
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                </div>
                                <div className="products-list-container">
                                    <ProductsList data={products.data} store={this.props.store}/>
                                </div>
                            </Fragment>
                            :
                            <div className="loader-container">
                                <Spinner color="primary" size="medium" />
                            </div>
                        }
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default observer(ProductsPage);