const bodyParser = require('body-parser');
const express = require('express');

var {BLACK_FOREST_API_KEY} = require('./src/Constants.js');
const App = require('./src/App.js');

// Initialize our app...
const app = new App(BLACK_FOREST_API_KEY);
app.init();

if((app.blackForestApiKey == null) || (app.blackForestApiKey == undefined)){
    console.error("\nERROR: BLACK_FOREST_API_KEY must be defined!\n");
    process.exit(0);
}

const expressApp = express();

expressApp.use(function(req, res, next) {    
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Credentials', true);
    next();
});

expressApp.use(require('sanitize').middleware);
expressApp.use(bodyParser.urlencoded());
expressApp.use(bodyParser.json());

expressApp.get('/styles', async(req, res)=>{
    try{
        app.getStyles(req, res);
    }
    catch(error){
        app.sendError(res, error.code, error.message);
    }
});

expressApp.post('/fontmaker', async(req, res)=>{
    try{
        app.fontMaker(req, res);
    }
    catch(error){
        app.sendError(res, error.code, error.message);
    }
});

const PORT = process.env.NODE_DOCKER_PORT || 5456;
expressApp.listen(PORT, ()=>{
    console.log("\nExpress is listening on port: ", PORT);
});
