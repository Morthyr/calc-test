// Because this file references protractor, you'll need to have it as a project
// dependency to use 'protractor/globals'. Here is the full list of imports:
//
// import {browser, element, by, By, $, $$, ExpectedConditions}
//   from 'protractor/globals';
//
import {browser, element, by, $$, until, WebElement } from 'protractor';
import { CookieConsentWidget } from './widgets/cookieConsentWidget';
import { FormWidget } from './widgets/formWidget';

export class CalculatorHomepage {
  private formsLocator = by.css('app-form-wizard .form')
  private cookieLocator = by.id('cookie-consent-grant')
  
  async get() {
    await browser.driver.manage().window().setSize(1366, 768)
    await browser.driver.get('https://scportal.granitbank.hu/jelzalog/kalkulator');
  }

  async getCookieConsent() {
    const cookieConsent = await browser.driver.wait(until.elementLocated(this.cookieLocator))
    return new CookieConsentWidget(cookieConsent);
  }

  async getTitle() {
    const process = await browser.driver.wait(until.elementLocated(by.css("app-header fita-process")))
    try {
      const steps: { title: string }[] = await browser.driver.executeScript(`return arguments[0].steps`, process);
      const currentStep = +(await process.getAttribute("currentStep"))
      return steps[currentStep].title;
    } catch(error) {
      return error.name
    }
  }

  async getForm() {
    const form = await browser.driver.wait(async () => {
      const forms = await browser.driver.findElements(this.formsLocator)
      for(const form of forms) {
        if(await form.isDisplayed()) {
          return form;
        }
      }
      return null;
    })
    const formPage = new FormWidget(this, form);
    return formPage;
  }
}
