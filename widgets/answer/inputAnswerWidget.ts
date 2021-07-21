import { browser, by, ExpectedConditions, Key, until, WebElement } from "protractor";
import { By } from "selenium-webdriver";
import { AnswerWidget } from "./answerWidget";

export class InputAnswerWidget extends AnswerWidget {
    public get type() { return "InputAnswer" }
    constructor(answer: WebElement) {
        super(answer);
    }

    private textInputLocator = by.className("text-input")
    private itemInputLocator = by.className("item-input")
    private inputLocator = by.css(".input-container fita-input-text")
    private prelabelLocator = by.className("prelabel")
    private postlabelLocator = by.className("postlabel")

    private textInput = this.answer.findElement(this.textInputLocator)
    private itemInputs = this.textInput.findElements(this.itemInputLocator)

    private findTextInput = () => this.answer.findElement(this.textInputLocator);
    private findItemInputs = () => this.findTextInput().findElements(this.itemInputLocator);

    private async getElementsTexts(element: WebElement, locator: By) {
        return await Promise.all((await element.findElements(locator)).map(el => el.getText())); 
    }

    async getText() {
        const texts = await Promise.all((await this.itemInputs).map(async (item) => {
            const preTexts = await this.getElementsTexts(item, this.prelabelLocator);
            const input = await browser.driver.wait(item.findElement(this.inputLocator))
            const value = await input.getAttribute("value")
            const postTexts = await this.getElementsTexts(item, this.postlabelLocator);
            return [...preTexts, value, ...postTexts].join(" ")
        }))
        return texts.join(" ");
    }

    async select() {
        const firstPrelabel = await browser.driver.wait(
            until.elementIsEnabled(this.textInput.findElement(by.css(".item-input .prelabel"))));

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
            const input = await browser.driver.wait(until.elementIsVisible(itemInput.findElement(this.inputLocator)))

            if(!input)
                throw new Error("Input not found")
                
            await input.click();
            await input.sendKeys(Key.chord(Key.CONTROL, "a"), values[index]);
        }
        await this.select()
    }
}