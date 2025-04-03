
const { v4: uuidv4 } = require('uuid');
const BaseController = require('../BaseController.js');

class DBController extends BaseController
{
  constructor(db_type)
  {
    super(db_type.tableName + "DBController");

    this.db_type = db_type;

    this.getModel = this.getModel.bind(this);
    this.getModelWhere = this.getModelWhere.bind(this);
    this.getAllModels = this.getAllModels.bind(this);
    this.createModel = this.createModel.bind(this);

    console.log(this.name + " - initialized");
  }

  async getModel(id, onSuccess, onError, res)
  {
    const _this = this;

    const db_type = _this.db_type;
    const db_table_name = db_type.tableName;

    await db_type.findOne({where:{id: id}})
      .then(model =>
      {
        if(model != null)
        {
          if(onSuccess != null)
          {            
            onSuccess(model.dataValues);
          }
        }
        else
        {
          onSuccess(null);
        }
      })
      .catch((error) =>
      {
        const error_msg = db_table_name + " DBController.getModel - ERROR: " + error;
        console.log(error_msg);
        if(onError != null)
        {
          onError(error_msg);
        }
      });
  }

  async getModelWhere(where, onSuccess, onError)
  {
    var _this = this;
    const db_type = _this.db_type;
    const db_table_name = db_type.tableName;

    // console.log(db_table_name + " get_model_where for " + db_table_name + ", where: ", where);
    await db_type.findOne({where:where})
      .then(model =>
      {
        if(onSuccess != null)
        {
          if(model != null)
          {
            // console.log("get_model_where - model: ", model.dataValues);
            onSuccess(_this.getData(model.dataValues));
          }
          else
          {
            // console.log("get_model_where - " + db_table_name + " not found for: ", where);
            onSuccess(null);
          }
        }
      })
      .catch((error)=>
      {
        // console.log(db_table_name + " - get_model_where - ERROR: ",  error);
        if(onError != null)
        {
          onError(error);
        }
      });
  }

  async getAllModels(page, pageSize, onSuccess, onError)
  {
    const _this = this;

    const db_type = _this.db_type;
    const db_table_name = db_type.tableName;

    const params = {
      group: 'id', 
      limit: pageSize, 
      offset: page * pageSize,
      order: [['createdAt', 'DESC']]
    };

    await db_type.findAll(params)
      .then(models =>{

        var data = [];
        for(var i=0; i < models.length; ++i)
        {
          data.push(_this.getData(models[i].dataValues));
        }

        if(onSuccess != null)
        {
          onSuccess(data);
        }
      })
      .catch(err =>{
        console.log(err);
        if(onError != null)
        {
          onError(err);
        }
      });
  }

  async createModel(data, onSuccess, onError, res)
  {
    var _this = this;
    
    const db_type = _this.db_type;
    const db_table_name = db_type.tableName;

    if(data == null)
    {
      const error_msg = `createModel - Error: \nERROR, data is null!\nwhile creating ${db_table_name} record.`;
      console.log(error_msg);
      if(onError != null)
      {
        onError(error);
      }
      return;
    }

    // console.log("createModel - data: ", data);
    await db_type.create(data)
      .then(data =>
      {
        // console.log("Created model - data: ", data.dataValues);

        if(onSuccess != null)
        {
          onSuccess(_this.getData(data.dataValues));
        }

        if(res != null)
        {
          // console.log("SENDING RESPONSE, data: ", data.dataValues);
          res.send(JSON.stringify(data.dataValues));
        }
      })
      .catch(error =>
      {
        const error_msg = `Error: \n` + error + `\nwhile creating ${db_table_name} record.`;
        console.log(error_msg);

        if(onError != null)
        {
          onError(error);
        }
      });
  }

  getData(modelData){
    return modelData;
  }
}

module.exports = DBController;

