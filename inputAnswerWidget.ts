import { browser, by, ExpectedConditions, Key, until, WebElement } from "protractor";
import { AnswerWidget } from "./answerWidget";

export class InputAnswerWidget extends AnswerWidget {
    public get type() { return "InputAnswer" }
    constructor(answer: WebElement) {
        super(answer);
    }

    textInput = this.answer.findElement(by.className("text-input"))
    itemInputs = this.textInput.findElements(by.className("item-input"))
    inputLoc = by.css(".input-container fita-input-text")

    async getText() {
        const texts = await Promise.all((await this.itemInputs).map(async (item) => {
            const preTexts = await Promise.all((await item.findElements(by.className("prelabel"))).map(el => el.getText()));
            const input = await browser.driver.wait(item.findElement(this.inputLoc))
            const value = await input.getAttribute("value")
            const postTexts = await Promise.all((await item.findElements(by.className("postlabel"))).map(el => el.getText()));
            return [...preTexts, value, ...postTexts].join(" ")
        }))
        return texts.join(" ");
    }

    async select() {
        const firstPrelabel = await browser.driver.wait(
            until.elementIsEnabled(await this.textInput.findElement(by.css(".item-input .prelabel"))));

        if(!firstPrelabel)
            throw new Error("Cannot select input");
        await firstPrelabel.click();
    }
    
    async setInput(values: (string | number)[]) {
        const itemInputs = await browser.driver.wait(async () => {
            const inputs = await this.itemInputs;
            return inputs.length > 0 ? inputs : null;
        });
        for(const itemInput of itemInputs) {
            const index = itemInputs.indexOf(itemInput)
            const input = await browser.driver.wait(until.elementIsVisible(await itemInput.findElement(this.inputLoc)))

            if(!input)
                throw new Error("Input not found")
            
            await input.sendKeys(Key.chord(Key.CONTROL, "a"), values[index]);
        }
        await this.select()
    }
}