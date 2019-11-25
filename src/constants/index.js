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
