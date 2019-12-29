
import { sortByOptions } from "../templates/product";

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

export default AppStore;