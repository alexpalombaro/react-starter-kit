/*eslint-disable strict*/
'use strict';

var _ = require('lodash');
//var glob = require('glob');
var path = require('path');
var webpack = require('webpack');
var argv = require('minimist')(process.argv.slice(2));

var DEBUG = !argv.release;

var AUTOPREFIXER_LOADER = 'autoprefixer-loader?{browsers:[' +
  '"Android 2.3", "Android >= 4", "Chrome >= 20", "Firefox >= 24", ' +
  '"Explorer >= 8", "iOS >= 6", "Opera >= 12", "Safari >= 6"]}';

var GLOBALS = {
  'process.env.NODE_ENV': DEBUG ? '"development"' : '"production"',
  '__DEV__': DEBUG
};

//
// Common configuration chunk to be used for both
// client-side (app.js) and server-side (server.js) bundles
// -----------------------------------------------------------------------------

var fileLoaderQuery = {
  name: 'assets/[name]_[hash].[ext]',
  limit: 10000
};

var config = {
  output: {
    path: DEBUG ? './build-debug/' : './build-release',
    publicPath: './',
    sourcePrefix: '  '
  },

  cache: DEBUG,
  debug: DEBUG,
  devtool: DEBUG ? '#inline-source-map' : false,

  stats: {
    colors: true,
    reasons: DEBUG
  },

  plugins: [
    new webpack.optimize.OccurenceOrderPlugin()
  ],

  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx']
  },

  module: {
    preLoaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
      }
    ],

    loaders: [
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader!' + AUTOPREFIXER_LOADER
      },
      {
        test: /\.less/,
        loader: 'style-loader!css-loader!less-loader'
      },
      {
        test: /\.gif/,
        loader: 'url-loader',
        query: fileLoaderQuery
      },
      {
        test: /\.jpg/,
        loader: 'url-loader',
        query: fileLoaderQuery
      },
      {
        test: /\.png/,
        loader: 'url-loader',
        query: fileLoaderQuery
      },
      {
        test: /\.svg/,
        loader: 'url-loader',
        query: fileLoaderQuery,
        exclude: /sig\.svg$/
      },
      {
        test: /\.svg/,
        loader: 'raw-loader!svgo-loader'
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          optional: ['runtime']
        }
      }
    ]
  }
};

//
// Configuration for the client-side bundle (app.js)
// -----------------------------------------------------------------------------

var appConfig = _.merge({}, config, {
  entry: './src/app.js',
  output: {
    filename: 'app.js'
  },
  plugins: config.plugins.concat([
    new webpack.DefinePlugin(_.merge(GLOBALS, {'__SERVER__': false}))
  ].concat(DEBUG ? [] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.AggressiveMergingPlugin()
  ])),

  externals: {
    'react': 'React',
    'react/addons': 'React'
  }

});

//
// Configuration for the server-side bundle (server.js)
// -----------------------------------------------------------------------------

var serverConfig = _.merge({}, config, {
  entry: './src/server.js',
  output: {
    filename: 'server.js',
    libraryTarget: 'commonjs2'
  },
  target: 'node',
  externals: /^[a-z][a-z\.\-0-9]*$/,
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false
  },
  plugins: config.plugins.concat(
    new webpack.DefinePlugin(_.merge(GLOBALS, {'__SERVER__': true}))
  ),
  module: {
    loaders: config.module.loaders.map(function (loader) {
      // Remove style-loader
      return _.merge(loader, {
        loader: loader.loader = loader.loader.replace('style-loader!', '')
      });
    })
  }
});


//
// Configuration for testing
// -----------------------------------------------------------------------------

/*
var testConfig = _.merge({}, config, {
  entry: glob.sync('./src/!**!/__tests__/!**.js'),
  output: {
    path: './build-test/',
    filename: 'tests.js'
  }
});
*/

//
// Debug build
// -----------------------------------------------------------------------------


/*
var componentConfig = (function () {
  var entry = {};
  _.forEach(glob.sync('./src/!**!/components/!*!/!*.js'), function (file) {
    var filename = path.basename(file, path.extname(file));
    if (!argv.component || filename.match(argv.component)) {
      entry[filename] = file;
    }
  });

  return _.merge({}, config, {
    entry: entry,
    output: {
      path: './build-component',
      filename: '[name].bundle.js'
    },
    externals: /^[a-z][a-z\.\-0-9]*$/
  });
})();
*/


module.exports = {
  build: [appConfig, serverConfig]
  //test: testConfig
  //component: componentConfig
};
