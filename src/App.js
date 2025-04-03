const Axios = require('./Axios.js');
const Errors = require('./Errors.js');

const MockAxios = require('./test/MockAxios.js');
const MockRedis = require('./test/MockRedis.js');
const MockResponder = require('./test/MockResponder.js');
const MockDBImageController = require('./test/MockDBImageController.js');
const MockDBApiKeyController = require('./test/MockDBApiKeyController.js');

const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const {BLACK_FOREST_API_URL} = require('./Constants.js');

const RedisStore = require('./RedisStore.js');
const BaseController = require('./controllers/BaseController.js');
const DBImageController = require('./controllers/db_controllers/DBImageController.js');
const DBStyleController = require('./controllers/db_controllers/DBStyleController.js');
const DBApiKeyController = require('./controllers/db_controllers/DBApiKeyController.js');

class App extends BaseController{
    constructor(blackForestApiKey){
        super("App");

        this.blackForestApiKey = blackForestApiKey;
        
        this.init = this.init.bind(this);
        this._importStyles = this._importStyles.bind(this);
        this._constructPrompt = this._constructPrompt.bind(this);

        this.findStyleById = this.findStyleById.bind(this);
        this.fontMaker = this.fontMaker.bind(this);
        this.getStyles = this.getStyles.bind(this);
        this.saveImagetoDB = this.saveImagetoDB.bind(this);
        this.validatePOSTData = this.validatePOSTData.bind(this);
        this.postBFImageRequest = this.postBFImageRequest.bind(this);
    }

    async init(){
        const _this = this;
        
        _this.axios = new Axios();
        _this.redis = RedisStore;

        _this.imageDBController = DBImageController;
        _this.styleDBController = DBStyleController;
        _this.apiKeyDBController = DBApiKeyController;

        _this.initApiKey();
        _this._importStyles("./art_styles.json");
    }

    async initApiKey(){
        const _this = this;

        if(this.blackForestApiKey != null){            
            await _this.apiKeyDBController.checkApikey(this.blackForestApiKey, async(result)=>{
            if(!result){
                console.log("foundFlackForestApiKey - NOT found, adding to DB");
                await _this.apiKeyDBController.createApiKey(this.blackForestApiKey);
            }
            else{
                console.log("foundFlackForestApiKey - found in db");
            }
            });
        }
    }

    // Used in Axios requests
    getAxiosConfig(){
        const config = { params:{}, headers: {
            'Authorization': "Bearer " + this.blackForestApiKey,
            'Content-Type' : "application/json",
            'Prefer' : "wait"
        }};
        return config;
    }

    // Import styles from a JSON file
    async _importStyles(filename){
        DBStyleController.getAllModels(0, 10, async(foundStyles)=>{            
            if(foundStyles.length == 0){

                await fs.readFile(filename, async(error, data)=>{
                    if(data != null){
                        const styles = JSON.parse(data.toString());
                        if(styles != null){
                            for(var i=0; i < styles.length; ++i){
                                const style = styles[i];
                                const newStyle = {
                                    id: uuidv4(),
                                    ...style,
                                };
                                await DBStyleController.createModel(newStyle);

                                if(i == styles.length-1){
                                    this.styles = styles;
                                }
                            }                            
                        }
                    }
                });
            }
            else{
                this.styles = foundStyles;
            }            
        });
    }

    _constructPrompt(style, text){
        var prompt = `The text '${text}' in `

        prompt += style;

        if(style.indexOf('.') == -1){
            prompt += '.';
        }

        prompt += " Text should be spelled exactly like the word in quotes and no other text should be in the image";
        return prompt;
    }
 
    async findStyleById(styleId, onSuccess){
        const _this = this;
        
        // Check the Redis cache first
        var foundStyle = await _this.redis.getStyle(styleId.toString());
        if(foundStyle != null){
            onSuccess(foundStyle);    
            return;
        }        

        await _this.styleDBController.getModelWhere({styleId}, async(foundStyle)=>{

            // Allow the endpoint to send the response...
            onSuccess(foundStyle);
            
            // ...then cache in Redis
            if(foundStyle != null){                
                await  _this.redis.insertStyle(styleId, foundStyle);
            }
        });
    }

