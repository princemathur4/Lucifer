
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
    discountedTotal = 0;
    totalItems = 0;
    
    setStoreVariable = (name, value) => {
        this[name] = value; 
    }

    setRedirectRoute = (route) => {
        this.redirectRoute = route;
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
        totalItems: observable,
        discountedTotal: observable,
        setStoreVariable: action,
    }
)

export const store = new AppStore();