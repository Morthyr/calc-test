// local import of the exported AngularPage class
import { AnswerWidget } from './answerWidget';
import {CalculatorHomepage} from './calculatorHomepage';
import { CookieConsentWidget } from './cookieConsentWidget';
import { FormPage } from './formPage';
import { InputAnswerWidget } from './inputAnswerWidget';
import { StepWidget } from './stepWidget';

// The jasmine typings are brought in via DefinitelyTyped ambient typings.
let calculatorHomepage = new CalculatorHomepage();
describe('homepage', () => {

  it('navigates', async () => {
    await calculatorHomepage.get();
  });
});

describe('cookie consent', () => {
  let consent: CookieConsentWidget;
  
  it('visible', async () => {
    consent = await calculatorHomepage.getCookieConsent()
    expect(await consent.checkVisibility(true)).toBeTruthy();
  })

  it('accept', async () => {
    await consent.accept();
    expect(await consent.checkVisibility(false)).toBeTruthy();
  });
})

interface TestData {
  question: string;
  option: string;
  optionValue?: string | number;
}

const testData: TestData[] = [{
  question: 'Van házastársa vagy élettársa?',
  option: 'Igen, van'
}, {
  question: 'Van 14 éven aluli gyerme(kük|ke)',
  option: 'Igen, (\\d) gyerme(künk|kem) van',
  optionValue: 9
}]

testData.forEach((testItem, testIndex) => {
  const testOrder = testIndex + 1;

  describe(`fill ${testOrder}. step`, () => {
    let form: FormPage;    
    let steps: StepWidget[]

    it(`has ${testOrder} step(s)`, async () => {
      form = await calculatorHomepage.getForm();
      expect(await form.checkStepCount(testOrder)).toBeTruthy()
      steps = await form.steps
    })
  
    let currentStep: StepWidget;
    it(`has ${testOrder}. step`, async () => {
      currentStep = steps[testIndex]
      expect(await currentStep.getQuestion()).toMatch(testItem.question);
    })
  
    const option = testItem.option
    let answer: AnswerWidget;
    it(`select "${option}"`, async () => {
      answer = await currentStep.getAnswer(option);
      expect(answer).not.toBeNull("answer is null")
      await answer.select();
    })

    const optionValue = testItem.optionValue
    if(optionValue) {
      it(`set input to "${optionValue}"`, async () => {
        await (answer as InputAnswerWidget).setInput(optionValue)
        const text = await answer.getText()
        expect(text).toMatch(option)
        expect(text).toMatch(optionValue.toString())
      })
    }

    it("selected", async () => {
      expect(await answer.checkSelection(true)).toBeTruthy("selection is not truthy");
    })
  })
});
