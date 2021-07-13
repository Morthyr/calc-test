// Because this file references protractor, you'll need to have it as a project
// dependency to use 'protractor/globals'. Here is the full list of imports:
//
// import {browser, element, by, By, $, $$, ExpectedConditions}
//   from 'protractor/globals';
//
import {browser, element, by, $$ } from 'protractor';
import { CookieConsentWidget } from './cookieConsentWidget';
import { FormPage } from './formPage';

export class CalculatorHomepage {
  form = browser.driver.findElement(by.className('form')).then(form => new FormPage(form))
  cookieConsent = new CookieConsentWidget()

  async get() {
    await browser.driver.get('https://scportal.granitbank.hu/jelzalog/kalkulator');
  }
}
