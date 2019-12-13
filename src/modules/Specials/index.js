import React, { Fragment } from 'react';
import { observer } from 'mobx-react';
import "./style.scss";
import { getSession } from "../../utils/AuthUtils";
import commonApi from "../../apis/common";
import Spinner from "../../components/Spinner";
import { toJS } from 'mobx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SpecialProductItem from '../../SpecialProductItem';


class Specials extends React.Component {
    constructor(props) {
        super(props);
        this.category = '';
        this.sub_category = '';
        this.state = {
            products: [],
            productListLoader: true
        }
    }

    componentDidMount() {
        this.makeGetProductsApiCall({});
    }

    async makeGetProductsApiCall(filters) {
        this.setState({ productListLoader: true });
        try {
            let response = await commonApi.post(`products`,
                { 
                    category: 'bottomwear',
                    sub_category: "jeans"
                }
            );
            console.log("products response", response);
            if (response.data && response.data.success) {
                this.setState({ 
                    products: response.data.data.products, 
                    productListLoader: false 
                });
            } else {
                this.setState({ products : [], productListLoader: false });
            }
        }
        catch (e) {
            console.log("error", e);
            this.setState({ products: [], productListLoader: false });
        }
    }

    render() {
        return (
            <Fragment>
                <div className="specials-container">
                    <div className="image-container">
                        <img src="https://i.ibb.co/8gxGDMw/download.png"/>
                        <div className="title">Created with Love ❤️</div>
                    </div>
                    <div className="specials-products-container">
                    
                    {
                        this.state.productListLoader ?
                            <div className="loader-container">
                                <Spinner color="primary" size="medium" />
                            </div>
                        :
                        this.state.products.map((productObj,idx )=>{
                            return (<SpecialProductItem productData={productObj} {...this.props}/>)
                        })
                    }
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default observer(Specials);