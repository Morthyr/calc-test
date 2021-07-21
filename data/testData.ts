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

export const TestData: TestData[] = [{
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
