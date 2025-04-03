const Testable = require('./Testable.js');

class UnitTester{

    constructor(name){

        this.name = name;
        this.testables = [];

        this.addTestable = this.addTestable.bind(this);
        this.run = this.run.bind(this);
    }

    addTestable(testable){
        this.testables.push(testable);
    }

    async run(){
        const _this = this;

        console.log("\nUnitTester running...");        
        for(var i=0; i < _this.testables.length; ++i){
            const testable = _this.testables[i];
            await testable.runTests();
        }
    }

    report(){
        const _this = this;

        console.log("\n****** UnitTester Report ******");
        
        for(var i=0; i < _this.testables.length; ++i){
            const testable = _this.testables[i];
            testable.report();
        }

        console.log("\n*******************************\n\n");
    }
};

module.exports = new UnitTester();
