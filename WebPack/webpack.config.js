const path = require('path');

module.exports = {
  // 若在這設定 whatwg-fetch，則不需要在 main.jsx 中 import whatwg.fetch
  entry: {
    main: ['whatwg-fetch', './src/main.jsx']
  },
  output: {
    path: path.resolve(__dirname, 'lib'),
    // 這裡的 [name] 對應到 entry 的 key
    filename: '[name].js'
  },
  mode: "development", // 或者 production
  module: {
      rules: [
          {
            // \. 代表跳脫的 . ，m? 代表有沒有 m 都可以，$ 為結尾，後面有其他字元的將不符合
            // 有符合 test 的才會使用該 loader
            test: /\.m?jsx?$/,
            exclude: /(node_modules|bower_component)/,
            use: {
              // 可以直接放 loader，但若要使用到如 .babelrc 內的設定，
              // 則必須放在 use 裡面
              loader: "babel-loader",
              options: {
                // 注意專為 react 用的 preset

                // 若有要針對某個 preset 做設定，則該 preset 須再用一陣列包裝
                // 注意 main.jsx 內需要同時 import "core-js/stable" 和 "regenerator-runtime/runtime" 來使用 useBuiltIns: entry 和 corejs 
                // 若 useBuiltIns 為 usage 則不需要 import 以上兩項

                // 而 regenerator-runtime/runtime 需要安裝 @babel/@runtime 和/或 @babel/plugin-transform-runtime 來使用
                presets: [['@babel/preset-env', {useBuiltIns: "entry", corejs: 3}],
                 '@babel/preset-react'],
                // 此 plugin 目的在於編譯 class 內的 arrow function
                plugins: ['@babel/plugin-proposal-class-properties',
                // @babel/plugin-transform-runtime 為非必要，原因是 regenerator-runtime/runtime 只需要安裝 @babel/@runtime
                // 就可以運作，不需要在 config 檔中另外設定
                // 但使用 @babel/plugin-transform-runtime 可以減少 babel 中因為互相引用而重複編譯的情形，從而減少檔案大小
                '@babel/plugin-transform-runtime']
              }
            }
          },
          {
            test: /\.(scss|sass)$/,
            exclude: /(node_modules|bower_component)/,
            use: [
              // 若要同時使用多個 loader，use 須使用陣列。loader 的順序是由下到上，
              // 這裡是先由 css-loader 解析 css 檔案，再由 style-loader 將 css 檔案掛載到 HTML-DOM 內
              {
                // 注意 main.jsx 內，透過 import css 的方式將 .css 檔案載到 DOM 中。
                // ## 注意要先有 .css 檔案 (main.jsx 內的路徑指定的 css 檔案)，因此下面應有 sass-loader

                // loader: "style-loader/url" 此為舊版配合 file-loader 的 style-loader
                loader: "style-loader",
                options: {
                  injectType: "linkTag"
                }
              },
              {
                // 注意 main.jsx 加載 css 後、index.html 在運行時產生的 style
                // css-loader 會將 css 直接載在頁面，而 file-loader 則會加載 css 檔案
                // ## 注意若要使用 file-loader，則必須使用 style-loader 的 options 的 injectType
                // 以及 file-loader 的 options 的 name

                // loader: "css-loader"
                loader: "file-loader",
                options: {
                  // 注意這種方式會產生新的 css。預設在 output/css 資料夾內
                  // name: "[path][name].[ext]"

                  // 若要產生在原本的(上一層的) css 資料夾內，可直接更改路徑
                  name: "../css/[name].css"
                }
              },
              {
                // 注意若要使用此 loader，則 main.jsx 的 css 進入點要換成
                // 未編譯的 scss
                loader: "sass-loader",
              }
            ]
          }
      ]
  }
};