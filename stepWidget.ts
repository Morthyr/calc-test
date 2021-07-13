import { browser, by } from "protractor";
import { WebElement } from "selenium-webdriver";

export class StepWidget {
    constructor(private step: WebElement) {}

    question = this.step.findElement(by.className('question')) 
    answers = this.step.findElements(by.className('answer'))

    async getQuestion() {
        return await this.question.getText();
    }

    async getAnswers() {
        let answers = await this.answers;
        return answers.map(async (answer) => await answer.getText())
    }

    async selectAnswer(optionText: string) {
        const option = (await this.answers).find(async (answer) => 
            (await answer.getText()) == optionText);
    
        await option.click();

        return option;
    }

    async checkAnswerSelection(optionText: string, expectation: boolean) {
        const expectationMet = await browser.driver.wait(async() => {
            const option = (await this.answers).find(async (answer) => 
            (await answer.getText()) == optionText);
        return ((await option.getAttribute("class")).split(' ').indexOf("selected") > -1 ) == expectation
        })

    return expectationMet
    }
}