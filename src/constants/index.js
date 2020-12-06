export const subCategories = ["jeans", "chinos", "shirts"]
export const categoryOptions = [
    { key: 'bottomwear', value: 'bottomwear', text: 'Bottomwear' },
    { key: 'topwear', value: 'topwear', text: 'Topwear' }
]

export const subCategoryOptions = {
    bottomwear: [
        { key: 'jeans', value: 'jeans', text: 'Jeans' },
        { key: 'chinos', value: 'chinos', text: 'Chinos' },
    ],
    topwear: [{ key: 'shirts', value: 'shirts', text: 'Shirts' }],
}

export const orderResponse = {
    "data":{ 
        "_id":"6c8f9af34b494dbc8a98f9e6739e47de",
        "address":{ 
           "_id":"5e069c498e1fe7277f642d97",
           "address":"Flat No. 804,Rattan Jyoti Apartments, Sector-4,Vaishali",
           "address_type":"home",
           "city":"Ghaziabad ",
           "country":"India",
           "mobile":"09971936873",
           "name":"Prince Mathur",
           "pincode":"201010",
           "state":"Uttar Pradesh"
        },
        "created_at":1577563547861,
        "order_data":[ 
           { 
              "count":1,
              "discount":0,
              "effective_price":1000.0,
              "price":1000,
              "product_id":"bottomwear_chinos_1576676305626_30",
              "product_image":null,
              "size":30,
              "stock":100,
              "total_price":1000
           }
        ],
        "order_status":"CONFIRMED",
        "payment_mode":"COD",
        "payment_status":"PENDING",
        "total_price":1000.0,
        "username":"e6f76894-7df3-4d45-a19f-1f065e0af029"
     },
     "message":"Order verified.",
     "success":true
} 

export const productFilters = [
    {
        "filter_name": "color",
        "filter_type": "multiSelect",
        "values": [
            {
                "key": "black",
                "title": "Black",
                "hex": "#000000"
            },
            {
                "key": "blue",
                "title": "Blue",
                "hex": " #0000ff"
            },
            {
                "key": "grey",
                "title": "Grey",
                "hex": "#808080"
            },
        ]
    },
    {
        "filter_name": "fit",
        "filter_type": "multiSelect",
        "values": [
            {
                "key": "regular_fit",
                "title": "Regular Fit"
            },
            {
                "key": "slim_fit",
                "title": "Slim Fit"
            }
        ]
    },
    {
        "filter_name": "size",
        "filter_type": "singleSelect",
        "values": [
            {
                "key": 30,
                "title": "30"
            },
            {
                "key": 32,
                "title": "32"
            },
            {
                "key": 36,
                "title": "36"
            },
            {
                "key": 38,
                "title": "38"
            }
        ]
    },
    {
        "filter_name": "fabric",
        "filter_type": "multiSelect",
        "values": [
            {
                "key": "cotton",
                "title": "Cotton"
            }
        ]
    },
    {
        "filter_name": "price",
        "filter_type": "range",
        "min": 700,
        "max": 7000
    },
    {
        "filter_name": "discount",
        "filter_type": "multiSelect",
        "values": [
            {
                "key": "0",
                "title": "0%"
            },
            {
                "key": "10",
                "title": "10%"
            },
            {
                "key": "50",
                "title": "50%"
            }
        ]
    },
]

export const addresses = [
    {
        name: "Sherlock Holmes",
        address: "221-B, Baker Street",
        city: "London",
        state: "England",
        country: "United Kingdom",
        address_type: "home",
        pincode: 201010,
        mobile: 9971936873
    },
    {
        name: "Sherlock Holmes",
        address: "221-B, Baker Street",
        city: "London",
        state: "England",
        country: "United Kingdom",
        address_type: "home",
        pincode: 201010,
        mobile: 9971936873
    },
]

