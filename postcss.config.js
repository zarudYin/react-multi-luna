module.exports = {
    plugins: [
        // require('postcss-smart-import')({ /* ...options */ }),
        // require('precss')({ /* ...options */ }),
        require('autoprefixer')({
            browsers: [
                '>1%',
                'last 4 versions',
                'Firefox ESR',
                'not ie < 8', 
            ]
        })
    ]
}