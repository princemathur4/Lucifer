import React,{Fragment} from 'react';
import Filters from '../../components/Filters';
import ProductsList from '../../components/ProductsList';
import { observer } from 'mobx-react';
import "./style.scss";
import { products } from "../../templates/product";

class ProductsPage extends React.Component{
    constructor(props){
        super(props);

    }

    render(){
        return (
            <Fragment>
                <div className="product-page">
                    <div className="left-container">
                        <Filters/>
                    </div>
                    <div className="right-container">
                        <div className="results-action-container">
                            <span>Showing <b>{products.data.length}</b> Out of <b>25</b> Results</span>
                        </div>
                        <div className="products-list-container">
                            <ProductsList data={products.data}/>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default observer(ProductsPage);