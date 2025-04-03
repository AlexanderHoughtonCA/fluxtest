const DBController = require('./DBController.js');
const db = require('../../../models');
const ApiKey = db.apikeys;

const base64 = require('base-64');
const bcrypt = require('bcryptjs');
const salt_rounds = 10;

const uuid = require('uuid');

class DBApiKeyController extends DBController {
    constructor() {
        super(ApiKey);

        this.createApiKey = this.createApiKey.bind(this);
        this.checkHeaderApiKey = this.checkHeaderApiKey.bind(this);
        this.checkApikey = this.checkApikey.bind(this);
    }

    async createApiKey(existingKey, on_success, on_error) {
        const _this = this;

        const raw_apiKey = (existingKey != null) ? existingKey : uuid();
        const data =
        {
            hashed_key: bcrypt.hashSync(raw_apiKey, salt_rounds)
        }

        await _this.createModel(data, (db_apiKey) => {
            if (on_success != null) {
                // console.log("created api key: ", db_apiKey);
                on_success(db_apiKey);
            }
        },
        (error) => {
            console.log('DBApiKeyController.createApiKey - error creating API key:', error);
            if (on_error != null) {
                on_error(error);
            }
        });
    }

    // NOTE: Don't forget to add "fluxtest-apikey" to the request Access-Control-Allow-Headers header
    async checkHeaderApiKey(req, res, on_success) {
        const _this = this;

        const ftApiKey = req.headers["fluxtest-apikey"];
        if ((ftApiKey != null) && (ftApiKey.length > 0)) {
            await _this.checkApikey(ftApiKey, (valid) => {
                if (valid) {
                    on_success(true);
                }
                else {
                    _this.sendUnauthorized(res, "checkHeaderApiKey - Access Denied for " + req.url);
                    on_success(false, null);
                }
            });
        }
        else {
            _this.sendUnauthorized(res, "checkHeaderApiKey - Access Denied - fluxtest-apikey not found!");
            on_success(false);
        }
    }

    async checkApikey(apiKey, on_success) {
        const _this = this;

        await _this.getAllModels(0, 10000, async(models)=>{
            if(models.length == 0){
                on_success(false);
            }
            else{
                var count = 0;
                for(var i=0; i < models.length; ++i){
                    const dbApiKey = models[i];
                    await bcrypt.compare(apiKey, dbApiKey.hashed_key, (err, result) => {
                        if((result === true) || (i == models.length)){
                            on_success(result);
                        }
                    });
                }
            }
        });            
    }

    getData(apiKey) {
        return {hashed_key: apiKey.hashed_key};
    }

    async delete_apiKey(id, res, on_success, on_error) {
        const _this = this;
        await _this.deleteModelById(id, (result) => {
            if (result) {
                if (on_success != null) {
                    on_success(result);
                }

                if (res != null) {
                    res.send({ message: 'API Key deleted successfully' });
                }
            }
            else {
                const error = 'API Key not found';
                console.log('DBApiKeyController.delete_apiKey -', error);
                if (on_error != null) {
                    on_error(error);
                }
            }
        }, (error) => {
            console.log('DBApiKeyController.delete_apiKey - error deleting API key:', error);
            if (on_error != null) {
                on_error(error);
            }
        }, res);
    }
}

module.exports = new DBApiKeyController;
