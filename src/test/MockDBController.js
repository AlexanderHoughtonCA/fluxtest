
const BaseController = require('../BaseController.js');

class MockDBController extends BaseController
{
  constructor(db_type)
  {
    super(db_type.tableName + "MockDBController");

    this.db_type = db_type;

    this.getModel = this.getModel.bind(this);
    this.getModelWhere = this.getModelWhere.bind(this);
    this.getAllModels = this.getAllModels.bind(this);
    this.createModel = this.createModel.bind(this);

    console.log(this.name + " - initialized");
  }

  async getModel(id, onSuccess, onError, res)
  {
    onSuccess();
  }

  async getModelWhere(where, onSuccess, onError)
  {
    onSuccess();
  }

  async getAllModels(page, pageSize, onSuccess, onError)
  {
    onSuccess();
  }

  async createModel(data, onSuccess, onError, res)
  {
    onSuccess();
  }

  getData(modelData){
    return modelData;
  }
}

module.exports = MockDBController;

