const Errors = require('../Errors.js');

const MockAxios = require('./MockAxios.js');
const MockRedis = require('./MockRedis.js');
const MockResponder = require('./MockResponder.js');
const MockDBImageController = require('./MockDBImageController.js');
const MockDBApiKeyController = require('./MockDBApiKeyController.js');

const App = require('../App.js');

class TestApp extends App{
    constructor(blackForestApiKey){
        super("AppTest");      

        // Unit test functionality
        this.runTests = this.runTests.bind(this);
        this.mockBFPostPass = this.mockBFPostPass.bind(this);
        this.mockBFPostFailNullPrompt = this.mockBFPostFailNullPrompt.bind(this);
        this.mockBFPostResponseFailNullBFResponse = this.mockBFPostResponseFailNullBFResponse.bind(this);
        this.mockBFPostResponseFailNullBFOutput = this.mockBFPostResponseFailNullBFOutput.bind(this);
    }

    // Blank this out in case of accidental call
    async init(){}

    async initMock(){
        const _this = this;
       
        _this.redis = new MockRedis();
        _this.imageDBController = MockDBImageController;
        _this.apiKeyDBController = MockDBApiKeyController;

        const fakeResponse = {
            data: {
                output: ["'https://replicate.delivery/xezq/DpURgNPP4spMCRf8bcGzF28z12cRV4rfgX5Vtm0M8uFX7zeoA/out-0.webp'"]
            }
        }        
        _this.mockResponder = new MockResponder(fakeResponse);
        _this.axios = new MockAxios(_this.mockResponder);

        _this.mockPrompt = "The text 'SOME RANDOM TEXT!' in the linocut style of minimalistic stylised line work. Text should be spelled exactly like the word in quotes and no other text should be in the image";

        _this.initApiKey();
        _this._importStyles("./art_styles.json");
    }

    // Unit test runner
    async runTests(){
        const _this = this;

        await _this.initMock();

        _this.mockBFPostResponse();
        _this.mockBFPostPass();
        _this.mockBFPostFailNullPrompt();
        _this.mockBFPostResponseFailNullBFResponse();
        _this.mockBFPostResponseFailNullBFOutput();
    }

    async mockBFPostPass(){
        const _this = this;
        
        await _this.postBFImageRequest(_this.mockPrompt, 5, this.mockResponder, (result)=>{
            // console.log("mockBFPostPass - result: ", result);
            _this.assertTrue("mockBFPostPass", result, "postBFImageRequest must succeed");
        });
    }

    async mockBFPostFailNullPrompt(){
        const _this = this;
        
        await _this.postBFImageRequest(null, 5, this.mockResponder, null, (errorCode)=>{            
            _this.assertTrue("mockBFPostFail", (errorCode==Errors.HTTP_BAD_REQUEST), "prompt must not be null");
        });
    }

    async mockBFPostResponse(){
        const _this = this;

        console.log("\n\n\nmockBFPostResponse....");

        await _this.handleBFPostResponse(_this.mockResponder.response, 
                                                         5, 
                                                        _this.mockResponder, 
                                                         (result)=>{
            console.log("mockBFPostResponse - result: ", result);
            _this.assertTrue("mockBFPostResponse", result, "handleBFPostResponse must succeed");
        });
        
    }

    async mockBFPostResponseFailNullBFResponse(){
        const _this = this;

        await _this.handleBFPostResponse(null, 
                                                         null, 
                                                        _this.mockResponder,
                                                        null,
                                                         (errorCode)=>{
            _this.assertTrue("mockBFPostResponseFailNullBFResponse", (errorCode==Errors.HTTP_INTERNAL_SERVER_ERROR), "error must be HTTP_INTERNAL_SERVER_ERROR");
        });
    }

    async mockBFPostResponseFailNullBFOutput(){
        const _this = this;

        var invalidResponse = {
            ..._this.mockResponder.response
        };
        invalidResponse.data.output = null;

        await _this.handleBFPostResponse(invalidResponse, 
                                                         5, 
                                                        _this.mockResponder,
                                                        null,
                                                         (errorCode)=>{
            _this.assertTrue("mockBFPostResponseFailNullBFOutput", (errorCode==Errors.HTTP_INTERNAL_SERVER_ERROR), "error must be HTTP_INTERNAL_SERVER_ERROR");
        });
    }

};

module.exports = TestApp;