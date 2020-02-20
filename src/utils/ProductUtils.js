import { getSession } from './AuthUtils';
import commonApi from '../apis/common';
import { store } from "../AppStore";
import { roundOffNumber } from './utilFunctions';


let calculateTotal = () => {
    let discountedTotal = 0;
    let totalItems = 0;
    store.cartItems.forEach((productObj, idx) => {
        discountedTotal += roundOffNumber((productObj.price * productObj.count) - ((productObj.price * productObj.count) * (productObj.discount / 100)));
        totalItems += productObj.count;
    })
    return { discountedTotal, totalItems };
}

export async function fetchCartItems() {
    let self = this;
    let session = await getSession();
    if(!session){
        return;
    }
    try {
        let response = await commonApi.get(`cart`,
            {
                params: {},
                headers: { "Authorization": session.accessToken.jwtToken }
            },
        );
        console.log("util cart response", response);
        if (response.data && response.data.success) {
            store.setStoreVariable('cartItems', response.data.data);
            let { discountedTotal, totalItems } = calculateTotal()
            store.setStoreVariable('discountedTotal', discountedTotal);
            store.setStoreVariable('totalItems', totalItems);
        }
    }
    catch (e) {
        console.log("cart error", e);
    }
}