// local import of the exported AngularPage class
import { browser } from 'protractor';
import { AnswerWidget } from './answerWidget';
import { CalculatorHomepage } from './calculatorHomepage';
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
  title: string;
  steps: TestDataStep[];
  forward?: string;
}

interface TestDataStep {
  question: string;
  option: string;
  optionValues?: (string | number)[];
}

const testData: TestData[] = [{
  title: "Családi helyzet",
  steps: [{
    question: 'Van házastársa vagy élettársa?',
    option: 'Igen, van'
  }, {
    question: 'Van 14 éven aluli gyerme(kük|ke)?',
    option: 'Igen, (\\d) gyerme(künk|kem) van',
    optionValues: [9]
  }, {
    question: 'Él Önnel más egy háztartásban \\((házastársán, élettársán és |)14 éven aluli gyermekein kívül\\)?',
    option: 'Igen, (\\d) felnőtt és (\\d) nyugdíjas él vel(em|ünk)',
    optionValues: [8, 8]
  }],
  forward: "Tovább az életkor és végzettség megadására"
}, {
  title: "Életkor, végzettség",
  steps: [{
    question: "Mi az Ön legmagasabb iskolai végzettsége?",
    option: "8 általános",
  }, {
    question: "Mikor született?",
    option: "(\\d{4}) Év  (\\d{1,2}) Hónap  (\\d{1,2}) Nap",
    optionValues: [1990, 1, 1]
  }, {
    question: "Rendelkezik nyelvvizsgával?",
    option: "Igen, középfokú vizsgával rendelkezem"
  }, {
    question: "Mi a partnere legmagasabb iskolai végzettsége?",
    option: "8 általánosnál kevesebb"
  }, {
    question: "Mikor született a partnere?",
    option: "(\\d{4}) Év  (\\d{1,2}) Hónap  (\\d{1,2}) Nap",
    optionValues: [1990, 1, 1]
  }, {
    question: "Rendelkezik a partnere nyelvvizsgával?",
    option: "Igen, felsőfokú vizsgával rendelkezik"
  }],
  forward: "Tovább a jövedelmi helyzet megadásához"
}, {
  title: "Jövedelmi helyzet",
  steps: []
}]

for(const testDataItem of testData) {
  const testDataIndex = testData.indexOf(testDataItem)
  describe("title", () => {
    it(`has ${testDataItem.title} as title`, async () => {
      expect(await calculatorHomepage.getTitle()).toEqual(testDataItem.title);
    })
  })

  for(const testItem of testDataItem.steps) {
    const testIndex = testDataItem.steps.indexOf(testItem)
    const testOrder = testIndex + 1;
    
    describe(`fill ${testOrder}. step`, () => {
      let form: FormPage;
      let steps: StepWidget[]

      it(`has ${testOrder} step(s)`, async () => {
        form = await calculatorHomepage.getForm();
        expect(await form.checkStepCount(testOrder)).toBeTruthy()
        steps = await form.getSteps()
      })

      if (testIndex > 1) {
        it("scroll bottom", async () => {
          expect(await form.checkScrollButtonVisibility(true)).toBeTruthy()
          await form.scrollBottom()
          expect(await form.checkScrollButtonVisibility(false)).toBeTruthy()
        })
      }

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

      const optionValues = testItem.optionValues
      if (optionValues) {
        it(`set input(s) to "${optionValues}"`, async () => {
          await (answer as InputAnswerWidget).setInput(optionValues)

          const text = await answer.getText()
          expect(text).toMatch(option)
          optionValues.forEach(optionValue => expect(text).toMatch(optionValue.toString()))
        })
      }

      it("selected", async () => {
        expect(await answer.checkSelection(true)).toBeTruthy("selection is not truthy");
      })
    })
  }

  if(testDataItem.forward) {
    describe("navigate to next step page", () => {
      let form: FormPage;
      it("scroll bottom", async () => {
        form = await calculatorHomepage.getForm();
        expect(await form.checkScrollButtonVisibility(true)).toBeTruthy()
        await form.scrollBottom()
        expect(await form.checkScrollButtonVisibility(false)).toBeTruthy()
      })

      it("click button", async () => {
        expect(await form.getNextButtonText()).toBe(testDataItem.forward)
        const oldTitle = await calculatorHomepage.getTitle()
        form = await form.clickNextButton()
        expect(await calculatorHomepage.getTitle()).not.toEqual(oldTitle)
      })
    })
  }
}