const assert = require('assert');

class Testable{
    constructor(name){
        this.name = name;

        this.numPassedTests = 0;
        this.numFailedTests = 0;
        this.failedTests = [];
        this.passedTests = [];

        this.assertNull = this.assertNull.bind(this);
        this.assertNotNull = this.assertNotNull.bind(this);
        this.assertTrue = this.assertTrue.bind(this);
        this.assertFalse = this.assertFalse.bind(this);
        this.runTests = this.runTests.bind(this);
        
        this._failTest = this._failTest.bind(this);
        this._passTest = this._passTest.bind(this);

        this.report = this.report.bind(this);
    }

    assertNull(name, value, reason){
        if(value != null){
            this._failTest(name, reason);
        }
        else{
            this._passTest(name);
        }
    }

    assertNotNull(name, value, reason){
        if(value == null){
            this._failTest(name, reason);
        }
        else{
            this._passTest(name);
        }
    }

    assertTrue(name, value, reason){
        if(value == true){
            this._passTest(name);
            
        }
        else{
            this._failTest(name, reason);   
        }
    }

    assertFalse(name, value, reason){
        if(value == false){
            this._passTest(name);
        }
        else{
            this._failTest(name, reason);
        }
    }

    runTests(){
        console.log(_this.name + " - Num unit tests failed: " + numFailedTests);
        return (numFailedTests == 0);
    }

    _failTest(name, reason){
        this.failedTests.push({name, reason});
        this.numFailedTests++;
    }

    _passTest(name, msg){
        this.passedTests.push(name);
        this.numPassedTests++;
    }

    report(){
        const _this = this;
        
        console.log(_this.name + " - Failed: " + this.numFailedTests + ", Passed: "+ this.numPassedTests);
        
        if(_this.failedTests.length > 0){
            console.log("\n" + _this.name + " - Failed tests:");
            for(var i=0; i < _this.failedTests.length; ++i){
                const failedTest = _this.failedTests[i];
                console.log("\t" + failedTest.name + " - Failed: " + failedTest.reason);
            }
        }

        if(_this.passedTests.length > 0){
            console.log("\n" + _this.name + " - Passed tests:");
            for(var i=0; i < _this.passedTests.length; ++i){
                console.log("\t" + _this.passedTests[i] + " - Passed.");
            }
        }
    }
};

module.exports = Testable;
