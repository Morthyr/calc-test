// local import of the exported AngularPage class
import {CalculatorHomepage} from './calculatorHomepage';
import { StepWidget } from './stepWidget';

// The jasmine typings are brought in via DefinitelyTyped ambient typings.
describe('homepage', () => {
  let calculatorHomepage: CalculatorHomepage

  it('navigates', async () => {
    calculatorHomepage = new CalculatorHomepage();
    await calculatorHomepage.get();
  });

  describe('cookie consent', () => {
    const consent = calculatorHomepage.cookieConsent;
    
    it('visible', async () => {
      expect(await consent.checkVisibility(true)).toBeTruthy();
    })
  
    it('accept', async () => {
      await consent.accept();
      expect(await consent.checkVisibility(false)).toBeTruthy();
    });
  })
  
  let steps: StepWidget[]
  it('has steps', async () => {
    steps = await (await calculatorHomepage.form).steps
    expect(steps.length).toBeGreaterThan(0)
    
  })

  const firstStep = steps[0]
  it('has first step', async () => {
    expect(await firstStep.getQuestion()).toEqual('Van házastársa vagy élettársa?');
  })

  const option = 'Igen, van'
  it(`select "${option}"`, async () => {
    await firstStep.selectAnswer(option)
    expect(firstStep.checkAnswerSelection(option, true)).toBeTruthy();
  })
});
