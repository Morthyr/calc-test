// Because this file references protractor, you'll need to have it as a project
// dependency to use 'protractor/globals'. Here is the full list of imports:
//
// import {browser, element, by, By, $, $$, ExpectedConditions}
//   from 'protractor/globals';
//
import {browser, element, by, $$ } from 'protractor';

export class CalculatorHomepage {
  cookieConsentGrant = browser.driver.findElement(by.id('cookie-consent-grant'));
  step = browser.driver.findElement(by.className('step')) //by.css("[class^='step']"));
  question = this.step.findElement(by.className('question')) 
  answers = this.step.findElements(by.className('answer'))

  async get() {
    await browser.driver.get('https://scportal.granitbank.hu/jelzalog/kalkulator');
  }

  async checkCookieConsentVisibility(expectation: boolean) {
    const expectationMet = await browser.driver.wait(async () => { 
      const displayed = await this.cookieConsentGrant.isDisplayed()
      console.log("checked", displayed, "==", expectation, new Date())
      return displayed == expectation;
    })
    return expectationMet
  }

  async acceptCookies() {
    await this.cookieConsentGrant.click();
  }

  async getQuestion() {
    return await this.question.getText();
  }

  async getAnswers() {
    let answers = await this.answers;
    return answers.map(async (answer) => await answer.getText())
  }
}
