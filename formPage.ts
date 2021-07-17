import { browser, by, promise, WebElement } from "protractor";
import { StepWidget } from "./stepWidget";

export class FormPage {
    constructor(private form: WebElement) { }

    scrollButton = this.form.findElement(by.className("scroll-button"))
    private stepsElements = this.form.findElements(by.css(".page .step"))
    steps = this.stepsElements.then(steps =>
        steps.map((question:WebElement) => new StepWidget(question)))
    
    async checkStepCount(expectation: number) {
        const expectationMet = await browser.driver.wait(async () => 
            (await this.stepsElements).length == expectation
        )
        return expectationMet;
    }

    async checkScrollButtonVisibility(expectation: boolean) {
        const expectationMet = await browser.driver.wait(async () => {
            const visibility = await (await this.scrollButton).isDisplayed()
            return visibility == expectation;
        })
        return expectationMet;
    }
}