
class AppStore {
    filters = {};
    filtersBlueprint = [];
    productResults = [];
    filtersLoader = false;
    productListLoader = false;

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