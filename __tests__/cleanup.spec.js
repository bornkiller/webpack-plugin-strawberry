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
const { CleanupPlugin } = require('../');
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

describe('CleanupPlugin suits', function () {
  const CleanupWorkingDirectory = path.resolve(__dirname, 'cleanup');
  const log = jest.spyOn(console, 'log').mockImplementation(_.noop);

  // Clear mocks before test case
  beforeEach(() => {
    log.mockClear();
    fse.removeSync(CleanupWorkingDirectory);
  });

  it('should validate CleanupPlugin exclude options', function () {
    expect(() => new CleanupPlugin({ exclude: {} })).toThrow();
  });

  it('should complete cleanup workflow', function (done) {
    const configuration = _.assign(WebpackBaseOptions, {
      output: {
        path: path.resolve(CleanupWorkingDirectory, 'cleanup_1'),
        filename: '[name].js',
        publicPath: '/'
      },
      plugins: [new CleanupPlugin({
        exclude: [],
        quite: false
      })]
    });
    const compiler = webpack(configuration);
    const outputPath = configuration.output.path;

    // Insert extraneous file
    const sampleFile1 = path.join(outputPath, 'cleanup1.txt');
    const sampleFile2 = path.join(outputPath, 'cleanup2.txt');

    fse.emptyDirSync(outputPath);
    fs.writeFileSync(sampleFile1, 'webpack CleanupPlugin sample');
    fs.writeFileSync(sampleFile2, 'webpack CleanupPlugin sample');

    const filesBefore = fs.readdirSync(outputPath);

    compiler.run((err, stat) => {
      const filesAfter = fs.readdirSync(outputPath);

      expect(err).toBeNull();
      expect(stat.hasErrors()).toBe(false);

      expect(log).toHaveBeenCalled();

      expect(filesBefore).toContain('cleanup1.txt');
      expect(filesBefore).toContain('cleanup2.txt');

      expect(filesAfter).not.toContain('cleanup1.txt');
      expect(filesAfter).not.toContain('cleanup2.txt');

      done();
    });
  });

  it('should complete cleanup workflow with exclusion, without log', function (done) {
    const configuration = _.assign(WebpackBaseOptions, {
      output: {
        path: path.resolve(CleanupWorkingDirectory, 'cleanup_2'),
        filename: '[name].js',
        publicPath: '/'
      },
      plugins: [
        new CleanupPlugin({
          exclude: ['cleanup1.txt'],
          quite: true
        })
      ]
    });
    const compiler = webpack(configuration);
    const outputPath = configuration.output.path;

    // Insert extraneous file
    const sampleFile1 = path.join(outputPath, 'cleanup1.txt');
    const sampleFile2 = path.join(outputPath, 'cleanup2.txt');

    fse.emptyDirSync(outputPath);
    fs.writeFileSync(sampleFile1, 'webpack CleanupPlugin sample');
    fs.writeFileSync(sampleFile2, 'webpack CleanupPlugin sample');

    const filesBefore = fs.readdirSync(outputPath);

    compiler.run((err, stat) => {
      const filesAfter = fs.readdirSync(outputPath);

      expect(err).toBeNull();
      expect(stat.hasErrors()).toBe(false);

      expect(log).not.toHaveBeenCalled();

      expect(filesBefore).toContain('cleanup1.txt');
      expect(filesBefore).toContain('cleanup2.txt');

      expect(filesAfter).toContain('cleanup1.txt');
      expect(filesAfter).not.toContain('cleanup2.txt');

      done();
    });
  });

  afterEach(() => {
    fse.removeSync(CleanupWorkingDirectory);
  });
});