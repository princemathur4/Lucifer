import { defaultFilterTemplate } from '../constants';

class AppStore {
    filters = {
        ...defaultFilterTemplate
    };
    filtersBlueprint = [];

    setFilters = (newFitlers) => {
        this.filters = newFitlers;
    }

    setFilterBlueprint = (filtersBlueprint) => {
        this.filtersBlueprint = filtersBlueprint;
    }
}

export default AppStore;