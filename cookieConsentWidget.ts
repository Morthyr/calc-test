import { browser, by } from "protractor";

export class CookieConsentWidget {
  cookieConsentGrant = browser.driver.findElement(by.id('cookie-consent-grant'));

  async checkVisibility(expectation: boolean) {
    const expectationMet = await browser.driver.wait(async () => { 
      const displayed = await this.cookieConsentGrant.isDisplayed()
      return displayed == expectation;
    })
    return expectationMet
  }

  async accept() {
    await this.cookieConsentGrant.click();
  }
}