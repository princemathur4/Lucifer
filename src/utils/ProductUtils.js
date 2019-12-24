import { getSession } from './AuthUtils';
import commonApi from '../apis/common';
import { store } from "../App";

export async function fetchCartItems() {
    let self = this;
    let session = await getSession();
    try {
        let response = await commonApi.get(`cart`,
            {
                params: {},
                headers: { "Authorization": session.accessToken.jwtToken }
            },
        );
        console.log("get cart response", response);
        if (response.data && response.data.success) {
            // this.props.store.setCartItemsCount(response.data.data.length);
            store.cartItemCount = response.data.data.length;
        }
    }
    catch (e) {
        console.log("cart error", e);
    }
}