module.exports = {
    plugins: [
      [
        // 需要在package.json中定义browserslist  
        "postcss-preset-env",
        {
          // 其他选项
          ident: 'postcss',
        },
      ],
    ],
  }