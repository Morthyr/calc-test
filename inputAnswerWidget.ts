import { browser, by, ExpectedConditions, Key, until, WebElement } from "protractor";
import { AnswerWidget } from "./answerWidget";

export class InputAnswerWidget extends AnswerWidget {
    public get type() { return "InputAnswer" }
    constructor(answer: WebElement) {
        super(answer);
    }

    textInput = this.answer.findElement(by.className("text-input"))

    async getText() {
        const preTexts = await Promise.all((await this.textInput.findElements(by.className("prelabel"))).map(el => el.getText()));
        const value = await this.input.getAttribute("value")
        const postTexts = await Promise.all((await this.textInput.findElements(by.className("postlabel"))).map(el => el.getText()));
        return [...preTexts, value, ...postTexts].join(" ");
    }

    input = this.textInput.findElement(by.css(".input-container fita-input-text"))

    async select() {
        const textInput = await browser.driver.wait(until.elementIsEnabled(await this.textInput));
        if(!textInput)
            throw new Error("Cannot select input");
        await textInput.click();
    }
    
    async setInput(value: string | number) {
        const input = await browser.driver.wait(until.elementIsEnabled(await this.input));
        if(!input)
            throw new Error("Input not found")

        await input.sendKeys(Key.chord(Key.CONTROL, "a"), value);
        await this.select()
    }
}