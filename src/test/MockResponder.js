

class MockResponder
{
    constructor(response){
        this.response = response;
    }

    send(){
        return this.response;
    }

    json(){
        return this.response;
    }
};

module.exports = MockResponder;