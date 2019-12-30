
import { sortByOptions } from "../templates/product";
import { decorate, observable, action, computed } from 'mobx';

class AppStore {
    redirectRoute = "";
    filters = {};
    filtersBlueprint = [];
    productResults = [];
    filtersLoader = true;
    productListLoader = true;
    orderby = { ...sortByOptions[0] };
    currentPage = 1;
    totalPages = 0;
    cartItems = [];
    
    setCartItems = (items) =>{
        this.cartItems = items;
    }

    setRedirectRoute = (route) => {
        this.redirectRoute = route;
    }
    
    setFilters = (newFilters) => {
        this.filters = newFilters;
    }

    setFilterBlueprint = (filtersBlueprint) => {
        this.filtersBlueprint = filtersBlueprint;
    }

    setProductResults = (productResults) => {
        this.productResults = productResults;
    }

    setFiltersLoader = (setValue) => {
        this.filtersLoader = setValue;
    }
    
    setProductListLoader = (setValue) => {
        this.productListLoader = setValue;
    }
}

decorate(
    AppStore, {
        filters: observable,
        filtersBlueprint: observable,
        productResults: observable,
        filtersLoader: observable,
        productListLoader: observable,
        orderby : observable,
        currentPage : observable,
        totalPages : observable,
        cartItems: observable,
        setCartItems: action,
        setFilters: action,
        setFilterBlueprint: action,
        setProductResults: action,
        setFiltersLoader: action,
        setProductListLoader: action
    }
)

export const store = new AppStore();