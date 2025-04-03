

class MockAxios{

    constructor(mockResponder){
        this.mockResponder = mockResponder;

        this.post = this.post.bind(this);
    }

    async post(url, postData, config, onResponse, res){
        // console.log("MockAxios - response: ", this.mockResponder.response);
        onResponse(this.mockResponder.response);
    }
}

module.exports = MockAxios;