export const addressEditableFields = [
    {
        title: 'Name',
        name: 'name',
        type: 'text',
    },
    {
        title: 'Address',
        name: 'address',
        type: 'text',
    },
    {
        title: 'City',
        name: 'city',
        type: 'text',
    },
    {
        title: 'State',
        name: 'state',
        type: 'text',
    },
    {
        title: 'Country',
        name: 'country',
        type: 'text',
    },
    {
        title: 'Pincode',
        name: 'pincode',
        type: 'text',
    },
    {
        title: 'Mobile Number',
        name: 'mobile',
        type: 'text',
    },
    {
        title: 'Address Type',
        name: 'address_type',
        type: 'radio',
        options: [{ value: "home", title: "Home" }, { value: "office", title: "Office" }],
    },
    // {
    //     title: 'Make this the default address',
    //     name: 'default',
    //     type: 'radio',
    //     options: [{ value: "yes", title: "Yes" }, { value: "no", title: "No" }],
    // },
]

export const products = [
    {
        _id: "bottomwear_jeans_1574876982_grey_34",
        images: ["https://i.ibb.co/48hHjC8/Plum-01-900x.png"],
        available_sizes: [
            34,
            32
        ],
        category: "bottomwear",
        color: "grey",
        color_code: "#0000FF",
        description: "Some Description",
        discount: 10,
        fabric: "cotton",
        fit: "regular_fit",
        price: 700,
        product_code: "bottomwear_jeans_1574876982",
        product_id: "bottomwear_jeans_1574876982_grey",
        size: 34,
        stock: 100,
        sub_category: "jeans",
        variants:{
            34: { stock: 2},
            32: { stock: 3}
        }
    },
    {
        _id: "bottomwear_jeans_1574876982_grey_34",
        images: ["https://i.ibb.co/48hHjC8/Plum-01-900x.png"],
        available_sizes: [
            34,
            32
        ],
        category: "bottomwear",
        color: "grey",
        color_code: "#0000FF",
        description: "Some Description",
        discount: 10,
        fabric: "cotton",
        fit: "regular_fit",
        price: 700,
        product_code: "bottomwear_jeans_1574876982",
        product_id: "bottomwear_jeans_1574876982_grey",
        size: 34,
        stock: 100,
        sub_category: "jeans",
        variants:{
            34: { stock: 2},
            32: { stock: 3}
        }
    },
    {
        _id: "bottomwear_jeans_1574876982_grey_34",
        images: ["https://i.ibb.co/48hHjC8/Plum-01-900x.png"],
        available_sizes: [
            34,
            32
        ],
        category: "bottomwear",
        color: "grey",
        color_code: "#0000FF",
        description: "Some Description",
        discount: 10,
        fabric: "cotton",
        fit: "regular_fit",
        price: 700,
        product_code: "bottomwear_jeans_1574876982",
        product_id: "bottomwear_jeans_1574876982_grey",
        size: 34,
        stock: 100,
        sub_category: "jeans",
        variants:{
            34: { stock: 2},
            32: { stock: 3}
        }
    },
]
export const myAccountTabs = {
    "Profile": [
        {
            title: "Personal Info",
            name: "profile",
            url: "/profile"
        },
        {
            title: "Your Addresses",
            name: "addresses",
            url: "/addresses"
        },
    ],
    "Security": [
        {
            title: "Passwords",
            name: "passwords",
            url: "/passwords"
        },
    ],
    "Orders & Returns": [
        {
            title: "Orders",
            name: "orders",
            url: "/orders"
        },
    ]
}

export const profileEditableFields = [
    {
        title: 'Name',
        name: 'name',
        type: 'text',
        editable: false
    },
    {
        title: 'Phone Number',
        name: 'phone',
        type: 'text',
        editable: false
    },
    {
        title: 'Email-ID',
        name: 'email',
        type: 'text',
        editable: true
    },
    {
        title: 'Gender',
        name: 'gender',
        type: 'radio',
        options: [{ value: "male", title: "Male" }, { value: "female", title: "Female" }],
        editable: true
    },
]
