const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require("copy-webpack-plugin")


const isLocal = process.env.NODE_ENV === 'local'

const commonCssLoader = [
  isLocal ? 'style-loader' : MiniCssExtractPlugin.loader,
  'css-loader',
  {
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        plugins: [
          [
            // 需要在package.json中定义browserslist  
            "postcss-preset-env",
            {
              // 其他选项
              ident: 'postcss',
            },
          ],
        ]
      }
    }
  }
]

const rules = [
  {
    test: /\.(tsx?|jsx?)$/,
    use: [
      // 启用进程大概需要600ms，进程通信也有开销
      'thread-loader',
      'babel-loader'
    ],
    exclude: '/node_modules/'
  },
  {
    test: /\.less$/,
    use: [
      ...commonCssLoader,
      'less-loader'
    ],
    exclude: '/node_modules/'
  },
  {
    test: /\.css$/,
    use: commonCssLoader,
    exclude: '/node_modules/'
  },
  {
    test: /\.(png|svg|jpg|gif|jpeg|cur)$/,
    use: {
      loader: 'url-loader',
      options: {
        limit: 8 * 1024,
        name: '[contenthash:8].[ext]',
        outputPath: 'imgs'
      }
    },
    exclude: '/node_modules/'
  },
  {
    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
    use: {
      loader: "file-loader",
      options: {
        name: '[contenthash:8].[ext]',
        outputPath: 'fonts'
      }
    },
    exclude: '/node_modules/'
  }
]

module.exports = {
  target: isLocal ? 'web' : ['web', 'es3'],
  cache: {
    type: isLocal ? 'memory' : 'filesystem',
  },
  entry: './src/main.tsx',
  output: {
    clean: true,
    filename: isLocal ? 'js/[name].js' : 'js/[name].[contenthash:8].js',
    chunkFilename: isLocal ? 'js/[name].js' : 'js/[name].[contenthash:8].js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/'
  },
  resolve: {
    alias: {
      $: path.resolve(__dirname, '../src'),
      $static: path.resolve(__dirname, "../static"),
    },
    extensions: ['.ts', '.tsx', '.js'],
    modules: [path.resolve(__dirname, '../node_modules'), 'node_modules'],
  },
  module: {
    rules: [
      {
        oneOf: rules
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      // template: path.resolve(__dirname, '../src/index.html'),
      favicon: path.resolve(__dirname, '../static/favicon.png'),
      templateContent: ({htmlWebpackPlugin}) => {
        const templatePath = path.resolve(__dirname, '../src/index.html')
        const template = fs.readFileSync(templatePath, 'utf8')
        // 在head的底部注入打包后需要加载的文件引用（css,js）
        let newTemplate = template.replace('</head>', `${htmlWebpackPlugin.tags.headTags}</head>`)
        // const startIndex = newTemplate.indexOf('<!-- vite start -->')
        // const endIndex = newTemplate.indexOf('<!-- vite ebd -->') + '<!-- vite ebd -->'.length
        // newTemplate.slice(startIndex, endIndex)
        const regexp = /<!-- vite start -->[\s\S]*?<!-- vite end -->/
        newTemplate = newTemplate.replace(regexp, '')
        return newTemplate
      }
    }),
    new CopyPlugin({
      patterns: [{
        from: path.resolve(__dirname, '../static'),
        to: path.resolve(__dirname, '../dist/static')
      }],
    }),
    new webpack.DefinePlugin({
      'process.env.WEB_ENV': JSON.stringify(process.env.NODE_ENV),
    })
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 30 * 1024, // 分割的chunk最小为30kb
      minChunks: 1, // 要提取的chunk最少被引用1次
      maxAsyncRequests: 30, // 按需加载时并行加载的文件的最大数量
      maxInitialRequests: 5, // 入口js文件最大并行请求数量
      automaticNameDelimiter: '~', // 命名连接符号      
      cacheGroups: {
        // 分割chunk的组
        // node_modules文件会被打包到vendors组的chunk中
        // 满足上面的公共规则，如：大小超过30kb，至少引用一次
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          // 优先级
          priority: -10,
          // 如果当前要打包的模块，和之前已经提取的模块是同一个，就会复用，而不是重新打包模块
          reuseExistingChunk: true,
        },
        default: {
          // 要提取的chunk最少被引用2次
          minChunks: 2,
          // 优先级
          priority: -20,
          // 如果当前要打包的模块，和之前已经提取的模块是同一个，就会复用，而不是重新打包模块
          reuseExistingChunk: true,
        },
      },
    },
    runtimeChunk: {
      name: entrypoint => `runtime~${entrypoint.name}`
    },
    chunkIds: 'named',
  },
}