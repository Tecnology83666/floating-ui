// @noflow
const chalk = require('chalk');
const fs = require('fs');
const poster = require('poster');

// https://api.anonymousfiles.io/

class ImageReporter {
  constructor(globalConfig, options) {
    this._globalConfig = globalConfig;
    this._options = options;
  }

  onTestResult(test, testResult, aggregateResults) {
    if (
      testResult.numFailingTests &&
      testResult.failureMessage.match(/different from snapshot/)
    ) {
      const files = fs.readdirSync(
        './tests/functional/__image_snapshots__/__diff_output__/'
      );
      files.forEach(async value => {
        const file = `./tests/functional/__image_snapshots__/__diff_output__/${value}`;

        poster.post(
          file,
          {
            uploadUrl: 'https://api.anonymousfiles.io/',
            fileId: 'file',
            fileContentType: 'image/png',
          },
          (err, data) => {
            console.log(
              chalk.red.bold(
                `Uploaded image diff file to ${JSON.parse(data).url}`
              )
            );
          }
        );
      });
    }
  }
}

module.exports = ImageReporter;
