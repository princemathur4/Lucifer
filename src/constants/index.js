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
        "filter_type": "multiSelect",
        "values": [
            {
                "key": "30",
                "title": "30"
            },
            {
                "key": "32",
                "title": "32"
            },
            {
                "key": "36",
                "title": "36"
            },
            {
                "key": "38",
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

export const myAccountTabs = {
    "Profile and Security": [
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
        title: 'Email-ID',
        name: 'email',
        type: 'text',
        editable: false
    },
    {
        title: 'Phone Number',
        name: 'phone',
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
