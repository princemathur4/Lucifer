# Lucifer - E-commerce Web Application for Clothing

Lucifer is an e-commerce frontend application designed to offer a smooth online shopping experience for clothing. Built with JavaScript and SCSS, it includes features like product filtering, user authentication with AWS, and secure payments through Razorpay.

## Table of Contents

1. [Features](#features)
2. [Technologies](#technologies)
3. [Setup Instructions](#setup-instructions)
4. [Usage](#usage)
5. [Project Structure](#project-structure)
6. [Future Improvements](#future-improvements)

## Features

- **User Authentication**: Allows users to sign up, log in, and manage accounts via AWS authentication.
- **Product Filtering**: Enables filtering of products based on size, color, and price.
- **Payment Integration**: Secure online payments powered by Razorpay.
- **Responsive Design**: Ensures mobile-friendly access across different devices.
- **Modern User Interface**: Built with SCSS and JavaScript, creating an interactive, visually appealing user experience.

## Technologies

- **Frontend**: React, MobX (for global state management)
- **Styling**: Bulma CSS Framework, Google font library, font-awesome icons
- **Authentication**: AWS cognito via Amplify SDK
- **Payment Gateway**: Razorpay

## Setup Instructions
To set up and run this project locally:

### Prerequisites
- Git
- Node v.14

### Installation

1.  **Clone the repository**:
    
    ```
    git clone https://github.com/princemathur4/Lucifer.git
    cd Lucifer
    ```
    
2.  **Install Dependencies**:
    ```
    npm install
    ```
    
3.  **Configure Environment Variables**:
    
    Create a `.env` file in the root directory and add the following:
    
    ```
    AWS_ACCESS_KEY=<your-aws-access-key>
    AWS_SECRET_KEY=<your-aws-secret-key>
    RAZORPAY_API_KEY=<your-razorpay-api-key>
    RAZORPAY_SECRET_KEY=<your-razorpay-secret-key>
    ```
    
4.  **Run the Application**:
    ```
    npm run dev
    ```

## Usage

*   **User Registration and Login**: Users can create an account or log in through the authentication page.
*   **Product Browsing and Filtering**: Users can view and filter products by size, color, and price.
*   **Checkout and Payment**: Add items to the cart and proceed to payment through Razorpay.

## Project Structure

```
Lucifer/
|   .babelrc               # Babel configuration for JavaScript transpiling
|   .gitignore             # Git ignore file to exclude unnecessary files
|   netlify.toml           # Configuration file for Netlify deployment
|   package-lock.json      # Auto-generated file for npm dependencies
|   package.json           # Project dependencies and scripts
|   README.md              # Project documentation
|   server.js              # Backend server setup
|   webpack.*.js           # Webpack configuration files for different environments
|
+---config/                # Environment-specific configuration files
|   +---development/       # Development environment settings
|   +---production/        # Production environment settings
|   \---staging/           # Staging environment settings
|
+---dist/                  # Compiled and minified production files
|   favicon.ico            # Site favicon
|   index.html             # Main HTML file for production
|   main.*.js, main.*.css  # Bundled JavaScript and CSS files
|
+---public/                # Public assets accessible to the client
|   favicon.ico            # Site favicon for the client
|   index.html             # Main HTML template for the app
|   
+---src/                   # Main source code for the web application
|   App.js                 # Root React component
|   App.scss               # Global app styles
|   index.js               # App entry point
|   |   
|   +---apis/              # API utilities for making network requests
|   +---AppStore/          # Centralized store for managing app state
|   +---base/              # Base configuration and reusable styles
|   |   imports.js         # Base imports for components
|   |   +---styles/        # SCSS styles for theme consistency
|   |
|   +---components/        # Reusable UI components (Address, CartItem, NavBar, etc.)
|   |       Address/       # Component for user address input
|   |       CartItem/      # Component for items in the shopping cart
|   |       NavBar/        # Main navigation bar component
|   |
|   +---constants/         # Constants for routes, API endpoints, etc.
|   |
|   +---imports/           # Organized imports for cleaner component files
|   |
|   +---modules/           # Major feature modules (Cart, Login, Signup, etc.)
|   |       AboutUs/       # About Us page module
|   |       Cart/          # Shopping cart page module
|   |       ProductsPage/  # Product listing page module
|   | 
|   +---templates/         # Template files for dynamic rendering
|   |   product.js         # Product page template
|   |
|   +---utils/             # Utility functions and helper files
|       AuthUtils.js       # Authentication utilities
|       ProductUtils.js    # Utilities for product management
|       utilFunctions.js   # General-purpose utility functions

```

## Future Improvements

*   **Enhanced Product Filtering**: Add additional filters for brand, material, etc.
*   **Product Reviews and Ratings**: Allow users to leave feedback on products.
*   **Order History**: Enable users to view their past orders and track orders.
*   **Wishlist Feature**: Allow users to save products for later.
