import { browser, by, promise, WebElement } from "protractor";
import { StepWidget } from "./stepWidget";

export class FormPage {
    constructor(private form: WebElement) { }

    scrollButton = this.form.findElement(by.className("scroll-button"))
    steps = this.form.findElements(by.css(".page .step")).then(steps =>
        steps.map((question:WebElement) => new StepWidget(question)))
    
    async checkScrollButtonVisibility(expectation: boolean) {
        const expectationMet = await browser.driver.wait(async () => {
            const visibility = await (await this.scrollButton).isDisplayed()
            return visibility == expectation;
        })
        return expectationMet;
    }
}