    async saveImagetoDB(imgUrl, styleId, onSuccess){
        const _this = this;

        const data ={
            id: uuidv4(),
            url: imgUrl,
            styleId
        };       
        
        await _this.imageDBController.createModel(data, (imgModel)=>{
            onSuccess(imgModel);
        });
    }

    // Endpoint to GET all styles
    async getStyles(req, res){
        try{
            res.json(this.styles);
        }
        catch(error){
            console.log("ERROR: ", error);
        }
    }

    validatePOSTData(req, res){
        const _this = this;

        var postData = req.body;
        if(postData == null){
            this.sendBadRequest(res, "No post data provided");
            return null;
        }

        // Use sanitize middleware to check POST data.
        // The error responses will be handled by BaseController.sendError,
        // so we check the return value on these to make sure error responses
        // don't get sent more than once. Must find a better way to handle this!
        const styleId = _this.validateBodyInt(req, res, 'styleId');
        if(styleId == null){
            return null;
        }

        const text = _this.validateBodyString(req, res, 'text');
        if(text == null){
            return null;
        }

        const numSamples = _this.validateBodyInt(req, res, 'numSamples');
        if(numSamples == null){
            return null;
        }
        return {styleId, text, numSamples};
    }

    // Endpoint to POST an image generation request to Black Forest
    async fontMaker(req, res){
        const _this = this;

        // Check for presence of Black Forest API key
        await _this.apiKeyDBController.checkHeaderApiKey(req, res, async(result)=>{

            console.log("fontMaker - result: ", result);

           if(result){
                const validated = _this.validatePOSTData(req, res);
                if(validated == null){
                    return;
                }

                const {styleId, text, numSamples} = validated;
        
                var foundStyle;
                await _this.findStyleById(styleId, async(style)=>{
                    foundStyle = style;
                });
        
                if(foundStyle == null)
                {
                    this.sendNotFound(res, `fontMaker - Style with styleId: ${styleId} not found!`);
                    return;
                }
        
                const prompt = this._constructPrompt(foundStyle.prompt, text);
                if(prompt == null){
                    this.sendInternalServerError(res, "Prompt creation failed");
                    return;
                }
        
                /*
                // Search the Redis image cache (this seems to be broken right now)
                const cachedImage = await  _this.redis.queryImage(text, styleId);
                if(cachedImage != null){
                    res.send(cachedImage);
                    return;
                }
                */
                
                await _this.postBFImageRequest(prompt, styleId, res);

                // res.send("ok");
            }
        });        
    }

    async postBFImageRequest(prompt, styleId, res, onSuccess, onError){
        const _this = this;

        console.log("prompt: ", prompt);

        if(prompt == null){
            _this.sendBadRequest(res, "prompt cannot be null");
            if(onError != null){
                onError(Errors.HTTP_BAD_REQUEST);
            }
            return;
        }

        const bfPostData =
        {
            input: {
                "prompt": prompt
            }
        };

        await _this.axios.post(BLACK_FOREST_API_URL, bfPostData, _this.getAxiosConfig(), async(response)=>{
             await _this.handleBFPostResponse(response, styleId, res, (result)=>{
                if(onSuccess != null){
                    onSuccess(result);
                }    
            });
            
        }, res);
    }

    async handleBFPostResponse(response, styleId, res, onSuccess, onError){
        const _this = this;

        if((response != null) && (response.data != null)){
            const output = response.data.output;

            if((output != null) && (output.length > 0)){
                const imgUrl = output[0];
                
                await _this.saveImagetoDB(imgUrl, styleId, async(imgModel)=>{
                    console.log("imgModel: ", imgModel);

                    if(res != null){
                        res.send(imgModel);
                    }

                    // Add to Redis cache after we send the response.
                    // We could do this before, but I'm assuming we want a 
                    // fast response the first time
                    // await  _this.redis.insertImage(imgModel.id, imgModel);

                    if(onSuccess != null){
                        onSuccess(true);
                    }
                })
            }
            else{                    
                _this.sendInternalServerError(res, "Output data array is empty or null");
                if(onError != null){
                    onError(Errors.HTTP_INTERNAL_SERVER_ERROR);
                }
            }
        }
        else{                    
            _this.sendInternalServerError(res, "No output data in Flux response");
            if(onError != null){
                onError(Errors.HTTP_INTERNAL_SERVER_ERROR);
            }
        }
    }
};

module.exports = App;