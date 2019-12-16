module.exports = {
    context: __dirname,
    entry: ["babel-polyfill",'./src/index.js'],
    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: /node_module/,
                use: 'babel-loader'
            },
            {
                test: /\.scss$/,
                use: [
                    "style-loader", //3. Inject styles into DOM
                    "css-loader", //2. Turns css into commonjs
                    "sass-loader" //1. Turns sass into css
                ]
            },
            {
                test: /\.css?$/,
                use: [ 'style-loader', 'css-loader', 'sass-loader' ]
            },
            {
                test: /\.(png|j?g|svg|gif)?$/,
                use: 'file-loader'
            },
        ]
    },
};