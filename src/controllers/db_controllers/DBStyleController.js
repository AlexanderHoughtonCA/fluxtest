const DBController = require('./DBController');
const { v4: uuidv4 } = require('uuid');
const db = require('../../../models');
const Style = db.styles;

class DBStyleController extends DBController{
    constructor(){
        super(Style);

        /*
        const data =
        {
            id: uuidv4(),
            name: 'kidult',
            prompt: "the kidult style of cute drawings done by a preschooler",
            styleId: 4
        };
        this.createModel(data);
        */

        /*
        this.getModel("5a4fd364-a6b4-441b-a7e6-c6794e29ad08", (Style)=>
        {
            console.log("Style: ", Style);
        });
        */
    }

    getData(model){
        const data ={
            styleId: model.styleId,
            name: model.name,
            prompt: model.prompt
        }
        return data;
    }
}

module.exports = new DBStyleController(Style);