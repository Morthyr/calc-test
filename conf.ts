import {Config} from 'protractor';
var HtmlScreenshotReporter = require('protractor-jasmine2-screenshot-reporter');

var reporter = new HtmlScreenshotReporter({
  dest: './screenshots',
  filename: 'report.html',
  /*reportOnlyFailedSpecs: false,
  captureOnlyFailedSpecs: false*/
});

export let config: Config = {
  framework: 'jasmine',
  capabilities: {
    browserName: 'chrome'
  },
  specs: [ 'spec.js' ],
  /*seleniumAddress: 'http://localhost:4444/wd/hub'*/
  SELENIUM_PROMISE_MANAGER: false,

  allScriptsTimeout: 6_000,
  jasmineNodeOpts: {
    defaultTimeoutInterval: 6_000
  },

  // Setup the report before any tests start
  beforeLaunch: function() {
    return new Promise(function(resolve){
      reporter.beforeLaunch(resolve);
    });
  },

  // Assign the test reporter to each running instance
  onPrepare: function() {
    jasmine.getEnv().addReporter(reporter);
  },

  // Close the report after all tests finish
  afterLaunch: function(exitCode) {
    return new Promise(function(resolve){
      reporter.afterLaunch(resolve.bind(this, exitCode));
    });
  }
};
