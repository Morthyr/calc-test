import { browser, by, ExpectedConditions, until } from "protractor";
import { WebElement } from "selenium-webdriver";
import { AnswerWidget } from "./answerWidget";
import { InputAnswerWidget } from "./inputAnswerWidget";

export class StepWidget {
    constructor(private step: WebElement) {}

    private questionLocator = by.className('question')
    private answersLocator = by.className('answer')

    async getQuestion() {
        return await (await browser.driver.wait(until.elementIsVisible(this.step.findElement(this.questionLocator)))).getText();
    }

    async getAnswer(optionText: string) {
        return await browser.driver.wait(async () => {
            const answerEls = await this.step.findElements(this.answersLocator);
            if(!answerEls || answerEls.length === 0) {
                console.log("There is no answer")
                return null;
            }

            const answerEl = answerEls.find(async (answer) => (await answer.getText()).match(optionText));
            if(!answerEl) {
                console.log(`There is no matching answer to ${optionText}`)
                return null;
            }

            return this.answerFactory(answerEl)
        })
    }

    private async answerFactory(answer: WebElement) {
        const hasInput = (await answer.findElements(by.className("text-input"))).length > 0
        if(hasInput)
            return new InputAnswerWidget(answer);
        return new AnswerWidget(answer);
    }
}