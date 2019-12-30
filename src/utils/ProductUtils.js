import { getSession } from './AuthUtils';
import commonApi from '../apis/common';
import { store } from "../AppStore";

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
            store.setCartItems(response.data.data);
        }
    }
    catch (e) {
        console.log("cart error", e);
    }
}