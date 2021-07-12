// local import of the exported AngularPage class
import {CalculatorHomepage} from './calculatorHomepage';

// The jasmine typings are brought in via DefinitelyTyped ambient typings.
describe('homepage', () => {
  let calculatorHomepage: CalculatorHomepage

  it('navigates', async () => {
    calculatorHomepage = new CalculatorHomepage();
    await calculatorHomepage.get();
  });

  it('has cookie consent', async () => {
    expect(await calculatorHomepage.checkCookieConsentVisibility(true)).toBeTruthy();
  })

  it('accept cookie consent', async () => {
    await calculatorHomepage.acceptCookies();
    expect(await calculatorHomepage.checkCookieConsentVisibility(false)).toBeTruthy();
  });

  it('has question', async () => {
    expect(await calculatorHomepage.getQuestion()).toEqual('Van házastársa vagy élettársa?');
  })
});
