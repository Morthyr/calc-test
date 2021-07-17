// Because this file references protractor, you'll need to have it as a project
// dependency to use 'protractor/globals'. Here is the full list of imports:
//
// import {browser, element, by, By, $, $$, ExpectedConditions}
//   from 'protractor/globals';
//
import {browser, element, by, $$, until } from 'protractor';
import { CookieConsentWidget } from './cookieConsentWidget';
import { FormPage } from './formPage';

export class CalculatorHomepage {
  private form = by.className('form')
  private cookie = by.id('cookie-consent-grant')
  
  async get() {
    await browser.driver.get('https://scportal.granitbank.hu/jelzalog/kalkulator');
  }

  async getCookieConsent() {
    const cookieConsent = await browser.driver.wait(until.elementLocated(this.cookie))
    return new CookieConsentWidget(cookieConsent);
  }

  async getForm() {
    const form = await browser.driver.wait(until.elementLocated(this.form))
    return new FormPage(form);
  }
}
