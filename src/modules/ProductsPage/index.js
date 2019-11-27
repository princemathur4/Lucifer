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
import { productFilters } from "../../constants";

class ProductsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filtersBlueprint: [],
            isLoading: false
        }
    }

    componentDidMount() {
        let category = getParameterByName('category', window.location.href);
        let sub_category = getParameterByName('sub_category', window.location.href);
        this.makeFetchFiltersApiCall(category, sub_category);
        this.makeFetchProductsApiCall(category, sub_category);

    }

    async makeFetchFiltersApiCall(category, sub_category) {
        this.setState({ isLoading: true });
        let session = await getSession();
        console.log("profile token", session.accessToken.jwtToken);
        try {
            let response = await commonApi.get(`get_filters/${category}/${sub_category}`,
                {
                    params: {},
                    headers: { Authorization: session.accessToken.jwtToken }
                }
            );
            console.log("response", response);
            if (response.data && response.data.success) {
                // this.setState({ filtersBlueprint: response.data.data, isLoading: false });
                this.setState({ filtersBlueprint: productFilters, isLoading: false });
            } else {
                this.setState({ filtersBlueprint: [], isLoading: false });
            }
        }
        catch (e) {
            console.log("error", e);
            this.setState({ filtersBlueprint: [], isLoading: false });
        }
    }

    async makeFetchProductsApiCall(category, sub_category) {
        this.setState({ isLoading: true });
        let session = await getSession();
        console.log("profile token", session.accessToken.jwtToken);
        try {
            let response = await commonApi.get(`get_filters/${category}/${sub_category}`,
                {
                    params: {},
                    headers: { Authorization: session.accessToken.jwtToken }
                }
            );
            console.log("response", response);
            if (response.data && response.data.success) {
                // this.setState({ filtersBlueprint: response.data.data, isLoading: false });
                this.setState({ filtersBlueprint: productFilters, isLoading: false });
            } else {
                this.setState({ filtersBlueprint: [], isLoading: false });
            }
        }
        catch (e) {
            console.log("error", e);
            this.setState({ filtersBlueprint: [], isLoading: false });
        }
    }

    render() {
        return (
            <Fragment>
                <div className="product-page">
                    <div className="left-container">
                        {
                            this.state.filtersBlueprint.length
                                ?
                                <Filters filtersBlueprint={this.state.filtersBlueprint}/>
                                :
                                <div className="loader-container">
                                    <Spinner color="primary" size="medium" />
                                </div>
                        }
                    </div>
                    <div className="right-container">
                        {
                            this.state.filtersBlueprint.length
                                ?
                                <Fragment>
                                    <div className="results-action-container">
                                        <span>Showing <b>{products.data.length}</b> Out of <b>25</b> Results</span>
                                    </div>
                                    <div className="products-list-container">
                                        <ProductsList data={products.data} />
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