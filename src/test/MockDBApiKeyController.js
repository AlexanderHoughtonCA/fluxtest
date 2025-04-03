const DBController = require('../controllers/db_controllers/DBController');
const db = require('../../models');
const ApiKey = db.apikeys;

const base64 = require('base-64');
const bcrypt = require('bcryptjs');
const salt_rounds = 10;

const uuid = require('uuid');

class MockDBApiKeyController extends DBController {
    constructor() {
        super(ApiKey);

        this.createApiKey = this.createApiKey.bind(this);
        this.checkHeaderApiKey = this.checkHeaderApiKey.bind(this);
        this.checkApikey = this.checkApikey.bind(this);

        this.mockApiKey = {
            id: '4d7babfa-55ff-4dc7-86a0-180be45315f4',
            hashed_key: '$2a$10$BdE2AFAS0QReskpshVdM4ORVXeqQoKV.RwM8SkSoQgbN/s8BuMLTe',
            updatedAt: "2025-04-02T20:09:20.350Z",
            createdAt: "2025-04-02T20:09:20.350Z",
            description: null
        }
          
    }

    async createApiKey(existingKey, on_success, on_error) {
        on_success(this.mockApiKey);
    }

    async checkHeaderApiKey(req, res, on_success) {
        on_success(this.mockApiKey);
    }

    async checkApikey(apiKey, on_success) {
        on_success(this.mockApiKey);
    }

    getData(apiKey) {
        return apiKey;
    }

    async delete_apiKey(id, res, on_success, on_error) {       
        on_success(this.mockApiKey); 
    }
}

module.exports = new MockDBApiKeyController;
