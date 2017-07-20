/**
 * @description - webpack-plugin-strawberry unit suits
 * @author - huang.jian <hjj491229492@hotmail.com>
 */
'use strict';

const path = require('path');
const webpack = require('webpack');
const _ = require('lodash');
const MemoryFileSystem = require('memory-fs');

// Internal
const StrawberryPlugin = require('../');
const WebpackBaseOptions = {
  entry: path.resolve(__dirname, '__fixture__', 'strawberry.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.html', '.scss', '.css'],
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|mp3|woff|woff2|ttf|eot|svg)(\?.*)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              limit: 5000,
              name: '[name].[ext]'
            }
          }
        ]
      }
    ]
  }
};

describe('StrawberryPlugin suits', function () {
  beforeAll(() => {
    require.requireActual('file-loader');
  });

  it('should complete workflow', function (done) {
    const configuration = _.assign(WebpackBaseOptions, {
      plugins: [
        new StrawberryPlugin({
          threshold: 0
        })
      ]
    });
    const compiler = webpack(configuration);
    const fs = compiler.outputFileSystem = new MemoryFileSystem();

    compiler.run((err, stat) => {
      const reg = /gz$/;
      const files = fs.readdirSync(path.resolve(__dirname, 'dist'));
      const pristineFiles = files.filter((filename) => !reg.test(filename));

      expect(err).toBeNull();
      expect(stat.hasErrors()).toBe(false);

      pristineFiles.forEach((filename) => {
        expect(files).toContain(`${filename}.gz`);
      });

      done();
    });
  });
});