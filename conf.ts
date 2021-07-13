import {Config} from 'protractor';

export let config: Config = {
  framework: 'jasmine',
  capabilities: {
    browserName: 'chrome'
  },
  specs: [ 'spec.js' ],
  /*seleniumAddress: 'http://localhost:4444/wd/hub'*/
  SELENIUM_PROMISE_MANAGER: false,

  allScriptsTimeout: 6_000_000,
  jasmineNodeOpts: {
    defaultTimeoutInterval: 6_000_000
  }
};
