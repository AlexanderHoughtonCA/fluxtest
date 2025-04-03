const UnitTester = require("./src/test/UnitTester.js");
const AppTest = require("./src/test/AppTest.js");

var {BLACK_FOREST_API_KEY} = require('./src/Constants.js');

// Dirty, filthy hack because I've run out of time...
process.env.UNIT_TESTING_ENABLED = true;

async function runUnitTests(){
    let testApp = new AppTest(BLACK_FOREST_API_KEY);
    UnitTester.addTestable(testApp);

    await UnitTester.run();

    UnitTester.report();
}

runUnitTests();


