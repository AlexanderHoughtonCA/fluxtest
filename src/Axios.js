const axios = require('axios');
const BaseController = require('./controllers/BaseController.js');

class Axios extends BaseController{

    

   async post(url, postData, config, onResponse, res){
        await axios.post(url, postData, config)
            .then(async (response)=>{
                onResponse(response);
            })
            .catch(function (error)
            {
                _this.sendInternalServerError(res, error);
            });   
    }
}

module.exports = Axios;