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
