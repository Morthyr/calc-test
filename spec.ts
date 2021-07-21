import { AnswerWidget } from './widgets/answer/answerWidget';
import { CalculatorHomepage } from './calculatorHomepage';
import { CookieConsentWidget } from './widgets/cookieConsentWidget';
import { FormWidget } from './widgets/formWidget';
import { InputAnswerWidget } from './widgets/answer/inputAnswerWidget';
import { StepWidget } from './widgets/stepWidget';
import { TestData } from './data/testData';

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

for(const testDataItem of TestData) {
	const testDataIndex = TestData.indexOf(testDataItem)
	describe("title", () => {
		it(`has ${testDataItem.title} as title`, async () => {
			expect(await calculatorHomepage.getTitle()).toEqual(testDataItem.title);
		})
	})

	for(const testItem of testDataItem.steps) {
		const testIndex = testDataItem.steps.indexOf(testItem)
		const testOrder = testIndex + 1;
		
		describe(`fill ${testOrder}. step`, () => {
			let form: FormWidget;
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
			let form: FormWidget;
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