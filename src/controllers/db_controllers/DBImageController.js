const DBController = require('./DBController');
const { v4: uuidv4 } = require('uuid');
const db = require('../../../models');
const Image = db.images;

class DBImageController extends DBController{
    constructor(){
        super(Image);
    }

    getData(model){
        const data ={
            id: model.id,
            url: model.url,
            styleId: model.styleId,
            createdAt: model.createdAt,
        }
        return data;
    }
}

module.exports = new DBImageController(Image);