/**
 * @description - webpack-plugin-strawberry unit suits
 * @author - huang.jian <hjj491229492@hotmail.com>
 */
'use strict';

const path = require('path');
const webpack = require('webpack');
const _ = require('lodash');
const fs = require('fs');
const fse = require('fs-extra');

// Internal
const { CompressionPlugin } = require('../');
const WebpackBaseOptions = {
  entry: path.resolve(__dirname, '__fixture__', 'strawberry.js'),
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

describe('CompressionPlugin suits', function () {
  const CompressionWorkingDirectory = path.resolve(__dirname, 'compression');

  beforeEach(() => {
    require.requireActual('file-loader');
    fse.removeSync(CompressionWorkingDirectory);
  });

  it('should complete workflow', function (done) {
    const configuration = _.assign(WebpackBaseOptions, {
      output: {
        path: path.resolve(CompressionWorkingDirectory, 'compression_1'),
        filename: '[name].js',
        publicPath: '/'
      },
      plugins: [
        new CompressionPlugin({
          threshold: 0
        })
      ]
    });
    const compiler = webpack(configuration);
    const outputPath = configuration.output.path;

    fse.emptyDirSync(outputPath);

    compiler.run((err, stat) => {
      const reg = /gz$/;
      const files = fs.readdirSync(configuration.output.path);
      const pristineFiles = files.filter((filename) => !reg.test(filename));

      expect(err).toBeNull();
      expect(stat.hasErrors()).toBe(false);

      pristineFiles.forEach((filename) => {
        expect(files).toContain(`${filename}.gz`);
      });

      done();
    });
  });

  afterEach(() => {
    fse.removeSync(CompressionWorkingDirectory);
  });
});