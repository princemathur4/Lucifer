import Home from '../modules/Home';
import ProductsPage from '../modules/ProductsPage';
import Product from '../modules/Product';
import Cart from '../modules/Cart';
import MyAccount from '../modules/MyAccount';
import MainLoginPage from "../components/MainLoginPage";
import Specials from "../modules/Specials";
import ComingSoonPage from '../modules/ComingSoonPage';
import Latest from '../modules/Latest';
import AboutUs from '../modules/AboutUs';
import ShippingPolicy from '../modules/ShippingPolicy';
import ReturnExchangePolicy from '../modules/ReturnExchangePolicy';
import TermsAndConditions from '../modules/TermsAndConditions';
import PrivacyPolicy from '../modules/PrivacyPolicy';
import { store } from '../AppStore';
import AddProduct from '../modules/AddProduct';
import UpdateOrders from '../modules/UpdateOrders';


export const routes = [
    {
        path: "/",
        component: MainLoginPage,
        name: "mainPage",
        authRequired: false,
        customProps: {
            name: "mainPage",
        }
    },
    {
        path: "/home",
        component: Home,
        name: "home",
        authRequired: false,
        customProps: {
            name: "home",
            store
        }
    },
    {
        path: "/login",
        component: MainLoginPage,
        name: "login",
        authRequired: false,
        customProps: {
            authComponent: true,
            name: "login",
            title: "Login",
            store
        }
    },
    {
        path: "/signup",
        component: MainLoginPage,
        name: "signUp",
        authRequired: false,
        customProps: {
            authComponent: true,
            name: "signUp",
            title: "Sign Up",
            store
        }
    },
    {
        path: '/forgot_password',
        component: MainLoginPage,
        name: 'forgotPassword',
        authRequired: false,
        customProps: {
            authComponent: true,
            title: 'Request new password',
            name: 'forgotPassword',
            store
        }
    },
    {
        path: '/resend_verification_code',
        component: MainLoginPage,
        name: 'resendVerificationCode',
        authRequired: false,
        customProps: {
            authComponent: true,
            title: 'Resend Verification Code',
            name: 'resendVerificationCode',
            store
        }
    },
    {
        path: "/specials",
        component: Specials,
        name: "specials",
        authRequired: false,
        customProps: {
            name: "specials",
            store
        }
    },
    {
        path: "/latest",
        component: Latest,
        name: "latest",
        authRequired: false,
        customProps: {
            name: "latest",
            store
        }
    },
    {
        path: "/blog",
        component: ComingSoonPage,
        name: "blog",
        authRequired: true,
        customProps: {
            name: "blog",
            store
        }
    },
    {
        path: "/myaccount",
        component: MyAccount,
        name: "myAccount",
        authRequired: true,
        customProps: {
            name: "profile",
            store
        }
    },
    {
        path: "/profile",
        component: MyAccount,
        name: "profile",
        authRequired: true,
        customProps: {
            name: "profile",
            store
        }
    },
    {
        path: "/addresses",
        component: MyAccount,
        name: "addresses",
        authRequired: true,
        customProps: {
            name: "addresses",
            store
        }
    },
    {
        path: "/passwords",
        component: MyAccount,
        name: "passwords",
        authRequired: true,
        customProps: {
            name: "passwords",
            store
        }
    },
    {
        path: "/orders",
        component: MyAccount,
        name: "orders",
        authRequired: true,
        customProps: {
            name: "orders",
            store
        }
    },
    {
        path: "/products",
        component: ProductsPage,
        name: "products",
        authRequired: false,
        customProps: {
            name: "products",
            store
        }
    },
    {
        path: "/product",
        component: Product,
        name: "product",
        authRequired: false,
        customProps: {
            name: "product",
            store
        }
    },
    {
        path: "/cart",
        component: Cart,
        name: "cart",
        authRequired: true,
        customProps: {
            name: "cart",
            store
        }
    },
    {
        path: "/about_us",
        component: AboutUs,
        name: "aboutUs",
        authRequired: false,
        customProps: {
            name: "aboutUs",
            store
        }
    },
    {
        path: "/shipping_policy",
        component: ShippingPolicy,
        name: "shippingPolicy",
        authRequired: false,
        customProps: {
            name: "shippingPolicy",
            store
        }
    },
    {
        path: "/return_exchange_policy",
        component: ReturnExchangePolicy,
        name: "returnExchangePolicy",
        authRequired: false,
        customProps: {
            name: "returnExchangePolicy",
            store
        }
    },
    {
        path: "/privacy_policy",
        component: PrivacyPolicy,
        name: "privacyPolicy",
        authRequired: false,
        customProps: {
            name: "privacyPolicy",
            store
        }
    },
    {
        path: "/terms_and_conditions",
        component: TermsAndConditions,
        name: "termsAndConditions",
        authRequired: false,
        customProps: {
            name: "termsAndConditions",
            store
        }
    },
    {
        path: "/add_products",
        component: AddProduct,
        name: "addProducts",
        authRequired: true,
        customProps: {
            name: "addProducts",
            store
        }
    },
    {
        path: "/update_orders",
        component: UpdateOrders,
        name: "updateOrders",
        authRequired: true,
        customProps: {
            name: "updateOrders",
            store
        }
    },
];
