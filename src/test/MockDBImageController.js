const DBController = require('../controllers/db_controllers/DBController');
const db = require('../../models');
const Image = db.images;

class MockDBImageController extends DBController{
    constructor(){
        super(Image);

        this.mockDBImage = {
            id: 'f09cac17-5bd2-4881-84b9-db9572d2c122',
            url: 'https://replicate.delivery/xezq/mIJEVd3w515RGxe9X44kioxeT33XumASNaiUwhPKXumoo0eoA/out-0.webp',
            styleId: 5,
            updatedAt: "2025-04-02T20:03:52.489Z",
            createdAt: "2025-04-02T20:03:52.489Z"
        }
    }

    getData(model){        
        return model;
    }

    async getModel(id, onSuccess, onError, res)
    {
      onSuccess(this.mockDBImage);
    }
  
    async getModelWhere(where, onSuccess, onError)
    {
      onSuccess(this.mockDBImage);
    }
  
    async getAllModels(page, pageSize, onSuccess, onError)
    {
      onSuccess([this.mockDBImage]);
    }
  
    async createModel(data, onSuccess, onError, res)
    {
      onSuccess(this.mockDBImage);
    }
}

module.exports = new MockDBImageController(Image);