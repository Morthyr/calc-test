import { browser, by, ExpectedConditions, until } from "protractor";
import { WebElement } from "selenium-webdriver";
import { AnswerWidget } from "./answerWidget";
import { InputAnswerWidget } from "./inputAnswerWidget";

export class StepWidget {
    constructor(private step: WebElement) {}

    question = this.step.findElement(by.className('question')) 
    private answers = this.step.findElements(by.className('answer'))

    async getQuestion() {
        return await this.question.getText();
    }

    async getAnswer(optionText: string) {
        const answer = await browser.driver.wait(async () => {
            const answerEls = await this.answers;
            if(!answerEls || answerEls.length === 0) {
                console.log("There is no answer")
                return false;
            }

            const answerEl = answerEls.find(async (answer) => (await answer.getText()).match(optionText));
            if(!answerEl) {
                console.log(`There is no matching answer to ${optionText}`)
                return false;
            }

            return this.answerFactory(answerEl)
        })
        return answer ? answer : null
    }

    private async answerFactory(answer: WebElement) {
        const hasInput = (await answer.findElements(by.className("text-input"))).length > 0
        if(hasInput)
            return new InputAnswerWidget(answer);
        return new AnswerWidget(answer);
    }
}