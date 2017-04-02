const express = require('express')
const { resolve } = require('path')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpack = require('webpack')
const webpackConfig = require('../../webpack.config.babel.js')

const app = express()

app.use(express.static(resolve(__dirname, '../../dist', 'client')))

if (process.env.NODE_ENV === 'development') {
    const compiler = webpack(webpackConfig)
    app.use(webpackDevMiddleware(compiler, {
        lazy: true,
        publicPath: '/'
    }))
}

app.get('/', (req, res) => {
    res.sendFile(resolve(__dirname, '../../dist', 'client', 'index.html'))
})

app.get('*', (req, res) => {
    res.sendFile(resolve(__dirname, '../../dist', 'client', '404.html'))
})


app.listen(3000, () => {
    console.log('Listening on port 3000!') // eslint-disable-line
})
