import React, { Fragment } from 'react';
import './style.scss';
import { Link } from "react-router-dom";
import { observer } from 'mobx-react';
import ProductItem from "../ProductItem";

class ProductList extends React.Component {
    componentDidMount() {
    }
    
    render() {
        return (
            <Fragment>
                {
                    this.props.data.map((obj, idx)=>{
                        return <ProductItem key={idx} data={obj}/>
                    })
                }
            </Fragment>
        )
    }
}

export default observer(ProductList);