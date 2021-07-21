import { browser, by, ExpectedConditions, Key, until, WebElement } from "protractor";

export class AnswerWidget {
    public get type() { return "Answer" }
    constructor(protected answer: WebElement) { }

    simpleText = this.answer.findElement(by.css(".text-select .simple-text"))

    getText() {
        return this.answer.getText();
    }

    async select() {
        const simpleText = await browser.driver.wait(async () => {
            try {
                return await this.simpleText
            } catch {
                return false;
            }
        });
        if(!simpleText)
            throw new Error("Cannot select input");
        await simpleText.click();
    }

    async checkSelection(expectation: boolean) {
        const expectationMet = await browser.driver.wait(async() => {
            const icons = await this.answer.findElements(by.tagName("fita-icon-component"))
            const hasIcon = icons.length > 0
            const expectationMet = hasIcon == expectation
            return expectationMet
        })
        return expectationMet
    }
}