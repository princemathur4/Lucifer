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
import { subCategories } from "../../constants";
import { toJS } from 'mobx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fetchCartItems } from '../../utils/ProductUtils';
import { titleCase } from '../../utils/utilFunctions';


class ProductsPage extends React.Component {
    constructor(props) {
        super(props);
        this.category = 'bottomwear';
        this.sub_category = '';
        this.pageSize = 12;
        this.filters = {};
        this.lastOrderby = '';
        this.lastPaginationValue = '';
        this.state = {
            filtersBlueprint: [],
            filtersLoader: true,
            productResults: [],
            totalCount: 0,
            pageCount: 0,
            productListLoader: true,
            isSideFilterOpen: false,
            currentPage: 1,
            totalPages: 0,
            orderby: { 
                ...sortByOptions[0]
            },
            sort_dropdown_active: false
        }
        this.node = null;
    }

    componentDidMount() {
        console.log(this.props.location);
        this.sub_category = this.props.match.params.hasOwnProperty('subCategory') ? this.props.match.params.subCategory : null;
        if (!subCategories.includes(this.sub_category)){
            this.props.history.push("/not-found");
            return;
        }
        this.category = this.props.match.params.subCategory == 'shirts' ? 'topwear': 'bottomwear';
        fetchCartItems();
        this.makeFetchFiltersApiCall();
        this.makeGetProductsApiCall();
        document.addEventListener('mousedown', this.handleClickOutside, false)
    }
    
    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside, false)
    }
    
    componentDidUpdate(prevProps, prevState){
        let prevSubCategory = prevProps.match.params.hasOwnProperty('subCategory') ? prevProps.match.params.subCategory : null;
        this.sub_category = this.props.match.params.hasOwnProperty('subCategory') ? this.props.match.params.subCategory : null;
        this.category = this.sub_category == 'shirts' ? 'topwear': 'bottomwear';
        if(prevSubCategory !== this.sub_category){
            this.makeFetchFiltersApiCall();
            this.makeGetProductsApiCall();
        }
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
                this.setState({ filtersBlueprint: [], filtersLoader: false });
            }
        } catch (e) {
            console.log("error", e);
            this.setState({ filtersBlueprint: [], filtersLoader: false });
        }
    }

    async makeGetProductsApiCall() {
        this.setState({ productListLoader: true, isSideFilterOpen: false });
        let payload = { 
            ...this.filters, 
            category: this.category, 
            sub_category: this.sub_category,
        }
        
        try {
            let response = await commonApi.post(
                `products?pg=${this.props.store.currentPage}&r=${this.pageSize}&orderby=${this.props.store.orderby.value}`,
                {...payload}
            );
            console.log("products response", response);
            if (response.data && response.data.success) {
                let totalPages = Math.ceil(response.data.data.filtered_count / this.pageSize); 
                this.setState({ 
                    productResults: response.data.data.products, 
                    totalCount: response.data.data.filtered_count, 
                    totalPages,
                    pageCount: response.data.data.products.length,
                    productListLoader: false 
                });
                this.lastOrderby = "";
                this.lastPaginationValue = "";
            } else {
                this.callOnGetProductsError();
            }
        } catch (e) {
            console.log("error", e);
            this.callOnGetProductsError();
            // this.setState({ productResults: products, totalCount: 50, totalPages: Math.ceil(50 / 20), productListLoader: false });
        }
    }

    callOnGetProductsError = () => { 
        if(this.lastOrderby){
            // this.setState({ orderby: this.lastOrderby });
            this.props.store.orderby = this.lastOrderby;
            this.lastOrderby = "";
        }
        if(this.lastPaginationValue){
            // this.setState({ currentPage: this.lastPaginationValue });
            this.props.store.currentPage = this.lastPaginationValue;
            this.lastPaginationValue = "";
        }
        this.setState({ 
            productResults: [], productListLoader: false,
        });
    }

    handlePagination = (mode, value) => {
        this.lastPaginationValue = this.props.store.currentPage;
        if(mode === "byValue"){
            // this.setState({ currentPage: value });
            this.props.store.currentPage = value;
        } else {
            // this.setState({ currentPage: this.state.currentPage + value })
            this.props.store.currentPage = this.props.store.currentPage + value;
        }
        this.makeGetProductsApiCall();
    }

    getPaginationJsx = () => {
        let pageArray = []
        for(let i=1; i<=this.state.totalPages; i++){
            pageArray.push(i);
        }
        return (
            <nav className="pagination is-centered" role="navigation" aria-label="pagination">
                <button 
                    className="button pagination-previous" 
                    disabled={this.props.store.currentPage === 1}
                    onClick={()=>{this.handlePagination('decrement', -1)}}
                >Previous</button>
                <button 
                    className="button pagination-next" 
                    disabled={this.props.store.currentPage === this.state.totalPages}
                    onClick={()=>{this.handlePagination('increment', +1)}}
                >Next</button>
                <ul className="pagination-list">
                    {
                        pageArray.map((pageNum)=>{
                            return (
                                <li>
                                    <button className={this.props.store.currentPage === pageNum? "button pagination-link is-current": "button pagination-link"} 
                                        aria-label={`Goto page ${pageNum}`} 
                                        aria-current={this.props.store.currentPage === pageNum ? "page": false}
                                        onClick={()=>{this.handlePagination('byValue', pageNum)}}
                                    >{pageNum}</button>
                                </li>
                            )
                        })
                    }
                    {/* {
                        this.state.totalPages > 4 && this.state.currentPage !== this.state.totalPages
                        <li><span className="pagination-ellipsis">&hellip;</span></li>
                        <li><a className="pagination-link" aria-label="Goto page 86">{}</a></li>
                    } */}
                </ul>
            </nav>
        )
    }

    handleFiltersChange = (filters) =>{
        this.filters = filters;
        this.makeGetProductsApiCall();
    }

    handleSortDropdown = (obj) =>{
        this.lastOrderby = this.props.store.orderby;
        // this.setState({
        //     orderby: { ...obj }
        // })
        this.props.store.orderby = {...obj};
        this.makeGetProductsApiCall();
    }
    
    toggleDropdown = () => {
        this.setState({
            sort_dropdown_active: !this.state.sort_dropdown_active
        })
    }

    handleFiltersToggle = () => {
        this.setState({ isSideFilterOpen: !this.state.isSideFilterOpen });
    }

    render() {
        let adminuser = this.props.auth.user && 
            this.props.auth.user.signInUserSession.accessToken.hasOwnProperty("payload") && 
            this.props.auth.user.signInUserSession.accessToken.payload.hasOwnProperty("cognito:groups") && 
            this.props.auth.user.signInUserSession.accessToken.payload["cognito:groups"].length && 
            this.props.auth.user.signInUserSession.accessToken.payload["cognito:groups"].includes("labroz_admin");
        return (
            <Fragment>
                <div className="product-page">
                    {
                        this.state.filtersLoader ?
                        <div className="loader-container">
                            <Spinner color="primary" size="medium" />
                        </div>
                        :
                        (
                            !this.state.filtersBlueprint.length ?
                            <div className="no-products-data">
                                No products available at the moment
                            </div>
                            :
                            <Fragment>
                                <div className="left-container">
                                    <Filters 
                                        {...this.props}
                                        filtersBlueprint={this.state.filtersBlueprint} 
                                        store={this.props.store}
                                        handleFiltersChange={this.handleFiltersChange.bind(this)}
                                    />
                                </div>
                                <div className={this.state.isSideFilterOpen ? "side-filter-nav is-active": "side-filter-nav"}>
                                    <Filters 
                                        {...this.props}
                                        filtersBlueprint={this.state.filtersBlueprint} 
                                        store={this.props.store}
                                        handleFiltersChange={this.handleFiltersChange.bind(this)}
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
                                            <button 
                                                className={this.state.isSideFilterOpen ? 
                                                    "button is-fullwidth is-link filter-toggle-btn hide-cls":
                                                    "button is-fullwidth is-link filter-toggle-btn show-cls"
                                                }
                                                onClick={this.handleFiltersToggle}
                                            >
                                                {this.state.isSideFilterOpen ? "Hide Filters": "Show Filters"}
                                            </button>
                                            <div className="results-action-container">
                                                {/* <span>Men {titleCase(this.sub_category)}</span> */}
                                                <span>Showing <b>{this.state.pageCount}</b> Out of <b>{this.state.totalCount}</b> Results</span>
                                                <div className={this.state.sort_dropdown_active ? "dropdown is-right is-active" : "dropdown is-right"} 
                                                    onClick={this.toggleDropdown}
                                                    ref={(node) => { this.node = node }}
                                                >
                                                    <div className="dropdown-trigger">
                                                        <button className="button" aria-haspopup="true" aria-controls="dropdown-menu-sort">
                                                            <div className="dropdown-header">
                                                                <span className="dropdown-title">Sort by :</span>
                                                                {/* <span className="dropdown-value">{this.state.orderby.title}</span> */}
                                                                <span className="dropdown-value">{this.props.store.orderby.title}</span>
                                                            </div>
                                                            <span className="icon is-small">
                                                                <FontAwesomeIcon icon="angle-down"/>
                                                            </span>
                                                        </button>
                                                    </div>
                                                    <div className="dropdown-menu" id="dropdown-menu-sort" role="menu">
                                                        <div className="dropdown-content">
                                                            {
                                                                sortByOptions.map((sortByOption, indx) => {
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
                                                <ProductsList data={this.state.productResults} {...this.props} />
                                            </div>
                                            {
                                                this.getPaginationJsx()
                                            }
                                                
                                        </Fragment>
                                    }
                                </div>
                            </Fragment>
                        )
                    }
                </div>
            </Fragment>
        )
    }
}

export default observer(ProductsPage);