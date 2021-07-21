import { browser, by, promise, until, WebElement } from "protractor";
import { CalculatorHomepage } from "./calculatorHomepage";
import { StepWidget } from "./stepWidget";

export class FormPage {
    constructor(private home: CalculatorHomepage, private form: WebElement) { }

    private scrollButtonLocator = by.className("scroll-button")
    private stepsLocator = by.css(".page .step");

    stepsFactory = (steps: WebElement[]) => steps.map((question:WebElement) => new StepWidget(question))
    
    async getSteps() {
        return this.stepsFactory(await this.getStepsElements())
    }

    private async getStepsElements() {
        return await browser.driver.wait(async () => {
            const steps = await this.form.findElements(this.stepsLocator);
            if(!steps) {
                console.log("steps is null")
                return null;
            }
            return steps;
        });
    }

    async checkStepCount(expectation: number) {
        console.log("start checkStepCount", expectation)
        const expectationMet = await browser.driver.wait(async () => {
            const steps = await this.getStepsElements()
            console.log("steps.length", steps?.length)
            return steps?.length == expectation
        })
        console.log("end checkStepCount", expectation, expectationMet)
        return expectationMet;
    }

    async checkScrollButtonVisibility(expectation: boolean) {
        const visFn = expectation ? until.elementIsVisible : until.elementIsNotVisible; 
        const scrollButton = await browser.driver.wait(visFn(this.form.findElement(this.scrollButtonLocator)))
        return !!scrollButton;
    }

    async scrollBottom() {
        return await (await browser.driver.wait(until.elementIsVisible(this.form.findElement(this.scrollButtonLocator)))).click();
    }
    
    // TODO: use proper locator; this is a hack as app-action-buttons is not found within this.form
    private getActionButtons = () => {
        return document.querySelectorAll(".form app-action-buttons fita-button")
    }

    async getNextButtonText() {
        const actionButtons: WebElement[] = await browser.driver.executeScript(this.getActionButtons)
        return await actionButtons[actionButtons.length - 1].getText();
    }

    async clickNextButton() {
        const actionButtons: WebElement[] = await browser.driver.executeScript(this.getActionButtons)
        await actionButtons[actionButtons.length - 1].click();
        return await this.home.getForm()
    }
}