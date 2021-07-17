import { browser, by, until, WebElement } from "protractor";

export class CookieConsentWidget {
  constructor(private cookieConsentGrant: WebElement) {}

  async checkVisibility(expectation: boolean) {
    const visFn = expectation ? until.elementIsVisible : until.elementIsNotVisible; 
    const cookieConsentGrant = await browser.driver.wait(visFn(this.cookieConsentGrant))
    return !!cookieConsentGrant
  }

  async accept() {
    await this.cookieConsentGrant.click();
  }
}